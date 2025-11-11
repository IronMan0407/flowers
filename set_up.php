<?php
// setup_db.php - Creates tables in Railway MySQL database

require_once 'config.php';

echo "<!DOCTYPE html>
<html>
<head>
    <title>Database Setup</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f5f5f5; }
        .success { color: green; }
        .error { color: red; }
        table { border-collapse: collapse; margin: 20px 0; background: white; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #4CAF50; color: white; }
    </style>
</head>
<body>";

echo "<h1>🚀 Database Setup for Railway</h1>";

try {
    $conn = getDbConnection();
    echo "<p class='success'>✅ Connected to Railway MySQL database</p>";
    
    // SQL to create oyu_memories table
    $sql_memories = "CREATE TABLE IF NOT EXISTS oyu_memories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url VARCHAR(500) NOT NULL,
        comment TEXT,
        timestamp DATETIME NOT NULL,
        status TINYINT(1) DEFAULT 1 COMMENT '1=active, 0=deleted',
        INDEX(timestamp),
        INDEX(status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    if ($conn->query($sql_memories) === TRUE) {
        echo "<p class='success'>✅ Table 'oyu_memories' created with columns:</p>";
        echo "<ul>
            <li>id (INT, AUTO_INCREMENT, PRIMARY KEY)</li>
            <li>url (VARCHAR 500)</li>
            <li>comment (TEXT)</li>
            <li>timestamp (DATETIME)</li>
            <li>status (TINYINT)</li>
        </ul>";
    } else {
        echo "<p class='error'>❌ Error creating oyu_memories: " . $conn->error . "</p>";
    }
    
    // SQL to create thoughts table
    $sql_thoughts = "CREATE TABLE IF NOT EXISTS thoughts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        author VARCHAR(50) NOT NULL COMMENT 'Name of who wrote it',
        content TEXT NOT NULL,
        timestamp DATETIME NOT NULL,
        status TINYINT(1) DEFAULT 1 COMMENT '1=active, 0=deleted',
        INDEX(timestamp),
        INDEX(status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    if ($conn->query($sql_thoughts) === TRUE) {
        echo "<p class='success'>✅ Table 'thoughts' created with columns:</p>";
        echo "<ul>
            <li>id (INT, AUTO_INCREMENT, PRIMARY KEY)</li>
            <li>author (VARCHAR 50)</li>
            <li>content (TEXT)</li>
            <li>timestamp (DATETIME)</li>
            <li>status (TINYINT)</li>
        </ul>";
    } else {
        echo "<p class='error'>❌ Error creating thoughts: " . $conn->error . "</p>";
    }
    
    // Show all tables in database
    echo "<h2>📋 Tables in Database:</h2>";
    $result = $conn->query("SHOW TABLES");
    if ($result->num_rows > 0) {
        echo "<ul>";
        while ($row = $result->fetch_array()) {
            echo "<li><strong>" . $row[0] . "</strong></li>";
        }
        echo "</ul>";
    } else {
        echo "<p>No tables found</p>";
    }
    
    // Show structure of oyu_memories
    echo "<h2>🔍 Structure of 'oyu_memories' table:</h2>";
    $result = $conn->query("DESCRIBE oyu_memories");
    if ($result) {
        echo "<table>";
        echo "<tr><th>Column Name</th><th>Data Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td><strong>{$row['Field']}</strong></td>";
            echo "<td>{$row['Type']}</td>";
            echo "<td>{$row['Null']}</td>";
            echo "<td>{$row['Key']}</td>";
            echo "<td>" . ($row['Default'] ?? 'NULL') . "</td>";
            echo "<td>{$row['Extra']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    // Show structure of thoughts
    echo "<h2>🔍 Structure of 'thoughts' table:</h2>";
    $result = $conn->query("DESCRIBE thoughts");
    if ($result) {
        echo "<table>";
        echo "<tr><th>Column Name</th><th>Data Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td><strong>{$row['Field']}</strong></td>";
            echo "<td>{$row['Type']}</td>";
            echo "<td>{$row['Null']}</td>";
            echo "<td>{$row['Key']}</td>";
            echo "<td>" . ($row['Default'] ?? 'NULL') . "</td>";
            echo "<td>{$row['Extra']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    
    $conn->close();
    
    echo "<hr>";
    echo "<h2 class='success'>✅ Setup Complete!</h2>";
    echo "<p><strong>Your database tables are now created with all columns.</strong></p>";
    echo "<p>⚠️ <strong>Important:</strong> Delete this file (setup_db.php) for security after setup is complete.</p>";
    echo "<p><a href='index.html' style='background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Go to Homepage</a></p>";
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Error: " . $e->getMessage() . "</p>";
    echo "<p>Make sure you've added Variable Reference in Railway!</p>";
}

echo "</body></html>";
?>
