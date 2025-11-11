<?php
// config.php - Database configuration for Railway deployment

function getDbConnection() {
    // Check if MYSQL_URL is available (Railway format)
    $mysqlUrl = getenv('MYSQL_URL');
    
    if ($mysqlUrl) {
        // Parse Railway's MYSQL_URL format:
        // mysql://root:password@mysql.railway.internal:3306/railway
        $url = parse_url($mysqlUrl);
        
        $host = $url['host'];
        $username = $url['user'];
        $password = $url['pass'];
        $database = ltrim($url['path'], '/');
        $port = $url['port'] ?? 3306;
    } else {
        // Local development fallback
        $host = '127.0.0.1';
        $username = 'root';
        $password = 'Yaphets123';
        $database = 'flowers';
        $port = 3306;
    }
    
    $conn = new mysqli($host, $username, $password, $database, $port);
    
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        die("Connection failed. Please try again later.");
    }
    
    $conn->set_charset("utf8mb4");
    return $conn;
}
?>
