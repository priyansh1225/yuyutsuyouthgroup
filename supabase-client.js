// supabase-client.js
// Shared Supabase connection used by admin.html and gallery.html

const SUPABASE_URL = "https://fdinplnhfvyigovlefte.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_W-NKdch5A_uqRvY-d7rUfw_F8ycCCZ0";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);