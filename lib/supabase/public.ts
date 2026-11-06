import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "./env";

/** Client anonyme, sans cookies : lecture publique du contenu, compatible `use cache`. */
export function createPublicClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
