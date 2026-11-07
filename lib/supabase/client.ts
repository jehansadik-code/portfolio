import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export function getSupabasePublicConfig() {
  return url && anonKey ? { url, anonKey } : null;
}

/** Returns null locally until the public Supabase environment values are supplied. */
export function createBrowserSupabaseClient() {
  if (!url || !anonKey) return null;
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
}
