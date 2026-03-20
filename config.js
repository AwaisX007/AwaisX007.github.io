const SUPABASE_URL = 'https://nbmvodklvnmnuntbmvvb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibXZvZGtsdm5tbnVudGJtdnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTA1ODcsImV4cCI6MjA4OTU2NjU4N30.JcpIlozE-J2DmcCExeNWt0pgtDBL70VX7jAXOBnix6E'; // your full key

// This line is what creates the "function" .from()
// In config.js
window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
