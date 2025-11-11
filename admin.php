<?php
require_once 'config.php';

$conn = getDbConnection();

$query = 'SELECT id, url, comment, status, timestamp FROM oyu_memories ORDER BY timestamp DESC';
$result = $conn->query($query);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin - All Memories</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .header { background: #333; color: white; padding: 20px; margin: -20px -20px 20px -20px; }
        .header h1 { margin: 0; }
        .header a { color: #4CAF50; text-decoration: none; }
        table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
        th { background: #333; color: white; }
        .active { color: green; font-weight: bold; }
        .deleted { color: red; font-weight: bold; }
        img { max-width: 100px; height: auto; border-radius: 5px; }
        .restore-btn { background: #4CAF50; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; }
        .restore-btn:hover { background: #45a049; }
        .no-data { text-align: center; padding: 40px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Admin Panel - All Memories</h1>
        <a href="album.php">← Back to Album</a>
    </div>
    
    <?php if ($result && $result->num_rows > 0): ?>
    <table>
        <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Comment</th>
            <th>Status</th>
            <th>Timestamp</th>
            <th>Action</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?php echo $row['id']; ?></td>
            <td><img src="<?php echo htmlspecialchars($row['url']); ?>" alt="Memory"></td>
            <td><?php echo nl2br(htmlspecialchars($row['comment'])); ?></td>
            <td class="<?php echo $row['status'] == 1 ? 'active' : 'deleted'; ?>">
                <?php echo $row['status'] == 1 ? 'Active' : 'Deleted'; ?>
            </td>
            <td><?php echo $row['timestamp']; ?></td>
            <td>
                <?php if ($row['status'] == 0): ?>
                <button class="restore-btn" onclick="restore(<?php echo $row['id']; ?>)">
                    Restore
                </button>
                <?php endif; ?>
            </td>
        </tr>
        <?php endwhile; ?>
    </table>
    <?php else: ?>
    <div class="no-data">
        <p>No memories found. Upload some images first!</p>
        <a href="album.php">Go to Album</a>
    </div>
    <?php endif; ?>

    <script>
    async function restore(id) {
        if (!confirm('Restore this image?')) return;
        
        const formData = new FormData();
        formData.append('id', id);
        
        try {
            const response = await fetch('restore.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (result.success) {
                alert('Restored successfully!');
                location.reload();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
    </script>
</body>
</html>
<?php $conn->close(); ?>
