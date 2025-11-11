<?php
header('Content-Type: application/json');

// Database connection
$host = '127.0.0.1';
$username = 'root';
$password = 'Yaphets123';
$database = 'flowers';

$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['photo'])) {
        echo json_encode(['error' => 'No photo uploaded']);
        exit;
    }

    $photo = $_FILES['photo'];
    $comment = isset($_POST['comment']) ? trim($_POST['comment']) : '';

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($photo['type'], $allowedTypes)) {
        echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, GIF, and WEBP allowed.']);
        exit;
    }

    // Validate file size (max 5MB)
    if ($photo['size'] > 5 * 1024 * 1024) {
        echo json_encode(['error' => 'File too large. Maximum size is 5MB.']);
        exit;
    }

    // Create uploads directory if it doesn't exist
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generate unique filename
    $extension = pathinfo($photo['name'], PATHINFO_EXTENSION);
    $filename = uniqid('photo_', true) . '.' . $extension;
    $filePath = $uploadDir . $filename;

    // Move uploaded file
    if (!move_uploaded_file($photo['tmp_name'], $filePath)) {
        echo json_encode(['error' => 'File upload failed']);
        exit;
    }

    // Insert into database (store raw comment, escape on display)
    $stmt = $conn->prepare('INSERT INTO oyu_memories (url, comment, timestamp) VALUES (?, ?, NOW())');
    $stmt->bind_param('ss', $filePath, $comment);

    if (!$stmt->execute()) {
        // Delete uploaded file if database insert fails
        unlink($filePath);
        echo json_encode(['error' => 'Database insert failed: ' . $stmt->error]);
        exit;
    }

    $stmt->close();
    echo json_encode(['success' => true, 'url' => $filePath]);
}

$conn->close();
?>
