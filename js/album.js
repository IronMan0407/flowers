import { supabaseFetch, SUPABASE_BUCKET, SUPABASE } from './supabase-app.js';

const uploadForm = document.getElementById('uploadForm');
const uploadBtn = document.getElementById('uploadBtn');
const photoInput = document.getElementById('photoInput');
const commentInput = document.getElementById('commentInput');
const memoriesContainer = document.getElementById('memoriesContainer');

// -------------------- Load Memories --------------------
async function loadMemories() {
    try {
        const memories = await supabaseFetch('oyu_memories?status=eq.1') || [];

        memoriesContainer.innerHTML = memories.map(mem => `
            <div class="memory uploaded-memory">
                <img src="${SUPABASE.url}/storage/v1/object/public/${SUPABASE_BUCKET}/${mem.url}" alt="Memory">
                <p>${mem.comment || ''}</p>
                <button class="delete-btn" data-id="${mem.id}">🗑️ Устгах</button>
            </div>
        `).join('');

    } catch (err) {
        console.error(err);
        memoriesContainer.innerHTML = '<p>Алдаа гарлаа: ' + err.message + '</p>';
    }
}

// -------------------- Upload Photo --------------------
async function uploadPhoto(file, comment) {
    const safeName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const filePath = `${safeName}`; // bucket-ийн root дээр хадгална

    const uploadUrl = `${SUPABASE.url}/storage/v1/object/${SUPABASE_BUCKET}/${filePath}`;

    const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE.key,
            'Authorization': `Bearer ${SUPABASE.key}`,
            // Content-Type тавихгүй — браузер өөрөө multipart болгоно
        },
        body: file   // ❗ FormData биш, шууд file body
    });

    if (!uploadRes.ok) {
        const body = await uploadRes.text();
        console.error("Upload Error:", body);
        throw new Error("Storage upload failed");
    }

    // --- Insert into DB ---
    await supabaseFetch('oyu_memories', {
        method: 'POST',
        body: JSON.stringify({
            url: safeName,
            comment: comment || "",
            status: 1
        })
    });
}

// -------------------- Upload Button --------------------
uploadBtn.addEventListener('click', async () => {
    const file = photoInput.files[0];
    const comment = commentInput.value.trim();
    if (!file) return alert('Зураг сонгоно уу!');

    uploadBtn.disabled = true;
    uploadBtn.textContent = '⏳ Оруулж байна...';

    try {
        await uploadPhoto(file, comment);
        uploadForm.reset();
        await loadMemories();
        alert('Амжилттай upload хийлээ!');
    } catch (err) {
        console.error(err);
        alert('Алдаа гарлаа: ' + err.message);
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = '📤 Оруулах';
    }
});

// -------------------- Delete Photo --------------------
document.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('delete-btn')) return;

    const btn = e.target;
    const id = btn.dataset.id;

    if (!confirm('Энэ зургыг устгах уу?')) return;

    btn.disabled = true;
    btn.textContent = '⏳';

    try {
        const records = await supabaseFetch(`oyu_memories?id=eq.${id}`) || [];
        if (!records[0]) throw new Error('Record олдсонгүй');
        const fileName = records[0].url;

        const deleteRes = await fetch(`${SUPABASE.url}/storage/v1/object/${SUPABASE_BUCKET}/${fileName}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE.key,
                'Authorization': `Bearer ${SUPABASE.key}`
            }
        });

        if (!deleteRes.ok) throw new Error('Storage-с устгахад алдаа гарлаа');

        await supabaseFetch(`oyu_memories?id=eq.${id}`, { method: 'DELETE' });

        btn.closest('.uploaded-memory').remove();
    } catch (err) {
        console.error(err);
        alert(err.message);
        btn.disabled = false;
        btn.textContent = '🗑️';
    }
});

// -------------------- Initial Load --------------------
loadMemories();
