const CONFIG = { API_URL: "YOUR_BACKEND_URL/api", SUPABASE_URL: "https://bxagesejrodvhlmfiunj.supabase.co", SUPABASE_ANON_KEY: "sb_publishable_VYPZoCGSUXBLmTl1jFVcYg_a3ERNCq6"};
let supabaseClient = null;
if (CONFIG.SUPABASE_URL !== "YOUR_SUPABASE_URL_HERE" && window.supabase) { supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY); } else { console.warn("Supabase is not configured. Running in local API mode."); }
