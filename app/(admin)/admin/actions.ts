"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PORTFOLIO_TAG } from "@/lib/content";
import { requireAdmin } from "@/lib/auth";
import { SETTINGS_FIELDS, VARIANT_FIELDS, type Field } from "@/lib/profile-fields";
import { ROW_TABLES, isRowTable } from "@/lib/rows";
import { seed, seedRows } from "@/lib/seed";
import { MEDIA_BUCKET, supabaseUrl } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { THEMES, VARIANTS, type Variant } from "@/lib/types";
import { slugify } from "@/lib/view";

export type ActionState = { ok: boolean; message: string } | null;

const ok = (message: string): ActionState => ({ ok: true, message });
const fail = (message: string): ActionState => ({ ok: false, message });

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/** Seules les URLs de notre bucket sont acceptées : un formulaire trafiqué ne peut pas injecter un lien externe. */
function isOwnMedia(url: string) {
  return Boolean(supabaseUrl) && url.startsWith(`${supabaseUrl}/storage/v1/object/public/${MEDIA_BUCKET}/`);
}

function publish() {
  updateTag(PORTFOLIO_TAG);
  revalidatePath("/admin", "layout");
}

/** Lit et valide les champs d'un formulaire d'après leur définition. */
function readFields(form: FormData, fields: Field[]): { values: Record<string, string | boolean> } | { error: string } {
  const values: Record<string, string | boolean> = {};
  for (const field of fields) {
    if (field.kind === "bool") {
      values[field.key] = form.get(field.key) === "on";
      continue;
    }
    const value = text(form, field.key);
    if (field.kind === "url" && value && !isHttpUrl(value)) {
      return { error: `« ${field.label} » doit commencer par https://` };
    }
    if (field.kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return { error: "L'e-mail de contact n'est pas valide." };
    }
    if (field.kind === "theme" && !THEMES.includes(value as (typeof THEMES)[number])) {
      return { error: "Thème inconnu." };
    }
    values[field.key] = value;
  }
  return { values };
}

function readVariant(form: FormData): Variant | null {
  const value = text(form, "variant");
  return (VARIANTS as readonly string[]).includes(value) ? (value as Variant) : null;
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function signIn(_: ActionState, form: FormData): Promise<ActionState> {
  const email = text(form, "email");
  const password = String(form.get("password") ?? "");
  if (!email || !password) return fail("Renseigne l'e-mail et le mot de passe.");

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return fail("Identifiants incorrects.");
  redirect("/admin");
}

/** Premier lancement : copie le contenu de départ (`lib/seed.ts`) dans les tables vides. */
export async function initializeContent(): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const { error: settingsError } = await supabase.from("site_settings").upsert({ id: 1, ...seed.settings });
  if (settingsError) return fail(`Initialisation impossible : ${settingsError.message}`);

  const profiles = VARIANTS.map((variant) => ({ variant, ...seed.profiles[variant] }));
  const { error: profileError } = await supabase.from("profile").upsert(profiles);
  if (profileError) return fail(profileError.message);

  const lists: Array<[string, object[]]> = [
    ["metrics", seedRows.metrics],
    ["skill_groups", seedRows.skills],
    ["soft_skills", seedRows.softSkills],
    ["projects", seedRows.projects],
    ["experiences", seedRows.experiences],
  ];
  for (const [table, rows] of lists) {
    const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true });
    if (error) return fail(error.message);
    if (count) continue; // table déjà remplie : on n'écrase rien
    const { error: insertError } = await supabase.from(table).insert(rows);
    if (insertError) return fail(`${table} : ${insertError.message}`);
  }

  publish();
  return ok("Contenu de départ chargé. Le site est à jour.");
}

export async function saveSettings(_: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const read = readFields(form, SETTINGS_FIELDS);
  if ("error" in read) return fail(read.error);

  const portrait = text(form, "portrait_url");
  if (portrait && !isOwnMedia(portrait)) return fail("Photo de profil invalide : renvoie le fichier.");

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...read.values, portrait_url: portrait, updated_at: new Date().toISOString() });
  if (error) return fail(`Enregistrement refusé : ${error.message}`);

  publish();
  return ok("Réglages enregistrés. Les deux versions sont à jour.");
}

