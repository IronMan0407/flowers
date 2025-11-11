<?php

function getDbConnection() {
    $mysqlUrl = getenv('MYSQL_URL');
    
    if ($mysqlUrl) {
        $url = parse_url($mysqlUrl);
        $host = $url['host'];
        $username = $url['user'];
        $password = $url['pass'];
        $database = ltrim($url['path'], '/');
        $port = $url['port'] ?? 3306;
    } else {
        $host = getenv('MYSQLHOST') ?: '127.0.0.1';
        $username = getenv('MYSQLUSER') ?: 'root';
        $password = getenv('MYSQLPASSWORD') ?: 'Yaphets123';
        $database = getenv('MYSQL_DATABASE') ?: 'flowers';
        $port = getenv('MYSQLPORT') ?: 3306;
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
