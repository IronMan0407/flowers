<?php
require_once 'config.php';

header('Content-Type: application/json');

$conn = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    
    if ($id <= 0) {
        echo json_encode(['error' => 'Invalid ID']);
        exit;
    }

    $stmt = $conn->prepare('UPDATE oyu_memories SET status = 0 WHERE id = ?');
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Image deleted successfully']);
    } else {
        echo json_encode(['error' => 'Failed to delete image']);
    }

    $stmt->close();
}

$conn->close();
?>
