import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/*
 * SECURITY NOTE: The anon key is SAFE to use in frontend code!
 * - It's designed to be public
 * - Row Level Security (RLS) policies control what it can access
 * - In our case: READ-ONLY access to the attacks table
 * - No write operations are possible with this key
 */

// Create Supabase client only if credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null;
};