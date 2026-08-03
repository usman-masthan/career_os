const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Public requests deliberately use the anonymous key so database RLS remains the
// final authority. Never substitute the service-role key here.
const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    })
    : null;

const createAuthenticatedClient = (accessToken) => (
    supabaseUrl && supabaseAnonKey && accessToken
        ? createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
            auth: { persistSession: false, autoRefreshToken: false },
        })
        : null
);

module.exports = { supabase, createAuthenticatedClient };
