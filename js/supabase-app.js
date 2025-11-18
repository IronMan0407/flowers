const SUPABASE_URL = 'https://uvzrvsskeeqiincskydx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2enJ2c3NrZWVxaWluY3NreWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDI3MjMsImV4cCI6MjA3ODkxODcyM30.5xXIx2KA2iDufVAqfG4q0_CG9-L7gLnxGplPzLWS5aU';

export async function supabaseFetch(path, options = {}) {
    const finalOptions = {
        method: options.method || 'GET',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})  // user headers merge
        },
        body: options.body || null
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, finalOptions);

    if (!res.ok) {
        const text = await res.text();
        console.error("Supabase Error:", text);
        throw new Error(`Supabase request failed: ${res.status}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

export const SUPABASE_BUCKET = "memories";
export const SUPABASE = { url: SUPABASE_URL, key: SUPABASE_KEY };
