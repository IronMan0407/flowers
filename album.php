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

$query = 'SELECT id, url, comment, timestamp FROM oyu_memories WHERE status = 1 ORDER BY timestamp DESC';
$result = $conn->query($query);
$uploadedMemories = [];
if ($result) {
  while ($row = $result->fetch_assoc()) {
    $uploadedMemories[] = $row;
  }
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Бидний дурсамж ❤️</title>
  <link rel="stylesheet" href="css/album.css" />
  <link rel="icon" href="img/flowers.png" type="image/x-icon" />
</head>

<body>
  <header>
    <h1>Бидний хамтын аялал 💕</h1>
    <nav>
      <a href="index.html">Нүүр</a>
      <a href="flower.html">Flowers</a>
      <a href="album.php" class="active">Албум</a>
      <a href="thoughts.php">Note</a>
    </nav>
  </header>

  <main class="album">
    <!-- Upload Form Section -->
    <section class="upload-section">
      <h2>Шинэ зураг нэмэх 📸</h2>
      <form id="uploadForm" enctype="multipart/form-data">
        <div class="form-group">
          <label for="photoInput">Зураг сонгох:</label>
          <input type="file" id="photoInput" name="photo" accept="image/*" required />
        </div>

        <div class="form-group">
          <label for="commentInput">Тайлбар нэмэх:</label>
          <textarea id="commentInput" name="comment" rows="3" placeholder="Энэ зургийн тухай бичих..."></textarea>
        </div>

        <button type="button" id="uploadBtn" class="upload-btn">
          <span>📤 Оруулах</span>
        </button>
      </form>
    </section>

    <!-- All Memories Section -->
    <section class="static-memories">
      <h2>Бидний хамтын мөчүүд 💖</h2>

      <!-- Display Uploaded Memories First -->
      <?php if (!empty($uploadedMemories)): ?>
        <?php foreach ($uploadedMemories as $memory): ?>
          <div class="memory uploaded-memory" data-id="<?php echo $memory['id']; ?>">
            <button class="delete-btn" data-id="<?php echo $memory['id']; ?>" title="Устгах">
              🗑️
            </button>
            <h3>Шинээр оруулсан зураг 🎉</h3>
            <img src="<?php echo htmlspecialchars($memory['url']); ?>" alt="Uploaded memory" />
            <?php if (!empty($memory['comment'])): ?>
              <p><?php echo htmlspecialchars_decode($memory['comment'], ENT_QUOTES); ?></p>
            <?php endif; ?>
            <p class="memory-date">📅 <?php echo date('Y-m-d H:i', strtotime($memory['timestamp'])); ?></p>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>

      <!-- Static Memories Below -->
      <div class="memory">
        <h3>Бидний видео</h3>
        <video controls>
          <source src="img/32.MP4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p></p>
      </div>

      <div class="memory">
        <h3>Үхэн үхтлээ хадгалж явах зураг</h3>
        <img src="img/21.JPG" alt="Photo booth" />
        <p></p>
      </div>

      <div class="memory">
        <h3>Миний хамгийн дуртай зураг</h3>
        <img src="img/8.JPG" alt="In pizza hut" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/2.JPG" alt="Trip photo" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/33.JPG" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/35.JPG" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/4.JPG" alt="On her birthday" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/5.JPG" alt="True beauty" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/6.JPG" alt="True beauty" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/34.JPG" alt="Little Oyu" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/36.JPG" alt="Little oyu" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/38.JPG" alt="Oyu in Pool" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/39.JPG" alt="in USA" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/salaavch.JPG" alt="Salaavch in car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/7.JPG" alt="Salaavch in Pizzahut" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/9.jpg" alt="Choking in PH" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/10.JPG" alt="Choking in PH" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/12.jpg" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/13.jpg" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/14.jpg" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/15.jpg" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/16.jpg" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/17.jpg" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/18.jpg" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/19.jpg" alt="In car" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/11.JPG" alt="at Misheel expo park" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/20.JPG" alt="At Bogd Uul" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/22.JPG" alt="At park" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/23.JPG" alt="At park" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/3.JPG" alt="at KH Apartment" />
        <p>🥰</p>
      </div>

      <div class="memory">
        <img src="img/24.JPG" alt="at KH Apartment" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/27.JPG" alt="at KH Apartment" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/28.JPG" alt="at KH Apartment's cu" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/25.JPG" alt="At my home first time" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/29.jpg" alt="True beauty" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/26.JPG" alt="first meal she made" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/30.JPG" alt="Last meal we ate" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/31.JPG" alt="So cute" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/40.PNG" alt="Checklist" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/41.PNG" alt="Note she write" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/42.PNG" alt="Note she write" />
        <p></p>
      </div>

      <div class="memory">
        <img src="img/1.JPG" alt="Last photo we took together" />
        <p>Магадгүй бидний хамтдаа авхуулсан сүүлчийн зураг 💔</p>
      </div>
    </section>
  </main>

  <footer>
    <p>Зөвхөн Оюундарь-т ❤️</p>
  </footer>

  <script src="js/album.js"></script>
</body>

</html>