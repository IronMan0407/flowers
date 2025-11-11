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

// Fetch data with pagination support
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

$query = 'SELECT id, url, comment, timestamp FROM oyu_memories ORDER BY timestamp DESC LIMIT ? OFFSET ?';
$stmt = $conn->prepare($query);
$stmt->bind_param('ii', $limit, $offset);
$stmt->execute();
$result = $stmt->get_result();

$memories = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $memories[] = $row;
    }
}

$stmt->close();
$conn->close();

echo json_encode($memories);
?>
