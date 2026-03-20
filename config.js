const SUPABASE_URL = 'https://nbmvodklvnmnuntbmvvb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // your full key

// This line is what creates the "function" .from()
// In config.js
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
