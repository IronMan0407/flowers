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
    const filePath = `${safeName}`;

    const uploadUrl = `${SUPABASE.url}/storage/v1/object/${SUPABASE_BUCKET}/${filePath}`;

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

// -------------------- Delete (Soft Delete) --------------------
document.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('delete-btn')) return;

    const btn = e.target;
    const id = btn.dataset.id;

    if (!confirm('Энэ зургыг устгах уу?')) return;

    btn.disabled = true;
    btn.textContent = '⏳';

    try {
        // Soft delete: just set status = 0
        const { error } = await supabaseFetch(`oyu_memories?id=eq.${id}`, {
            method: 'PATCH', // use PATCH to update
            body: JSON.stringify({ status: 0 })
        });

        if (error) throw error;

        // Remove from DOM
        btn.closest('.uploaded-memory').remove();

        alert('Амжилттай устгалаа (Soft Delete)!');
    } catch (err) {
        console.error(err);
        alert(err.message);
        btn.disabled = false;
        btn.textContent = '🗑️';
    }
});

// -------------------- Initial Load --------------------
loadMemories();
