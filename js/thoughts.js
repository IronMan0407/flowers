const thoughtForm = document.getElementById('thoughtForm');
const submitBtn = document.getElementById('submitBtn');
const authorInput = document.getElementById('authorInput');
const contentInput = document.getElementById('contentInput');

// Character counter
const maxChars = 5000;
const charCounterDiv = document.createElement('div');
charCounterDiv.className = 'char-counter';
contentInput.parentElement.appendChild(charCounterDiv);

contentInput.addEventListener('input', () => {
  const remaining = maxChars - contentInput.value.length;
  charCounterDiv.textContent = `${remaining} тэмдэгт үлдсэн`;
  
  if (remaining < 100) {
    charCounterDiv.classList.add('danger');
    charCounterDiv.classList.remove('warning');
  } else if (remaining < 500) {
    charCounterDiv.classList.add('warning');
    charCounterDiv.classList.remove('danger');
  } else {
    charCounterDiv.classList.remove('warning', 'danger');
  }
});

// Submit thought
thoughtForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  console.log('Form submitted'); // Debug log
  
  const author = authorInput.value.trim();
  const content = contentInput.value.trim();
  
  console.log('Author:', author); // Debug log
  console.log('Content:', content); // Debug log
  
  if (!author || !content) {
    alert('Бүх талбарыг бөглөнө үү!');
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>⏳ Илгээж байна...</span>';
  
  const formData = new FormData();
  formData.append('author', author);
  formData.append('content', content);
  
  try {
    console.log('Sending request to add_thought.php'); // Debug log
    
    const response = await fetch('add_thought.php', {
      method: 'POST',
      body: formData
    });
    
    console.log('Response status:', response.status); // Debug log
    
    const text = await response.text();
    console.log('Response text:', text); // Debug log
    
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('JSON parse error:', e);
      alert('Серверээс буруу хариу ирлээ: ' + text);
      return;
    }
    
    console.log('Result:', result); // Debug log
    
    if (result.success) {
      alert(result.message);
      thoughtForm.reset();
      charCounterDiv.textContent = '';
      window.location.reload();
    } else {
      alert(`Алдаа: ${result.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Илгээхэд алдаа гарлаа: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>💌 Илгээх</span>';
  }
});

// Delete thought
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-thought-btn') || e.target.closest('.delete-thought-btn')) {
    const btn = e.target.classList.contains('delete-thought-btn') ? e.target : e.target.closest('.delete-thought-btn');
    const id = btn.dataset.id;
    
    if (!confirm('Энэ бодол санааг устгах уу?')) {
      return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '⏳';
    
    try {
      const formData = new FormData();
      formData.append('id', id);
      
      const response = await fetch('delete_thought.php', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        const thoughtCard = btn.closest('.thought-card');
        thoughtCard.style.opacity = '0';
        thoughtCard.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
          thoughtCard.remove();
          
          const remainingThoughts = document.querySelectorAll('.thought-card');
          if (remainingThoughts.length === 0) {
            const thoughtsList = document.querySelector('.thoughts-list');
            thoughtsList.innerHTML = `
              <h2>Бидний бичсэн зүйлс 📝</h2>
              <div class="no-thoughts">
                <p>Одоогоор бодол санаа байхгүй байна. Эхнийхийг нь бичээрэй! 💭</p>
              </div>
            `;
          }
        }, 300);
      } else {
        alert(`Алдаа: ${result.error}`);
        btn.disabled = false;
        btn.innerHTML = '✕';
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Устгахад алдаа гарлаа!');
      btn.disabled = false;
      btn.innerHTML = '✕';
    }
  }
});

// Scroll to top button
const scrollBtn = document.createElement('button');
scrollBtn.className = 'scroll-to-top';
scrollBtn.innerHTML = '↑';
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

// Initialize character counter
charCounterDiv.textContent = `${maxChars} тэмдэгт үлдсэн`;
