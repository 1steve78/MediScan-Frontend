import { createBrowserClient } from '@supabase/ssr';

// Load public client-side Supabase variables, falling back to mock keys to prevent build-time failures
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-placeholder-anon-key-placeholder-anon-key-placeholder-anon-key';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
