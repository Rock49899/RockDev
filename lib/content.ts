import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";
import { seed } from "./seed";
import type { SiteData, Variant } from "./types";
import { VARIANTS } from "./types";

export const PORTFOLIO_TAG = "portfolio";

/** Retire les `null` de la base pour que les valeurs par défaut du seed restent valables. */
export function clean<T extends object>(row: T | null | undefined): Partial<T> {
  if (!row) return {};
  return Object.fromEntries(
    Object.entries(row).filter(([, v]) => v !== null && v !== undefined),
  ) as Partial<T>;
}

/**
 * Tout le contenu du portfolio, en une seule lecture mise en cache jusqu'à ce
 * qu'une action d'admin invalide le tag `portfolio` : les pages restent
 * statiques et instantanées, et un enregistrement les met à jour aussitôt.
 */
export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheTag(PORTFOLIO_TAG);
  cacheLife("max");

  const supabase = createPublicClient();
  if (!supabase) return seed;

  const [settings, profiles, metrics, skills, softSkills, projects, experiences] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("profile").select("*"),
    supabase.from("metrics").select("*").order("sort"),
    supabase.from("skill_groups").select("*").order("sort"),
    supabase.from("soft_skills").select("*").order("sort"),
    supabase.from("projects").select("*").order("sort"),
    supabase.from("experiences").select("*").order("sort"),
  ]);

  const error = [settings, profiles, metrics, skills, softSkills, projects, experiences].find((r) => r.error)?.error;
  if (error) throw new Error(`Supabase : ${error.message}`);

  // Base vide (schéma exécuté, contenu pas encore initialisé) : on montre le contenu de départ.
  if (!settings.data && !profiles.data?.length) return seed;

  const byVariant = Object.fromEntries(
    VARIANTS.map((v) => [v, { ...seed.profiles[v], ...clean(profiles.data?.find((p) => p.variant === v)) }]),
  ) as SiteData["profiles"];

  return {
    settings: { ...seed.settings, ...clean(settings.data) },
    profiles: byVariant,
    metrics: metrics.data ?? [],
    skills: skills.data ?? [],
    softSkills: softSkills.data ?? [],
    projects: (projects.data ?? []).map((p) => ({ ...p, images: p.images ?? [] })),
    experiences: experiences.data ?? [],
  };
}

export type { Variant };
