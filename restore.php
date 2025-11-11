<?php
header('Content-Type: application/json');

$conn = new mysqli('127.0.0.1', 'root', 'Yaphets123', 'flowers');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id']);
    
    $stmt = $conn->prepare('UPDATE oyu_memories SET status = 1 WHERE id = ?');
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to restore']);
    }
    
    $stmt->close();
}

$conn->close();
?>
