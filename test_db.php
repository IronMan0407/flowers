<?php
require_once 'config.php';

echo "<h1>Database Connection Test</h1>";

try {
    $conn = getDbConnection();
    echo "<p style='color: green;'>✅ Connected successfully!</p>";
    
    echo "<h2>Connection Details:</h2>";
    echo "<ul>";
    echo "<li>Host: " . getenv('MYSQLHOST') . "</li>";
    echo "<li>User: " . getenv('MYSQLUSER') . "</li>";
    echo "<li>Database: " . getenv('MYSQLDATABASE') . "</li>";
    echo "<li>Port: " . getenv('MYSQLPORT') . "</li>";
    echo "</ul>";
    
    $conn->close();
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Connection failed: " . $e->getMessage() . "</p>";
}
?>
