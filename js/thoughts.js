import { supabaseFetch } from './supabase-app.js';

const thoughtForm = document.getElementById('thoughtForm');
const submitBtn = document.getElementById('submitBtn');
const authorInput = document.getElementById('authorInput');
const contentInput = document.getElementById('contentInput');
const thoughtsContainer = document.getElementById('thoughtsContainer');

const maxChars = 5000;

// -------------------- Char Counter --------------------
if (contentInput) {
    const charCounterDiv = document.createElement('div');
    charCounterDiv.className = 'char-counter';
    contentInput.parentElement.appendChild(charCounterDiv);

    contentInput.addEventListener('input', () => {
        const remaining = maxChars - contentInput.value.length;
        charCounterDiv.textContent = `${remaining} тэмдэгт үлдсэн`;
        charCounterDiv.classList.remove('warning','danger');
        if (remaining < 100) charCounterDiv.classList.add('danger');
        else if (remaining < 500) charCounterDiv.classList.add('warning');
    });

    charCounterDiv.textContent = `${maxChars} тэмдэгт үлдсэн`;
}

// -------------------- Escape HTML --------------------
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

// -------------------- Load Thoughts --------------------
async function loadThoughts() {
    try {
        const thoughts = await supabaseFetch('thoughts?status=eq.1') || [];
        if (thoughts.length === 0) {
            thoughtsContainer.innerHTML = '<p>Одоогоор бодол санаа байхгүй байна.</p>';
            return;
        }

        thoughtsContainer.innerHTML = thoughts.map(t => {
            const timestamp = new Date(t.created_at).toLocaleString('mn-MN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            return `
                <div class="thought-card">
                    <div class="thought-header">
                        <span class="thought-date">${timestamp}</span>
                        <strong class="thought-author">${escapeHTML(t.author)}</strong>
                    </div>
                    <p class="thought-content">${escapeHTML(t.content)}</p>
                    <button class="delete-thought-btn" data-id="${t.id}">✕</button>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
        thoughtsContainer.innerHTML = `<p>Алдаа гарлаа: ${escapeHTML(err.message)}</p>`;
    }
}

// -------------------- Add Thought --------------------
if (thoughtForm) {
    thoughtForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const author = authorInput.value.trim();
        const content = contentInput.value.trim();
        if (!author || !content) {
            alert('Бүх талбарыг бөглөнө үү!');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳ Илгээж байна...</span>';

        try {
            await supabaseFetch('thoughts', {
                method: 'POST',
                body: JSON.stringify({ author, content, status: 1 })
            });

            thoughtForm.reset();
            await loadThoughts();
        } catch (err) {
            console.error(err);
            alert('Алдаа гарлаа: ' + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>💌 Илгээх</span>';
        }
    });

    // -------------------- Delete Thought --------------------
    document.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('delete-thought-btn')) return;

        const btn = e.target;
        const id = btn.dataset.id;
        if (!confirm('Энэ бодол санааг устгах уу?')) return;

        btn.disabled = true;
        btn.textContent = '⏳';

        try {
            await supabaseFetch(`thoughts?id=eq.${id}`, { method: 'DELETE' });
            btn.closest('.thought-card').remove();
        } catch (err) {
            console.error(err);
            alert('Алдаа гарлаа: ' + err.message);
            btn.disabled = false;
            btn.textContent = '✕';
        }
    });
}

// -------------------- Initial Load --------------------
loadThoughts();
