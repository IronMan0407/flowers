<?php
// config.php - Database configuration for Railway deployment

function getDbConnection() {
    // Check if we're on Railway or local
    $isRailway = getenv('RAILWAY_ENVIRONMENT') !== false;
    
    // Get environment variables
    $host = getenv('MYSQLHOST') ?: '127.0.0.1';
    $username = getenv('MYSQLUSER') ?: 'root';
    $password = getenv('MYSQLPASSWORD') ?: 'Yaphets123';
    $database = getenv('MYSQLDATABASE') ?: ($isRailway ? 'railway' : 'flowers');
    $port = getenv('MYSQLPORT') ?: 3306;
    
    // Debug: Log connection attempt (only on Railway)
    if ($isRailway) {
        error_log("Attempting to connect to Railway MySQL:");
        error_log("Host: " . $host);
        error_log("User: " . $username);
        error_log("Database: " . $database);
        error_log("Port: " . $port);
    }
    
    $conn = new mysqli($host, $username, $password, $database, $port);
    
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        
        // Show helpful error message
        if ($isRailway) {
            die("Railway database connection failed. Please check Variable Reference is set up correctly.");
        } else {
            die("Local database connection failed. Make sure Docker is running.");
        }
    }
    
    $conn->set_charset("utf8mb4");
    return $conn;
}
?>
