// ─── Supabase Client (shared between web and mobile) ─────────────────────────
// Install: npm install @supabase/supabase-js

// TODO: Replace with your Supabase project URL and anon key from supabase.com
export const SUPABASE_URL = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
export const SUPABASE_ANON_KEY = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "";

// Client is initialised in each app (web/mobile) to avoid bundling issues
// See: apps/web/src/lib/supabase.ts  and  apps/mobile/lib/supabase.ts
