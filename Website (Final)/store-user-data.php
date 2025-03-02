<?php
require 'vendor/autoload.php'; // Load PhpSpreadsheet

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

// Get the JSON data from the request
$jsonData = file_get_contents('php://input');
$userData = json_decode($jsonData, true);

if (!$userData || !isset($userData['username']) || !isset($userData['loginTime'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid user data']);
    exit;
}

$filename = 'user_data.xlsx';

if (file_exists($filename)) {
    // Load existing Excel file
    $spreadsheet = IOFactory::load($filename);
    $worksheet = $spreadsheet->getActiveSheet();
    $row = $worksheet->getHighestRow() + 1; // Get next available row
} else {
    // Create a new spreadsheet if file doesn't exist
    $spreadsheet = new Spreadsheet();
    $worksheet = $spreadsheet->getActiveSheet();
    
    // Set headers
    $worksheet->setCellValue('A1', 'Username');
    $worksheet->setCellValue('B1', 'Login Time');
    $worksheet->setCellValue('C1', 'User Agent');
    $row = 2; // Start data from row 2
}

// Insert new data into the next available row
$worksheet->setCellValue("A$row", $userData['username']);
$worksheet->setCellValue("B$row", $userData['loginTime']);
$worksheet->setCellValue("C$row", $userData['userAgent'] ?? 'Unknown');

// Save the Excel file
$writer = new Xlsx($spreadsheet);
$writer->save($filename);

// Return success response
http_response_code(200);
echo json_encode(['success' => true, 'file' => $filename]);
?>
