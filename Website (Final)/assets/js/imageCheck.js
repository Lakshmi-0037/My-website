
// Function to check if an image exists
function imageExists(url, callback) {
    const img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
}

// Fix missing images
document.addEventListener('DOMContentLoaded', function() {
    // Check all images on the page
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        const originalSrc = img.src;
        
        // Skip SVG images and images with data URLs
        if (originalSrc.includes('data:') || originalSrc.endsWith('.svg')) {
            return;
        }
        
        imageExists(originalSrc, function(exists) {
            if (!exists) {
                // Try finding the image in different directories
                const fileName = originalSrc.split('/').pop();
                const alternativePaths = [
                    `assets/img/${fileName}`,
                    `../assets/img/${fileName}`,
                    `../../assets/img/${fileName}`
                ];
                
                // Try each alternative path
                let found = false;
                alternativePaths.forEach(path => {
                    if (!found) {
                        imageExists(path, function(pathExists) {
                            if (pathExists && !found) {
                                img.src = path;
                                found = true;
                                console.log(`Fixed image path: ${originalSrc} -> ${path}`);
                            }
                        });
                    }
                });
            }
        });
    });
});
