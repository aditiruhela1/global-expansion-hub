import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

// Publishable (anon) key is safe to expose in the browser — protected by RLS.
// Override at build time with VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in a .env file.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://afmtnuhhwgnqnoytqetv.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "sb_publishable_g1VSDvjifr_eA8opQqlhyA_poFpvFqU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
