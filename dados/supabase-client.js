const SUPABASE_URL = 'https://uowelimfpijhjwjwqkyk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0bJhjtXlNL0-d5cT2c3J2A_7hbwC5Ox';

// Initialize the Supabase client
// Supports both Browser (with script tag) and Node (with npm install)

let supabase;

if (typeof window !== 'undefined' && window.supabase) {
    // Browser environment with CDN
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    // Node environment or bundled Browser environment
    try {
        const { createClient } = await import('@supabase/supabase-js');
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.error('Supabase library not found. For Node, run: npm install');
    }
}

export default supabase;
