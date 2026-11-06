import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseKey, supabaseUrl } from "./env";

/** Client lié à la session de l'admin (cookies). À n'appeler que hors `use cache`. */
export async function createSessionClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase n'est pas configuré (voir .env.example).");
  }
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Appelé depuis un Server Component : le proxy rafraîchit déjà la session.
        }
      },
    },
  });
}
