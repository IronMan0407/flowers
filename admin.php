<?php
$conn = new mysqli('127.0.0.1', 'root', 'Yaphets123', 'flowers');

// Get all memories including deleted
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
        table { width: 100%; border-collapse: collapse; background: white; }
        th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
        th { background: #333; color: white; }
        .active { color: green; font-weight: bold; }
        .deleted { color: red; font-weight: bold; }
        img { max-width: 100px; height: auto; }
        .restore-btn { background: #4CAF50; color: white; border: none; padding: 5px 10px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Admin Panel - All Memories</h1>
    <a href="album.php">← Back to Album</a>
    
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
            <td><img src="<?php echo $row['url']; ?>" alt="Memory"></td>
            <td><?php echo nl2br(trim($row['comment'])); ?></td>
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

    <script>
    async function restore(id) {
        if (!confirm('Restore this image?')) return;
        
        const formData = new FormData();
        formData.append('id', id);
        
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
    }
    </script>
</body>
</html>
<?php $conn->close(); ?>
