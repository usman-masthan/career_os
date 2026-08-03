const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const missingSupabaseEnvironment = [
    ['SUPABASE_URL', supabaseUrl],
    ['SUPABASE_ANON_KEY', supabaseAnonKey],
].filter(([, value]) => !value).map(([name]) => name);

// Public requests deliberately use the anonymous key so database RLS remains the
// final authority. Never substitute the service-role key here.
const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    })
    : null;

module.exports = { supabase, missingSupabaseEnvironment };
