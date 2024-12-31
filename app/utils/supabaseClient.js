import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's `import.meta.env`
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

// Check for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be provided");
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
