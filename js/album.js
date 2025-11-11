const uploadBtn = document.getElementById("uploadBtn");
const photoInput = document.getElementById("photoInput");
const commentInput = document.getElementById("commentInput");

// Upload functionality
uploadBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];
  const comment = commentInput.value.trim();
  
  if (!file) {
    alert("Оруулах зургаа сонгоорой хөөрхнөө!");
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.innerHTML = '<span>⏳ Уншиж байна...</span>';

  const formData = new FormData();
  formData.append("photo", file);
  formData.append("comment", comment);

  try {
    const response = await fetch("upload.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    
    if (result.error) {
      alert(`Алдаа гарлаа: ${result.error}`);
    } else {
      alert("Амжилттай оруулсан! 🎉");
      photoInput.value = "";
      commentInput.value = "";
      window.location.reload();
    }
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Оруулахад алдаа гарлаа! Дахин оролдоно уу.");
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.innerHTML = '<span>📤 Оруулах</span>';
  }
});

// Delete functionality
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
    const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
    const id = btn.dataset.id;
    
    if (!confirm('Энэ зургийг устгах уу?')) {
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '⏳';

    try {
      const formData = new FormData();
      formData.append('id', id);

      const response = await fetch('delete.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        // Remove the memory element with animation
        const memoryElement = btn.closest('.memory');
        memoryElement.style.opacity = '0';
        memoryElement.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          memoryElement.remove();
          alert('Амжилттай устгалаа! ✅');
        }, 300);
      } else {
        alert(`Алдаа: ${result.error}`);
        btn.disabled = false;
        btn.innerHTML = '🗑️';
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Устгахад алдаа гарлаа!');
      btn.disabled = false;
      btn.innerHTML = '🗑️';
    }
  }
});

// Image preview
photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const existingPreview = document.querySelector('.image-preview');
    if (existingPreview) {
      existingPreview.remove();
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = document.createElement('div');
      preview.className = 'image-preview';
      preview.innerHTML = `
        <img src="${event.target.result}" alt="Preview" />
        <button type="button" class="remove-preview">✕</button>
      `;
      
      const formGroup = photoInput.closest('.form-group');
      formGroup.appendChild(preview);

      preview.querySelector('.remove-preview').addEventListener('click', () => {
        preview.remove();
        photoInput.value = '';
      });
    };
    reader.readAsDataURL(file);
  }
});

// Scroll to top button
const scrollBtn = document.createElement('button');
scrollBtn.className = 'scroll-to-top';
scrollBtn.innerHTML = '↑';
scrollBtn.style.display = 'none';
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollBtn.style.display = 'block';
  } else {
    scrollBtn.style.display = 'none';
  }
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
