import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
  const url = process.env.POMIN360_SUPABASE_URL;
  const key = process.env.POMIN360_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Configure POMIN360_SUPABASE_URL e POMIN360_SUPABASE_SERVICE_ROLE_KEY.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
