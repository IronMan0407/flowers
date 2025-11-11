<?php
require_once 'config.php';
$conn = getDbConnection();

function safeDisplay($text) {
  if (empty($text)) return '';
  $text = htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
  $safe_replacements = [
    '<3' => '<3',
    '</3' => '</3',
    '>' => '>',
    '&amp;' => '&',
    '&quot;' => '"',
    '&#039;' => "'"
  ];
  foreach ($safe_replacements as $encoded => $decoded) {
    $text = str_replace($encoded, $decoded, $text);
  }
  $text = nl2br($text);
  return $text;
}

$query = 'SELECT id, author, content, timestamp FROM thoughts WHERE status = 1 ORDER BY timestamp DESC';
$result = $conn->query($query);
$thoughts = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $thoughts[] = $row;
    }
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Бидний бодол санаа 💭</title>
    <link rel="stylesheet" href="css/thoughts.css" />
    <link rel="icon" href="img/flowers.png" type="image/x-icon" />
  </head>
  <body>
    <header>
      <h1>Чиний хувийн блог 💭</h1>
      <nav>
        <a href="index.html">Нүүр</a>
        <a href="flower.html">Flowers</a>
        <a href="album.php">Албум</a>
        <a href="thoughts.php" class="active">Note</a>
      </nav>
    </header>

    <main class="thoughts-container">
      <!-- Add Thought Form -->
      <section class="add-thought-section">
        <h2>Блог бичих ✍️</h2>
        <form id="thoughtForm">
          <div class="form-group">
            <label for="authorInput">Хэн бичиж байна:</label>
            <select id="authorInput" name="author" required>
              <option value="">Сонгох...</option>
              <option value="IronMan">IronMan</option>
              <option value="Оюундарь">Оюу</option>
            </select>
          </div>

          <div class="form-group">
            <label for="contentInput">Бодол санаа:</label>
            <textarea 
              id="contentInput" 
              name="content" 
              rows="5" 
              placeholder="Өнөөдөр юу бодож байна вэ?..." 
              required></textarea>
          </div>

          <button type="submit" id="submitBtn" class="submit-btn">
            <span>💌 Илгээх</span>
          </button>
        </form>
      </section>

      <!-- Display Thoughts -->
      <section class="thoughts-list">
        <h2>Бидний бичсэн зүйлс 📝</h2>
        
        <?php if (!empty($thoughts)): ?>
          <?php foreach ($thoughts as $thought): ?>
          <div class="thought-card <?php echo $thought['author'] === 'Оюундарь' ? 'oyu-thought' : 'my-thought'; ?>" data-id="<?php echo $thought['id']; ?>">
            <button class="delete-thought-btn" data-id="<?php echo $thought['id']; ?>" title="Устгах">
              ✕
            </button>
            <div class="thought-header">
              <span class="thought-author">
                <?php 
                  if ($thought['author'] === 'Оюундарь') {
                    echo '💕 ' . trim($thought['author']);
                  } else {
                    echo '💙 ' . trim($thought['author']);
                  }
                ?>
              </span>
              <span class="thought-date">
                <?php echo date('Y-m-d H:i', strtotime($thought['timestamp'])); ?>
              </span>
            </div>
            <div class="thought-content">
              <?php echo nl2br(trim($thought['content'])); ?>
            </div>
          </div>
          <?php endforeach; ?>
        <?php else: ?>
          <div class="no-thoughts">
            <p>Одоогоор бодол санаа байхгүй байна. Эхнийхийг нь бичээрэй! 💭</p>
          </div>
        <?php endif; ?>
      </section>
    </main>

    <footer>
      <p>Зөвхөн Оюундарь-т ❤️</p>
    </footer>

    <script src="js/thoughts.js"></script>
  </body>
</html>
