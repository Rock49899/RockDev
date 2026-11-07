import type { SiteData, SiteView, Variant } from "./types";

const bySort = <T extends { sort: number }>(a: T, b: T) => a.sort - b.sort;

/** Filtre le contenu stocké pour une version : textes, listes et visibilité des projets/parcours. */
export function selectVariant(data: SiteData, variant: Variant): SiteView {
  const flag = variant === "dev" ? "show_dev" : "show_amoa";
  return {
    variant,
    settings: data.settings,
    profile: data.profiles[variant],
    metrics: data.metrics.filter((m) => m.variant === variant).sort(bySort),
    skills: data.skills.filter((s) => s.variant === variant).sort(bySort),
    softSkills: data.softSkills.filter((s) => s.variant === variant).sort(bySort),
    projects: data.projects.filter((p) => p.published && p[flag]).sort(bySort),
    experiences: data.experiences.filter((e) => e[flag]).sort(bySort),
  };
}

/** Racine des URLs d'une version : « » pour dev, « /amoa » pour amoa. */
export const basePath = (variant: Variant) => (variant === "dev" ? "" : "/amoa");

export const projectHref = (variant: Variant, slug: string) => `${basePath(variant)}/projets/${slug}`;

export const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Paragraphes d'un texte long, séparés par une ligne vide. Le premier sert de résumé. */
export const paragraphs = (text: string) =>
  text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

export const stackItems = (text: string) =>
  text
    .split(/[·,|]/)
    .map((s) => s.trim())
    .filter(Boolean);

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
