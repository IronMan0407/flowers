<?php
require_once 'config.php';

header('Content-Type: application/json');

$conn = getDbConnection();

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
