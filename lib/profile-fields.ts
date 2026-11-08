export type FieldKind = "text" | "lines" | "textarea" | "url" | "email" | "bool" | "theme";

export type Field = {
  key: string;
  label: string;
  kind: FieldKind;
  hint?: string;
};

export type FieldGroup = { id: string; title: string; fields: Field[] };

const RETOURS = "Un retour à la ligne crée un saut de ligne sur le site.";
const GRAS = "Entoure un mot de **deux astérisques** pour le mettre en valeur.";

/** Réglages communs aux deux versions. Source unique pour l'admin et la validation serveur. */
export const SETTINGS_GROUPS: FieldGroup[] = [
  {
    id: "identite",
    title: "Identité",
    fields: [
      { key: "first_name", label: "Prénom (affiché en grand)", kind: "text" },
      { key: "last_name", label: "Nom (dégradé de couleur)", kind: "text", hint: "Le point final fait partie du design." },
      { key: "logo_text", label: "Initiales du logo", kind: "text" },
      { key: "location_text", label: "Localisation", kind: "text" },
    ],
  },
  {
    id: "contact",
    title: "Contact et réseaux",
    fields: [
      { key: "email", label: "E-mail de contact", kind: "email" },
      { key: "linkedin_url", label: "LinkedIn", kind: "url", hint: "Laisser vide pour masquer l'icône." },
      { key: "github_url", label: "GitHub", kind: "url", hint: "Laisser vide pour masquer l'icône." },
    ],
  },
  {
    id: "pied",
    title: "Pied de page et apparence",
    fields: [
      { key: "copyright", label: "Mention de copyright", kind: "text" },
      { key: "footer_note", label: "Signature", kind: "text" },
      { key: "default_theme", label: "Thème de couleurs du site", kind: "theme", hint: "Appliqué à toutes les pages, pour tous les visiteurs. Les visiteurs ne peuvent pas le changer." },
    ],
  },
];

/** Textes d'une version (développeur ou AMOA). */
export const VARIANT_GROUPS: FieldGroup[] = [
  {
    id: "accroche",
    title: "Accroche",
    fields: [
      { key: "kicker", label: "Sous-titre au-dessus du nom", kind: "text" },
      { key: "intro", label: "Phrase d'introduction", kind: "textarea", hint: GRAS },
      { key: "available", label: "Afficher le badge de disponibilité", kind: "bool" },
      { key: "availability_text", label: "Texte du badge", kind: "text" },
      { key: "experience_value", label: "Chiffre sur la photo", kind: "text", hint: "Ex. 4 ou 6+" },
      { key: "experience_text", label: "Légende du chiffre", kind: "textarea", hint: RETOURS },
    ],
  },
  {
    id: "apropos",
    title: "Section À propos",
    fields: [
      { key: "about_title", label: "Titre", kind: "lines", hint: RETOURS },
      { key: "about_accent", label: "Fin du titre (en couleur)", kind: "text" },
      { key: "about_p1", label: "Premier paragraphe", kind: "textarea", hint: GRAS },
      { key: "about_p2", label: "Second paragraphe", kind: "textarea", hint: GRAS },
      { key: "about_cta", label: "Texte du lien", kind: "text" },
    ],
  },
  {
    id: "projets",
    title: "Section Projets",
    fields: [
      { key: "work_title", label: "Titre", kind: "lines", hint: RETOURS },
      { key: "work_accent", label: "Fin du titre (en couleur)", kind: "text" },
      { key: "work_text", label: "Texte d'accompagnement", kind: "textarea" },
    ],
  },
  {
    id: "funnels",
    title: "Section Funnels et landing pages",
    fields: [
      { key: "funnels_title", label: "Titre", kind: "lines", hint: "La section n'apparaît que si au moins un projet est de type « Funnel / landing page »." },
      { key: "funnels_accent", label: "Fin du titre (en couleur)", kind: "text" },
      { key: "funnels_text", label: "Texte d'accompagnement", kind: "textarea" },
    ],
  },
  {
    id: "expertise",
    title: "Section Expertise et qualités",
    fields: [
      { key: "skills_title", label: "Titre", kind: "lines", hint: RETOURS },
      { key: "skills_accent", label: "Fin du titre (en couleur)", kind: "text" },
      { key: "skills_text", label: "Texte d'accompagnement", kind: "textarea" },
      { key: "core_top", label: "Médaillon : ligne du haut", kind: "text" },
      { key: "core_main", label: "Médaillon : mot principal", kind: "text" },
      { key: "core_sub", label: "Médaillon : ligne du bas", kind: "text" },
      { key: "soft_title", label: "Titre des qualités", kind: "lines", hint: RETOURS },
      { key: "soft_accent", label: "Fin du titre des qualités", kind: "text" },
    ],
  },
  {
    id: "parcours",
    title: "Section Parcours",
    fields: [
      { key: "journey_title", label: "Titre", kind: "lines", hint: RETOURS },
      { key: "journey_accent", label: "Fin du titre (en couleur)", kind: "text" },
      { key: "journey_text", label: "Texte d'accompagnement", kind: "textarea" },
    ],
  },
  {
    id: "contact",
    title: "Section Contact",
    fields: [
      { key: "contact_title", label: "Titre", kind: "lines", hint: RETOURS },
      { key: "contact_accent", label: "Fin du titre (en couleur)", kind: "text" },
    ],
  },
];

export const SETTINGS_FIELDS: Field[] = SETTINGS_GROUPS.flatMap((g) => g.fields);
export const VARIANT_FIELDS: Field[] = VARIANT_GROUPS.flatMap((g) => g.fields);
