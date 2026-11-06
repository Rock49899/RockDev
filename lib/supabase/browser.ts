"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";

/** Client navigateur de l'admin : utilise la session posée en cookie à la connexion. */
export function createBrowserSupabase() {
  if (!supabaseUrl || !supabaseKey) throw new Error("Supabase n'est pas configuré.");
  return createBrowserClient(supabaseUrl, supabaseKey);
}
