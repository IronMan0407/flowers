<?php
echo "<h1>Environment Variables Debug</h1>";

echo "<h2>Railway Detection:</h2>";
echo "<p>RAILWAY_ENVIRONMENT: " . (getenv('RAILWAY_ENVIRONMENT') ? '✅ Yes (on Railway)' : '❌ No (local)') . "</p>";

echo "<h2>MySQL Environment Variables:</h2>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Variable</th><th>Value</th><th>Status</th></tr>";

$vars = ['MYSQLHOST', 'MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLDATABASE', 'MYSQLPORT'];

foreach ($vars as $var) {
    $value = getenv($var);
    $status = $value ? '✅ Set' : '❌ Not Set';
    $display = $value ? ($var === 'MYSQLPASSWORD' ? '******' : $value) : 'Not set';
    
    echo "<tr>";
    echo "<td><strong>$var</strong></td>";
    echo "<td>$display</td>";
    echo "<td>$status</td>";
    echo "</tr>";
}

echo "</table>";

echo "<h2>All Environment Variables:</h2>";
echo "<pre>";
foreach ($_ENV as $key => $value) {
    if (strpos($key, 'MYSQL') !== false || strpos($key, 'RAILWAY') !== false) {
        echo "$key = " . (strpos($key, 'PASSWORD') !== false ? '******' : $value) . "\n";
    }
}
echo "</pre>";
?>
