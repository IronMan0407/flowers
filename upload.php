<?php
require_once 'config.php';

header('Content-Type: application/json');

// Increase limits for iPhone photos
ini_set('upload_max_filesize', '10M');
ini_set('post_max_size', '10M');
ini_set('memory_limit', '128M');

$conn = getDbConnection();

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check for upload errors first
    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        $error_message = 'Upload failed';
        if (isset($_FILES['photo']['error'])) {
            switch ($_FILES['photo']['error']) {
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    $error_message = 'File too large (max 10MB)';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $error_message = 'No file uploaded';
                    break;
                case UPLOAD_ERR_NO_TMP_DIR:
                    $error_message = 'Missing temporary folder';
                    break;
                case UPLOAD_ERR_CANT_WRITE:
                    $error_message = 'Failed to write file to disk';
                    break;
                default:
                    $error_message = 'Upload error code: ' . $_FILES['photo']['error'];
            }
        }
        echo json_encode(['error' => $error_message]);
        exit;
    }

    $photo = $_FILES['photo'];
    $comment = isset($_POST['comment']) ? trim($_POST['comment']) : '';

    // CRITICAL FIX: Add image/pjpeg for iPhone compatibility
    $allowedTypes = [
        'image/jpeg', 
        'image/jpg', 
        'image/pjpeg',  // iPhone/IE sends this for JPEG
        'image/png', 
        'image/gif', 
        'image/webp'
    ];
    
    // Also validate using file extension (case-insensitive)
    $extension = strtolower(pathinfo($photo['name'], PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!in_array($extension, $allowedExtensions)) {
        echo json_encode(['error' => "Invalid file extension: .$extension. Only JPG, JPEG, PNG, GIF, and WEBP allowed."]);
        exit;
    }

    // Double-check MIME type using finfo
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $detectedMime = finfo_file($finfo, $photo['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($photo['type'], $allowedTypes) && !in_array($detectedMime, $allowedTypes)) {
        echo json_encode(['error' => "Invalid file type detected: {$photo['type']} / $detectedMime"]);
        exit;
    }

    // Validate file size (max 10MB for iPhone photos)
    if ($photo['size'] > 10 * 1024 * 1024) {
        echo json_encode(['error' => 'File too large. Maximum size is 10MB.']);
        exit;
    }

    // Create uploads directory if it doesn't exist
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Generate unique filename - always use .jpg for JPEG files
    if (in_array($extension, ['jpg', 'jpeg'])) {
        $extension = 'jpg';
    }
    $filename = uniqid('photo_', true) . '.' . $extension;
    $filePath = $uploadDir . $filename;

    // CRITICAL FIX: Handle iPhone JPEG orientation
    if (in_array($detectedMime, ['image/jpeg', 'image/jpg', 'image/pjpeg']) || 
        in_array($extension, ['jpg', 'jpeg'])) {
        
        $image = @imagecreatefromjpeg($photo['tmp_name']);
        
        if ($image !== false) {
            // Fix orientation using EXIF data
            if (function_exists('exif_read_data')) {
                $exif = @exif_read_data($photo['tmp_name']);
                
                if ($exif && isset($exif['Orientation'])) {
                    switch ($exif['Orientation']) {
                        case 3:
                            $image = imagerotate($image, 180, 0);
                            break;
                        case 6:
                            $image = imagerotate($image, -90, 0);
                            break;
                        case 8:
                            $image = imagerotate($image, 90, 0);
                            break;
                    }
                }
            }
            
            // Save the corrected image
            if (!imagejpeg($image, $filePath, 85)) {
                imagedestroy($image);
                echo json_encode(['error' => 'Failed to save corrected image']);
                exit;
            }
            imagedestroy($image);
        } else {
            // Fallback if image processing fails
            if (!move_uploaded_file($photo['tmp_name'], $filePath)) {
                echo json_encode(['error' => 'File upload failed']);
                exit;
            }
        }
    } else {
        // For non-JPEG files, just move
        if (!move_uploaded_file($photo['tmp_name'], $filePath)) {
            echo json_encode(['error' => 'File upload failed']);
            exit;
        }
    }

    // Insert into database
    $stmt = $conn->prepare('INSERT INTO oyu_memories (url, comment, timestamp, status) VALUES (?, ?, NOW(), 1)');
    $stmt->bind_param('ss', $filePath, $comment);

    if (!$stmt->execute()) {
        unlink($filePath);
        echo json_encode(['error' => 'Database insert failed: ' . $stmt->error]);
        exit;
    }

    $stmt->close();
    echo json_encode(['success' => true, 'url' => $filePath]);
}

$conn->close();
?>
