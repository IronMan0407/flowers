import { supabaseFetch, SUPABASE_BUCKET, SUPABASE } from './supabase-app.js';

const uploadForm       = document.getElementById('uploadForm');
const uploadBtn        = document.getElementById('uploadBtn');
const uploadToggle     = document.getElementById('uploadToggle');
const uploadFormWrap   = document.getElementById('uploadFormWrap');
const photoInput       = document.getElementById('photoInput');
const commentInput     = document.getElementById('commentInput');
const memoriesContainer = document.getElementById('memoriesContainer');
const dropZone         = document.getElementById('dropZone');
const previewWrap      = document.getElementById('previewWrap');
const previewImg       = document.getElementById('previewImg');
const removePreview    = document.getElementById('removePreview');
const lightbox         = document.getElementById('lightbox');
const lightboxImg      = document.getElementById('lightboxImg');
const lightboxCaption  = document.getElementById('lightboxCaption');
const lightboxClose    = document.getElementById('lightboxClose');
const lbPrev           = document.getElementById('lbPrev');
const lbNext           = document.getElementById('lbNext');
const scrollTopBtn     = document.getElementById('scrollTop');

// -------------------- Upload Toggle --------------------
uploadToggle.addEventListener('click', () => {
    const isOpen = uploadFormWrap.classList.contains('open');
    uploadFormWrap.classList.toggle('open');
    uploadToggle.classList.toggle('open');
    uploadToggle.querySelector('span:last-child').textContent = isOpen ? 'Шинэ зураг нэмэх' : 'Хаах';
});

// -------------------- Image Preview --------------------
photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewWrap.style.display = 'block';
    dropZone.querySelector('.drop-zone-inner').style.display = 'none';
});

removePreview.addEventListener('click', (e) => {
    e.stopPropagation();
    photoInput.value = '';
    previewImg.src = '';
    previewWrap.style.display = 'none';
    dropZone.querySelector('.drop-zone-inner').style.display = 'block';
});

// Drag and drop visual
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const dt = new DataTransfer();
        dt.items.add(file);
        photoInput.files = dt.files;
        photoInput.dispatchEvent(new Event('change'));
    }
});

// -------------------- Load Memories --------------------
async function loadMemories() {
    try {
        const memories = await supabaseFetch('oyu_memories?status=eq.1&order=timestamp.desc') || [];

        if (!memories.length) {
            memoriesContainer.innerHTML = '<p style="color:var(--muted);font-style:italic;font-size:0.9rem;">Одоогоор зураг байхгүй байна.</p>';
            return;
        }

        memoriesContainer.innerHTML = memories.map(mem => `
            <div class="memory-card" data-src="${SUPABASE.url}/storage/v1/object/public/${SUPABASE_BUCKET}/${mem.url}" data-caption="${mem.comment || ''}">
                <div class="card-media">
                    <img src="${SUPABASE.url}/storage/v1/object/public/${SUPABASE_BUCKET}/${mem.url}" alt="${mem.comment || ''}" loading="lazy" />
                </div>
                ${mem.comment ? `<div class="card-caption">${mem.comment}</div>` : ''}
                <button class="delete-btn" data-id="${mem.id}" title="Устгах">✕</button>
            </div>
        `).join('');

        attachCardListeners(memoriesContainer);
    } catch (err) {
        console.error(err);
        memoriesContainer.innerHTML = `<p style="color:var(--pink)">Алдаа гарлаа: ${err.message}</p>`;
    }
}

// -------------------- Upload Photo --------------------
async function uploadPhoto(file, comment) {
    const safeName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const uploadUrl = `${SUPABASE.url}/storage/v1/object/${SUPABASE_BUCKET}/${safeName}`;

    const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE.key,
            'Authorization': `Bearer ${SUPABASE.key}`
        },
        body: file
    });

    if (!uploadRes.ok) {
        const body = await uploadRes.text();
        console.error("Upload Error:", body);
        throw new Error("Storage upload failed");
    }

    await supabaseFetch('oyu_memories', {
        method: 'POST',
        body: JSON.stringify({ url: safeName, comment: comment || "", status: 1 })
    });
}

uploadBtn.addEventListener('click', async () => {
    const file = photoInput.files[0];
    const comment = commentInput.value.trim();
    if (!file) return alert('Зураг сонгоно уу!');

    uploadBtn.disabled = true;
    uploadBtn.querySelector('.btn-text').textContent = '⏳ Оруулж байна...';

    try {
        await uploadPhoto(file, comment);
        uploadForm.reset();
        previewImg.src = '';
        previewWrap.style.display = 'none';
        dropZone.querySelector('.drop-zone-inner').style.display = 'block';
        await loadMemories();
        // Close form after upload
        uploadFormWrap.classList.remove('open');
        uploadToggle.classList.remove('open');
        uploadToggle.querySelector('span:last-child').textContent = 'Шинэ зураг нэмэх';
    } catch (err) {
        console.error(err);
        alert('Алдаа гарлаа: ' + err.message);
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.querySelector('.btn-text').textContent = '📤 Оруулах';
    }
});

// -------------------- Soft Delete --------------------
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.delete-btn');
    if (!btn) return;

    e.stopPropagation();
    const id = btn.dataset.id;
    if (!confirm('Энэ зургыг нуух уу?')) return;

    btn.disabled = true;
    btn.textContent = '⏳';

    try {
        await supabaseFetch(`oyu_memories?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 0 })
        });
        const card = btn.closest('.memory-card');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        card.style.transition = 'all 0.3s ease';
        setTimeout(() => card.remove(), 300);
    } catch (err) {
        console.error(err);
        alert(err.message);
        btn.disabled = false;
        btn.textContent = '✕';
    }
});

// -------------------- Lightbox --------------------
let lightboxImages = [];
let currentIndex = 0;

function openLightbox(src, caption, index, images) {
    lightboxImages = images;
    currentIndex = index;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
}

function navigateLightbox(dir) {
    currentIndex = (currentIndex + dir + lightboxImages.length) % lightboxImages.length;
    const item = lightboxImages[currentIndex];
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = item.src;
        lightboxCaption.textContent = item.caption;
        lightboxImg.style.opacity = '1';
    }, 150);
    lightboxImg.style.transition = 'opacity 0.15s ease';
}

lightboxClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => navigateLightbox(-1));
lbNext.addEventListener('click', () => navigateLightbox(1));

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

function attachCardListeners(container) {
    const cards = container.querySelectorAll('.memory-card');
    const images = Array.from(cards)
        .filter(c => c.querySelector('img'))
        .map(c => ({
            src: c.dataset.src || c.querySelector('img').src,
            caption: c.dataset.caption || c.querySelector('.card-caption')?.textContent || ''
        }));

    cards.forEach((card, i) => {
        if (!card.querySelector('img')) return;
        card.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) return;
            openLightbox(images[i].src, images[i].caption, i, images);
        });
    });
}

// Attach to static grid on load
window.addEventListener('DOMContentLoaded', () => {
    attachCardListeners(document.getElementById('staticGrid'));
});

// -------------------- Scroll to top --------------------
window.addEventListener('scroll', () => {
    scrollTopBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
});
scrollTopBtn.style.alignItems = 'center';
scrollTopBtn.style.justifyContent = 'center';
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// -------------------- Init --------------------
loadMemories();
