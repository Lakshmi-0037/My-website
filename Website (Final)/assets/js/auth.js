
// Create login modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createLoginModal();
    // Show login modal as soon as page loads
    setTimeout(showLoginModal, 500);
});

// Create the login modal
function createLoginModal() {
    const modal = document.createElement('div');
    modal.id = 'loginModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Login</h2>
            <form id="loginForm" class="auth-form">
                <div class="input-field">
                    <input type="text" name="username" id="username" class="auth-input"
                        placeholder="Enter Your Username" required>
                    <div class="underline"></div>
                </div>
                <div class="input-field">
                    <input type="password" name="password" id="password" class="auth-input"
                        placeholder="Enter Your Password" required>
                    <div class="underline"></div>
                </div>
                <button type="submit" class="auth-button">Login</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close button functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple validation (in a real app, you'd want more robust validation)
        if (username && password) {
            // Store user data
            storeUserData(username);
            
            // Hide modal
            modal.classList.remove('show');
            
            // Add logout button to nav menu
            addLogoutButton();
        }
    });
}

// Show the login modal
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function storeUserData(username) {
    // Create a simple object with user data and login timestamp
    const userData = {
        username: username,
        loginTime: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // Convert user data to JSON string to store temporarily
    const userDataStr = JSON.stringify(userData);
    localStorage.setItem('userData', userDataStr);
    
    // Send data to server-side for Excel storage
    fetch('store-user-data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: userDataStr
    })
    .then(response => {
        if (response.ok) {
            console.log('User data stored successfully');
        } else {
            console.error('Failed to store user data');
        }
    })
    .catch(error => {
        console.error('Error storing user data:', error);
    });
}

// Add logout button to navigation
function addLogoutButton() {
    const navList = document.querySelector('.nav__list');
    if (navList) {
        // Check if logout button already exists
        if (!document.getElementById('logoutButton')) {
            const logoutItem = document.createElement('li');
            logoutItem.className = 'nav__item';
            logoutItem.innerHTML = '<a href="#" id="logoutButton" class="nav__link">Logout</a>';
            navList.appendChild(logoutItem);
            
            // Add event listener to logout button
            document.getElementById('logoutButton').addEventListener('click', logoutUser);
        }
    }
}

// Logout function
function logoutUser(e) {
    e.preventDefault();
    
    // Clear user data from local storage
    localStorage.removeItem('userData');
    
    // Redirect to thank you page
    window.location.href = 'thank-you.html';
}

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        // User is logged in, add logout button
        addLogoutButton();
    }
});
