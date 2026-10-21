import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that environment variables are valid and not unreplaced placeholders
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseKey.includes('your_supabase') &&
  !supabaseKey.includes('your-supabase-anon-key')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Make My Marriage] Supabase is not fully configured. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file to connect to live database.'
  );
}

// Create and export the Supabase client instance
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export default supabase;
