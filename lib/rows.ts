/** Tables « à lignes » éditables dans l'admin : l'interface et la validation serveur partagent ces définitions. */

export type RowField = {
  name: string;
  label: string;
  kind?: "text" | "number" | "textarea" | "select" | "bool";
  options?: { value: string; label: string }[];
  size?: "narrow" | "wide";
};

export type RowTable = {
  /** La table porte-t-elle une colonne `variant` (dev / amoa) ? */
  variant: boolean;
  fields: RowField[];
  /** Champs dont l'un au moins doit être rempli pour que la ligne existe. */
  required: string[];
};

export const ROW_TABLES = {
  metrics: {
    variant: true,
    required: ["value", "label"],
    fields: [
      { name: "value", label: "Valeur", size: "narrow" },
      { name: "label", label: "Légende" },
      { name: "sort", label: "Ordre", kind: "number", size: "narrow" },
    ],
  },
  skill_groups: {
    variant: true,
    required: ["title"],
    fields: [
      { name: "title", label: "Titre" },
      { name: "sort", label: "Ordre", kind: "number", size: "narrow" },
      { name: "items", label: "Compétences (séparées par « · »)", size: "wide" },
    ],
  },
  soft_skills: {
    variant: true,
    required: ["title"],
    fields: [
      { name: "title", label: "Qualité" },
      { name: "sort", label: "Ordre", kind: "number", size: "narrow" },
      { name: "text", label: "Description", kind: "textarea", size: "wide" },
    ],
  },
  experiences: {
    variant: false,
    required: ["title"],
    fields: [
      {
        name: "kind",
        label: "Type",
        kind: "select",
        options: [
          { value: "experience", label: "Expérience" },
          { value: "formation", label: "Formation" },
        ],
        size: "narrow",
      },
      { name: "period", label: "Période" },
      { name: "sort", label: "Ordre", kind: "number", size: "narrow" },
      { name: "title", label: "Intitulé", size: "wide" },
      { name: "org", label: "Organisme", size: "wide" },
      { name: "description", label: "Description", kind: "textarea", size: "wide" },
      { name: "show_dev", label: "Version développeur", kind: "bool", size: "narrow" },
      { name: "show_amoa", label: "Version AMOA", kind: "bool", size: "narrow" },
    ],
  },
} satisfies Record<string, RowTable>;

export type RowTableName = keyof typeof ROW_TABLES;
export const isRowTable = (name: string): name is RowTableName => name in ROW_TABLES;
