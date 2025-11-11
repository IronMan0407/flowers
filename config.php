<?php
// config.php - Database configuration for Railway deployment

function getDbConnection() {
    // Railway provides these environment variables automatically
    $host = getenv('MYSQLHOST') ?: '127.0.0.1';
    $username = getenv('MYSQLUSER') ?: 'root';
    $password = getenv('MYSQLPASSWORD') ?: 'Yaphets123';
    $database = getenv('MYSQLDATABASE') ?: 'flowers';
    $port = getenv('MYSQLPORT') ?: 3306;
    
    $conn = new mysqli($host, $username, $password, $database, $port);
    
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        die("Connection failed. Please try again later.");
    }
    
    $conn->set_charset("utf8mb4");
    return $conn;
}
?>
