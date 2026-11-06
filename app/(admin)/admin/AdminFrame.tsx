import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { loadAdminData } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { SiteData } from "@/lib/types";
import { AdminForm } from "./AdminForm";
import { initializeContent, signOut } from "./actions";

export const ADMIN_PAGES = [
  { href: "/admin", label: "Général" },
  { href: "/admin/dev", label: "Version développeur" },
  { href: "/admin/amoa", label: "Version AMOA" },
  { href: "/admin/projets", label: "Projets" },
  { href: "/admin/parcours", label: "Parcours" },
] as const;

/**
 * Cadre commun des pages d'admin : vérifie la session, charge le contenu et affiche la
 * navigation. À rendre dans un <Suspense> (la session est lue au moment de la requête).
 */
export default async function AdminFrame({
  active,
  title,
  lead,
  render,
}: {
  active: (typeof ADMIN_PAGES)[number]["href"];
  title: string;
  lead?: string;
  render: (data: SiteData) => ReactNode;
}) {
  if (!isSupabaseConfigured) {
    return (
      <main className="shell narrow">
        <h1>Supabase non configuré</h1>
        <div className="card">
          <p>
            Copie <code>.env.example</code> vers <code>.env.local</code>, renseigne l&apos;URL et la clé publique du
            projet, exécute <code>supabase/schema.sql</code> puis relance le serveur.
          </p>
        </div>
      </main>
    );
  }

  const { supabase, user } = await requireAdmin();
  const { data, initialized, error } = await loadAdminData(supabase);

  return (
    <>
      <header className="topbar">
        <strong>Admin</strong>
        <nav aria-label="Pages d'administration">
          {ADMIN_PAGES.map((page) => (
            <Link key={page.href} href={page.href} aria-current={page.href === active ? "page" : undefined}>
              {page.label}
            </Link>
          ))}
        </nav>
        <span className="who">{user.email}</span>
        <Link className="btn ghost" href="/" target="_blank">
          Voir le site
        </Link>
        <form action={signOut}>
          <button className="btn ghost" type="submit">
            Déconnexion
          </button>
        </form>
      </header>

      <main className="shell">
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}

        {error && (
          <p role="alert" className="msg err">
            Lecture impossible : {error}. Le schéma SQL a-t-il été exécuté ?
          </p>
        )}

        {!error && !initialized ? (
          <div className="card">
            <h2 className="sub">Première utilisation</h2>
            <p>
              Les tables sont vides. Charge le contenu de départ (tiré de ton CV) pour pouvoir le modifier : textes des
              deux versions, projets, expertise et parcours.
            </p>
            <AdminForm action={initializeContent} submitLabel="Initialiser le contenu">
              <span />
            </AdminForm>
          </div>
        ) : (
          !error && render(data)
        )}
      </main>
    </>
  );
}