export async function saveVariant(_: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const variant = readVariant(form);
  if (!variant) return fail("Version inconnue.");

  const read = readFields(form, VARIANT_FIELDS);
  if ("error" in read) return fail(read.error);

  const cv = text(form, "cv_url");
  if (cv && !isOwnMedia(cv)) return fail("CV invalide : renvoie le fichier.");

  const { error } = await supabase
    .from("profile")
    .upsert({ variant, ...read.values, cv_url: cv, updated_at: new Date().toISOString() });
  if (error) return fail(`Enregistrement refusé : ${error.message}`);

  publish();
  return ok(variant === "dev" ? "Version développeur enregistrée." : "Version AMOA enregistrée.");
}

/** Enregistre un tableau de lignes (chiffres, expertise, qualités, parcours) : ajout, modification, suppression. */
export async function saveRows(_: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const tableName = text(form, "table");
  if (!isRowTable(tableName)) return fail("Tableau inconnu.");
  const table = ROW_TABLES[tableName];

  const variant = table.variant ? readVariant(form) : null;
  if (table.variant && !variant) return fail("Version inconnue.");

  const count = Math.min(Number(form.get("rows")) || 0, 100);
  for (let i = 0; i < count; i++) {
    const id = text(form, `row_${i}_id`);
    const remove = form.get(`row_${i}_remove`) === "on";

    const payload: Record<string, string | number | boolean> = {};
    for (const field of table.fields) {
      const key = `row_${i}_${field.name}`;
      if (field.kind === "bool") payload[field.name] = form.get(key) === "on";
      else if (field.kind === "number") payload[field.name] = Number(form.get(key)) || i + 1;
      else payload[field.name] = text(form, key);
    }

    const empty = table.required.every((name) => !payload[name]);
    if (id && (remove || empty)) {
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) return fail(error.message);
      continue;
    }
    if (empty || remove) continue;
    if (table.required.some((name) => !payload[name])) return fail("Une ligne est incomplète : tous les champs principaux sont requis.");

    const { error } = id
      ? await supabase.from(tableName).update(payload).eq("id", id)
      : await supabase.from(tableName).insert(variant ? { ...payload, variant } : payload);
    if (error) return fail(error.message);
  }

  publish();
  return ok("Enregistré.");
}

export async function saveProject(_: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");

  if (form.get("intent") === "delete") {
    if (!id) return fail("Projet introuvable.");
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return fail(error.message);
    publish();
    return ok("Projet supprimé.");
  }

  const title = text(form, "title");
  if (!title) return fail("Le titre du projet est obligatoire.");

  const slug = slugify(text(form, "slug") || title);
  if (!slug) return fail("Le titre doit contenir des lettres ou des chiffres.");

  for (const key of ["link_url", "repo_url"]) {
    const value = text(form, key);
    if (value && !isHttpUrl(value)) return fail("Les liens doivent commencer par https://");
  }

  const images = form.getAll("images").map(String).filter(Boolean);
  if (!images.every(isOwnMedia)) return fail("Une image est invalide : renvoie-la.");

  const payload = {
    slug,
    kind: text(form, "kind") === "funnel" ? "funnel" : "application",
    title,
    type: text(form, "type"),
    stack: text(form, "stack"),
    description: text(form, "description"),
    highlights: text(form, "highlights"),
    role: text(form, "role"),
    year: text(form, "year"),
    images,
    link_url: text(form, "link_url"),
    repo_url: text(form, "repo_url"),
    sort: Number(form.get("sort")) || 0,
    published: form.get("published") === "on",
    show_dev: form.get("show_dev") === "on",
    show_amoa: form.get("show_amoa") === "on",
  };

  const { error } = id
    ? await supabase.from("projects").update(payload).eq("id", id)
    : await supabase.from("projects").insert(payload);
  if (error) {
    return fail(error.code === "23505" ? `Le lien « ${slug} » existe déjà : change le titre ou l'adresse.` : `Enregistrement refusé : ${error.message}`);
  }

  publish();
  return ok(id ? "Projet enregistré." : "Projet ajouté.");
}
