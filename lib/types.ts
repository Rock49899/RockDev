export const THEMES = ["neon", "ember", "bio", "mono"] as const;
export type Theme = (typeof THEMES)[number];

/** Deux lectures du même portfolio : `dev` (racine, pour les clients) et `amoa` (/amoa, pour les candidatures). */
export const VARIANTS = ["dev", "amoa"] as const;
export type Variant = (typeof VARIANTS)[number];

export const VARIANT_META: Record<Variant, { label: string; path: string }> = {
  dev: { label: "Version développeur", path: "/" },
  amoa: { label: "Version AMOA", path: "/amoa" },
};

/** Réglages communs aux deux versions. */
export type Settings = {
  first_name: string;
  last_name: string;
  logo_text: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  location_text: string;
  portrait_url: string;
  copyright: string;
  footer_note: string;
  default_theme: Theme;
};

/** Textes propres à une version. */
export type VariantProfile = {
  kicker: string;
  intro: string;
  available: boolean;
  availability_text: string;
  experience_value: string;
  experience_text: string;
  hero_stack: string;
  about_title: string;
  about_accent: string;
  about_p1: string;
  about_p2: string;
  about_cta: string;
  work_title: string;
  work_accent: string;
  work_text: string;
  funnels_title: string;
  funnels_accent: string;
  funnels_text: string;
  skills_title: string;
  skills_accent: string;
  skills_text: string;
  core_top: string;
  core_main: string;
  core_sub: string;
  soft_title: string;
  soft_accent: string;
  journey_title: string;
  journey_accent: string;
  journey_text: string;
  contact_title: string;
  contact_accent: string;
  cv_url: string;
};

export type Metric = { id: string; variant: Variant; value: string; label: string; sort: number };
export type SkillGroup = { id: string; variant: Variant; title: string; items: string; sort: number };
export type SoftSkill = { id: string; variant: Variant; title: string; text: string; sort: number };

/** `application` : plateforme développée ; `funnel` : funnel de vente ou landing page. */
export type ProjectKind = "application" | "funnel";

export type Project = {
  id: string;
  slug: string;
  kind: ProjectKind;
  title: string;
  type: string;
  stack: string;
  description: string;
  /** Points clés, un par ligne. */
  highlights: string;
  role: string;
  year: string;
  /** Galerie : la première image est la couverture. */
  images: string[];
  link_url: string;
  repo_url: string;
  sort: number;
  published: boolean;
  show_dev: boolean;
  show_amoa: boolean;
};

export type Experience = {
  id: string;
  kind: "experience" | "formation";
  period: string;
  title: string;
  org: string;
  description: string;
  show_dev: boolean;
  show_amoa: boolean;
  sort: number;
};

/** Tout le contenu, tel que stocké. */
export type SiteData = {
  settings: Settings;
  profiles: Record<Variant, VariantProfile>;
  metrics: Metric[];
  skills: SkillGroup[];
  softSkills: SoftSkill[];
  projects: Project[];
  experiences: Experience[];
};

/** Le contenu filtré pour une version donnée. */
export type SiteView = {
  variant: Variant;
  settings: Settings;
  profile: VariantProfile;
  metrics: Metric[];
  skills: SkillGroup[];
  softSkills: SoftSkill[];
  projects: Project[];
  experiences: Experience[];
};
