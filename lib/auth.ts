import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";

/**
 * À appeler en tête de chaque page admin et de chaque Server Action : le proxy
 * n'est qu'un premier filtre, c'est ici que la session est réellement vérifiée.
 */
export async function requireAdmin() {
  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/admin/login");
  return { supabase, user: data.user };
}
