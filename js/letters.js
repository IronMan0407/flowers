/*
  ── Supabase SQL (нэг удаа ажиллуулна) ──────────────────────────────────────
  CREATE TABLE letters (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    author      text        NOT NULL,
    title       text        NOT NULL,
    content     text        NOT NULL,
    unlock_date date,
    created_at  timestamptz DEFAULT now(),
    status      int         DEFAULT 1
  );
  ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "allow all" ON letters FOR ALL USING (true) WITH CHECK (true);
  ─────────────────────────────────────────────────────────────────────────────
*/

import { supabaseFetch } from './supabase-app.js';

const form          = document.getElementById('letterForm');
const submitBtn     = document.getElementById('submitBtn');
const authorInput   = document.getElementById('authorInput');
const titleInput    = document.getElementById('titleInput');
const contentInput  = document.getElementById('contentInput');
const dateInput     = document.getElementById('unlockDateInput');
const feed          = document.getElementById('lettersFeed');
const scrollTopBtn  = document.getElementById('scrollTop');
const charCounterEl = document.getElementById('charCounter');

const MAX_CHARS = 8000;

// ── Char counter ────────────────────────────────────────────
if (contentInput && charCounterEl) {
  contentInput.addEventListener('input', () => {
    const rem = MAX_CHARS - contentInput.value.length;
    charCounterEl.textContent = `${rem} тэмдэгт үлдсэн`;
    charCounterEl.className = 'char-counter';
    if (rem < 100) charCounterEl.classList.add('danger');
    else if (rem < 500) charCounterEl.classList.add('warning');
  });
}

// ── Helpers ─────────────────────────────────────────────────
function escapeHTML(str) {
  return str
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function formatDate(ts) {
  return new Date(ts).toLocaleString('mn-MN', {
    year:'numeric', month:'long', day:'numeric'
  });
}

function daysUntil(dateStr) {
  const unlock = new Date(dateStr);
  unlock.setHours(0,0,0,0);
  const today = new Date();
  today.setHours(0,0,0,0);
  return Math.ceil((unlock - today) / 86400000);
}

function isLocked(letter) {
  if (!letter.unlock_date) return false;
  return daysUntil(letter.unlock_date) > 0;
}

function authorMeta(author) {
  if (author === 'Оюундарь') return { cls: 'author-oyu', color: 'var(--pink)' };
  return { cls: 'author-ironman', color: 'var(--teal)' };
}

// ── Render ───────────────────────────────────────────────────
function renderLetter(l) {
  const locked = isLocked(l);
  const meta   = authorMeta(l.author);
  const days   = locked ? daysUntil(l.unlock_date) : 0;
  const wasSealed = !!l.unlock_date;

  if (locked) {
    return `
      <article class="letter-card locked ${meta.cls}" data-id="${l.id}">
        <div class="envelope-flap"></div>
        <div class="seal-badge">🔒</div>
        <div class="letter-meta">
          <span class="letter-author" style="color:${meta.color}">${escapeHTML(l.author)}</span>
          <span class="letter-date-written">✍️ ${formatDate(l.created_at)}</span>
        </div>
        <h3 class="letter-title locked-title">[ Хаалттай захиа ]</h3>
        <div class="letter-countdown">
          <span class="countdown-num">${days}</span>
          <span class="countdown-label">өдрийн дараа нээгдэнэ</span>
        </div>
        <div class="letter-unlock-info">🗓 Нээгдэх: ${formatDate(l.unlock_date)}</div>
        <button class="delete-btn" data-id="${l.id}" title="Устгах">✕</button>
      </article>`;
  }

  return `
    <article class="letter-card open ${meta.cls} ${wasSealed ? 'was-sealed' : ''}" data-id="${l.id}">
      ${wasSealed ? '<div class="opened-badge">💌 Нээгдлээ</div>' : ''}
      <div class="letter-meta">
        <span class="letter-author" style="color:${meta.color}">${escapeHTML(l.author)}</span>
        <span class="letter-date-written">✍️ ${formatDate(l.created_at)}</span>
      </div>
      <h3 class="letter-title">${escapeHTML(l.title)}</h3>
      <div class="letter-divider"></div>
      <p class="letter-content">${escapeHTML(l.content)}</p>
      <button class="delete-btn" data-id="${l.id}" title="Устгах">✕</button>
    </article>`;
}

// ── Load ─────────────────────────────────────────────────────
async function loadLetters() {
  feed.innerHTML = '<div class="loading-state">⏳ Уншиж байна...</div>';
  try {
    const letters = await supabaseFetch('letters?status=eq.1&order=created_at.desc') || [];
    if (!letters.length) {
      feed.innerHTML = `
        <div class="empty-state">
          <span>💌</span>
          <strong>Одоохондоо захиа алга</strong>
          <p>Эхний захиагаа бичиж, илгээгээрэй.</p>
        </div>`;
      return;
    }
    feed.innerHTML = letters.map(renderLetter).join('');
  } catch (err) {
    feed.innerHTML = `<div class="empty-state"><strong>Алдаа:</strong><p>${escapeHTML(err.message)}</p></div>`;
  }
}

// ── Submit ───────────────────────────────────────────────────
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const author      = authorInput.value.trim();
    const title       = titleInput.value.trim();
    const content     = contentInput.value.trim();
    const unlock_date = dateInput.value || null;

    if (!author || !title || !content) {
      alert('Бүх талбарыг бөглөнө үү!');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳ Илгээж байна...</span>';

    try {
      await supabaseFetch('letters', {
        method: 'POST',
        body: JSON.stringify({ author, title, content, unlock_date, status: 1 })
      });
      form.reset();
      charCounterEl && (charCounterEl.textContent = `${MAX_CHARS} тэмдэгт үлдсэн`);
      await loadLetters();
    } catch (err) {
      alert('Алдаа: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>✉️ Захиа илгээх</span>';
    }
  });
}

// ── Delete ───────────────────────────────────────────────────
document.addEventListener('click', async e => {
  if (!e.target.classList.contains('delete-btn')) return;
  const id = e.target.dataset.id;
  if (!confirm('Энэ захиаг устгах уу?')) return;
  e.target.disabled = true;
  e.target.textContent = '⏳';
  try {
    await supabaseFetch(`letters?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 0 })
    });
    e.target.closest('.letter-card').remove();
  } catch (err) {
    alert('Алдаа: ' + err.message);
    e.target.disabled = false;
    e.target.textContent = '✕';
  }
});

// ── Scroll to top ────────────────────────────────────────────
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.style.display = window.scrollY > 320 ? 'flex' : 'none';
  });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

loadLetters();
