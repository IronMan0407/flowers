/*
  ── Supabase SQL (нэг удаа ажиллуулна) ──────────────────────────────────────
  CREATE TABLE wishes (
    id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    author     text        NOT NULL,
    content    text        NOT NULL,
    created_at timestamptz DEFAULT now(),
    status     int         DEFAULT 1
  );
  ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "allow all" ON wishes FOR ALL USING (true) WITH CHECK (true);
  ─────────────────────────────────────────────────────────────────────────────
*/

import { supabaseFetch } from './supabase-app.js';

const form        = document.getElementById('wishForm');
const submitBtn   = document.getElementById('submitBtn');
const authorInput = document.getElementById('authorInput');
const contentInput= document.getElementById('contentInput');
const feed        = document.getElementById('wishesFeed');
const revealBtn   = document.getElementById('revealBtn');
const spotlight   = document.getElementById('wishSpotlight');
const spotContent = document.getElementById('spotContent');
const spotAuthor  = document.getElementById('spotAuthor');
const spotDate    = document.getElementById('spotDate');
const closeSpot   = document.getElementById('closeSpot');
const jarCount    = document.getElementById('jarCount');
const jarStars    = document.getElementById('jarStars');
const scrollTopBtn= document.getElementById('scrollTop');

let allWishes = [];

// ── Helpers ─────────────────────────────────────────────────
function escapeHTML(str) {
  return str
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function formatDate(ts) {
  return new Date(ts).toLocaleString('mn-MN', { year:'numeric', month:'long', day:'numeric' });
}
function authorColor(author) {
  return author === 'Оюундарь' ? 'var(--pink)' : 'var(--teal)';
}
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Jar stars ───────────────────────────────────────────────
function updateJarStars(count) {
  if (!jarStars) return;
  jarStars.innerHTML = '';
  const n = Math.min(count, 18);
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'jar-star';
    s.textContent = randomFrom(['✦','✧','⋆','·','★','✩','❋','✿','◆']);
    s.style.left   = (8 + Math.random() * 84) + '%';
    s.style.top    = (10 + Math.random() * 80) + '%';
    s.style.animationDelay = (Math.random() * 3) + 's';
    s.style.animationDuration = (2 + Math.random() * 3) + 's';
    s.style.fontSize = (.6 + Math.random() * .7) + 'rem';
    s.style.opacity  = (.4 + Math.random() * .5).toString();
    jarStars.appendChild(s);
  }
}

// ── Render wish card ─────────────────────────────────────────
function renderWish(w, idx) {
  const color = authorColor(w.author);
  return `
    <article class="wish-card" data-id="${w.id}" style="animation-delay:${idx * 0.06}s">
      <div class="wish-left-bar" style="background:${color}"></div>
      <div class="wish-body">
        <p class="wish-content">${escapeHTML(w.content)}</p>
        <div class="wish-footer">
          <span class="wish-author" style="color:${color}">${escapeHTML(w.author)}</span>
          <span class="wish-date">🕒 ${formatDate(w.created_at)}</span>
        </div>
      </div>
      <button class="delete-btn" data-id="${w.id}" title="Устгах">✕</button>
    </article>`;
}

// ── Load ─────────────────────────────────────────────────────
async function loadWishes() {
  feed.innerHTML = '<div class="loading-state">⏳ Уншиж байна...</div>';
  try {
    allWishes = await supabaseFetch('wishes?status=eq.1&order=created_at.desc') || [];
    updateJarStars(allWishes.length);
    if (jarCount) jarCount.textContent = allWishes.length;

    if (!allWishes.length) {
      feed.innerHTML = `
        <div class="empty-state">
          <span>🌟</span>
          <strong>Хүсэл одоохондоо алга</strong>
          <p>Хамт биелүүлэхийг хүссэн зүйлсээ нэмээрэй.</p>
        </div>`;
      revealBtn && (revealBtn.disabled = true);
      return;
    }

    revealBtn && (revealBtn.disabled = false);
    feed.innerHTML = allWishes.map((w, i) => renderWish(w, i)).join('');
  } catch (err) {
    feed.innerHTML = `<div class="empty-state"><strong>Алдаа:</strong><p>${escapeHTML(err.message)}</p></div>`;
  }
}

// ── Reveal random wish ────────────────────────────────────────
if (revealBtn) {
  revealBtn.addEventListener('click', () => {
    if (!allWishes.length) return;
    const wish = randomFrom(allWishes);
    spotContent.textContent = wish.content;
    spotAuthor.textContent  = wish.author;
    spotAuthor.style.color  = authorColor(wish.author);
    spotDate.textContent    = formatDate(wish.created_at);
    spotlight.classList.add('visible');
    // Particle burst
    burstParticles();
  });
}

if (closeSpot) {
  closeSpot.addEventListener('click', () => spotlight.classList.remove('visible'));
}
if (spotlight) {
  spotlight.addEventListener('click', e => {
    if (e.target === spotlight) spotlight.classList.remove('visible');
  });
}

// ── Particle burst ────────────────────────────────────────────
function burstParticles() {
  const container = document.getElementById('burstContainer');
  if (!container) return;
  container.innerHTML = '';
  const symbols = ['✦','🌟','✧','⋆','★','✩','🌸','💫','❋'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    p.className = 'burst-particle';
    p.textContent = randomFrom(symbols);
    const angle = (360 / 14) * i;
    const dist  = 60 + Math.random() * 60;
    const rad   = angle * Math.PI / 180;
    p.style.setProperty('--tx', Math.cos(rad) * dist + 'px');
    p.style.setProperty('--ty', Math.sin(rad) * dist + 'px');
    p.style.animationDelay = (Math.random() * .15) + 's';
    container.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

// ── Submit ───────────────────────────────────────────────────
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const author  = authorInput.value.trim();
    const content = contentInput.value.trim();
    if (!author || !content) { alert('Бүх талбарыг бөглөнө үү!'); return; }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳ Нэмж байна...</span>';
    try {
      await supabaseFetch('wishes', {
        method:'POST',
        body: JSON.stringify({ author, content, status:1 })
      });
      form.reset();
      await loadWishes();
    } catch(err) {
      alert('Алдаа: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>🌟 Хүсэл нэмэх</span>';
    }
  });
}

// ── Delete ───────────────────────────────────────────────────
document.addEventListener('click', async e => {
  if (!e.target.classList.contains('delete-btn')) return;
  const id = e.target.dataset.id;
  if (!confirm('Энэ хүслийг устгах уу?')) return;
  e.target.disabled = true;
  e.target.textContent = '⏳';
  try {
    await supabaseFetch(`wishes?id=eq.${id}`, {
      method:'PATCH', body:JSON.stringify({status:0})
    });
    e.target.closest('.wish-card').remove();
    allWishes = allWishes.filter(w => w.id !== id);
    if (jarCount) jarCount.textContent = allWishes.length;
    updateJarStars(allWishes.length);
    if (!allWishes.length && revealBtn) revealBtn.disabled = true;
  } catch(err) {
    alert('Алдаа: ' + err.message);
    e.target.disabled = false; e.target.textContent = '✕';
  }
});

// ── Scroll to top ────────────────────────────────────────────
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.style.display = window.scrollY > 320 ? 'flex' : 'none';
  });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
}

loadWishes();
