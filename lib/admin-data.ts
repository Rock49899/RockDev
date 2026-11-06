import "server-only";
import { clean } from "./content";
import { seed } from "./seed";
import type { createSessionClient } from "./supabase/server";
import { VARIANTS, type SiteData } from "./types";

type Client = Awaited<ReturnType<typeof createSessionClient>>;

/** Contenu complet pour l'admin : tous les projets (brouillons compris), sans filtre de version. */
export async function loadAdminData(supabase: Client): Promise<{ data: SiteData; initialized: boolean; error?: string }> {
  const [settings, profiles, metrics, skills, softSkills, projects, experiences] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("profile").select("*"),
    supabase.from("metrics").select("*").order("sort"),
    supabase.from("skill_groups").select("*").order("sort"),
    supabase.from("soft_skills").select("*").order("sort"),
    supabase.from("projects").select("*").order("sort"),
    supabase.from("experiences").select("*").order("sort"),
  ]);

  const failed = [settings, profiles, metrics, skills, softSkills, projects, experiences].find((r) => r.error);
  if (failed?.error) return { data: seed, initialized: false, error: failed.error.message };

  const initialized = Boolean(settings.data) || Boolean(profiles.data?.length);
  return {
    initialized,
    data: {
      settings: { ...seed.settings, ...clean(settings.data) },
      profiles: Object.fromEntries(
        VARIANTS.map((v) => [v, { ...seed.profiles[v], ...clean(profiles.data?.find((p) => p.variant === v)) }]),
      ) as SiteData["profiles"],
      metrics: metrics.data ?? [],
      skills: skills.data ?? [],
      softSkills: softSkills.data ?? [],
      projects: (projects.data ?? []).map((p) => ({ ...p, images: p.images ?? [] })),
      experiences: experiences.data ?? [],
    },
  };
}
