<?php
require_once 'config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$conn = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $author = isset($_POST['author']) ? trim($_POST['author']) : '';
    $content = isset($_POST['content']) ? trim($_POST['content']) : '';
    
    if (empty($author)) {
        echo json_encode(['error' => 'Хэн бичиж байгааг сонгоно уу']);
        exit;
    }
    
    if (empty($content)) {
        echo json_encode(['error' => 'Бодол санаагаа бичнэ үү']);
        exit;
    }
    
    if (strlen($content) > 5000) {
        echo json_encode(['error' => 'Хэт урт байна (max 5000 тэмдэгт)']);
        exit;
    }
    
    $stmt = $conn->prepare('INSERT INTO thoughts (author, content, timestamp, status) VALUES (?, ?, NOW(), 1)');
    
    if (!$stmt) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    
    $stmt->bind_param('ss', $author, $content);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Амжилттай илгээлээ! 💌',
            'id' => $stmt->insert_id
        ]);
    } else {
        echo json_encode(['error' => 'Илгээхэд алдаа гарлаа: ' . $stmt->error]);
    }
    
    $stmt->close();
} else {
    echo json_encode(['error' => 'Invalid request method']);
}

$conn->close();
?>
