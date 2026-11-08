import { ROW_TABLES, type RowField, type RowTableName } from "@/lib/rows";
import type { Field, FieldGroup } from "@/lib/profile-fields";
import { THEMES, type Project, type Variant } from "@/lib/types";
import { AdminForm } from "./AdminForm";
import { MediaInput } from "./MediaInput";
import { saveProject, saveRows } from "./actions";

const THEME_LABELS: Record<(typeof THEMES)[number], string> = {
  neon: "Neon (cyan · violet)",
  ember: "Ember (orange · ambre)",
  bio: "Bio (vert · acide)",
  mono: "Signal (rouge · ivoire)",
};

export function FieldInput({ field, value }: { field: Field; value: unknown }) {
  const id = `f-${field.key}`;
  return (
    <div className="field">
      {field.kind === "bool" ? (
        <label className="check">
          <input id={id} type="checkbox" name={field.key} defaultChecked={Boolean(value)} />
          {field.label}
        </label>
      ) : (
        <label id={`${id}-label`} htmlFor={field.kind === "theme" ? undefined : id}>
          {field.label}
        </label>
      )}
      {(field.kind === "textarea" || field.kind === "lines") && (
        <textarea id={id} name={field.key} rows={field.kind === "lines" ? 2 : 3} defaultValue={String(value ?? "")} />
      )}
      {field.kind === "theme" && (
        <div className="theme-choices" role="radiogroup" aria-labelledby={`${id}-label`}>
          {THEMES.map((theme) => (
            <label key={theme} className="theme-choice">
              <input type="radio" name={field.key} value={theme} defaultChecked={value === theme} />
              <i className={`swatch swatch-${theme}`} />
              <span>{THEME_LABELS[theme]}</span>
            </label>
          ))}
        </div>
      )}
      {(field.kind === "text" || field.kind === "url" || field.kind === "email") && (
        <input
          id={id}
          name={field.key}
          type={field.kind === "text" ? "text" : field.kind}
          defaultValue={String(value ?? "")}
          placeholder={field.kind === "url" ? "https://" : undefined}
        />
      )}
      {field.hint && <small>{field.hint}</small>}
    </div>
  );
}

export function FieldGroups({ groups, values }: { groups: FieldGroup[]; values: object }) {
  const record = values as Record<string, unknown>;
  return (
    <>
      {groups.map((group) => (
        <fieldset key={group.id} className="card">
          <legend>{group.title}</legend>
          {group.fields.map((field) => (
            <FieldInput key={field.key} field={field} value={record[field.key]} />
          ))}
        </fieldset>
      ))}
    </>
  );
}

function RowFieldInput({ field, name, value }: { field: RowField; name: string; value: unknown }) {
  if (field.kind === "bool") {
    return (
      <label className="check cell narrow">
        <input type="checkbox" name={name} defaultChecked={Boolean(value)} /> {field.label}
      </label>
    );
  }
  const cls = `cell${field.size ? ` ${field.size}` : ""}`;
  return (
    <label className={cls}>
      {field.label}
      {field.kind === "textarea" ? (
        <textarea name={name} rows={2} defaultValue={String(value ?? "")} />
      ) : field.kind === "select" ? (
        <select name={name} defaultValue={String(value ?? field.options?.[0]?.value)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input name={name} type={field.kind === "number" ? "number" : "text"} defaultValue={String(value ?? "")} />
      )}
    </label>
  );
}

/** Tableau de lignes éditables (chiffres, expertise, qualités, parcours) avec lignes vides pour ajouter. */
export function RowsForm({
  table,
  variant,
  rows,
  blank = 1,
}: {
  table: RowTableName;
  variant?: Variant;
  rows: Array<{ id: string } & object>;
  blank?: number;
}) {
  const spec = ROW_TABLES[table];
  const all: Array<({ id: string } & Record<string, unknown>) | null> = [
    ...(rows as Array<{ id: string } & Record<string, unknown>>),
    ...Array.from({ length: blank }, () => null),
  ];
  const defaults: Record<string, unknown> = { show_dev: true, show_amoa: true, kind: "experience" };

  return (
    <AdminForm action={saveRows}>
      <input type="hidden" name="table" value={table} />
      {variant && <input type="hidden" name="variant" value={variant} />}
      <input type="hidden" name="rows" value={all.length} />
      <div className="card rows">
        {all.map((row, i) => (
          <div className="row" key={row?.id ?? `new-${i}`}>
            <input type="hidden" name={`row_${i}_id`} value={row?.id ?? ""} />
            {spec.fields.map((field) => (
              <RowFieldInput
                key={field.name}
                field={field}
                name={`row_${i}_${field.name}`}
                value={row ? row[field.name] : defaults[field.name]}
              />
            ))}
            {row ? (
              <label className="check cell narrow remove">
                <input type="checkbox" name={`row_${i}_remove`} /> Supprimer
              </label>
            ) : (
              <span className="cell narrow new-tag">Nouvelle ligne</span>
            )}
          </div>
        ))}
      </div>
    </AdminForm>
  );
}

function TextField({
  name,
  label,
  value,
  hint,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  value?: string;
  hint?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="field">
      <label>
        {label}
        <input name={name} type={type} defaultValue={value ?? ""} required={required} placeholder={placeholder} />
      </label>
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function ProjectForm({ project }: { project?: Project }) {
  const key = project?.id ?? "new";
  return (
    <AdminForm
      action={saveProject}
      className="stack"
      submitLabel={project ? "Enregistrer le projet" : "Ajouter le projet"}
      extraIntent={
        project
          ? { value: "delete", label: "Supprimer", confirm: `Supprimer définitivement « ${project.title} » ?` }
          : undefined
      }
    >
      {project && <input type="hidden" name="id" value={project.id} />}
      <div className="grid">
        <div className="field">
          <label htmlFor={`kind-${key}`}>Type de réalisation</label>
          <select id={`kind-${key}`} name="kind" defaultValue={project?.kind ?? "application"}>
            <option value="application">Application / plateforme</option>
            <option value="funnel">Funnel / landing page</option>
          </select>
          <small>Les funnels s&apos;affichent dans leur propre section.</small>
        </div>
        <TextField name="title" label="Titre" value={project?.title} required />
        <TextField
          name="slug"
          label="Adresse de la page"
          value={project?.slug}
          hint="Ex. walab → /projets/walab. Laisser vide pour la déduire du titre."
        />
        <TextField name="type" label="Catégorie" value={project?.type} hint="Ex. FINTECH / SAAS" />
        <TextField name="stack" label="Technologies" value={project?.stack} hint="Séparées par « · » : Laravel · Vue.js · MySQL" />
        <TextField name="role" label="Rôle" value={project?.role} />
        <TextField name="year" label="Année" value={project?.year} />
        <TextField name="sort" label="Ordre d'affichage" value={String(project?.sort ?? 99)} type="number" />
        <TextField name="link_url" label="Lien du projet en ligne" value={project?.link_url} type="url" placeholder="https://" />
        <TextField name="repo_url" label="Lien GitHub du projet" value={project?.repo_url} type="url" placeholder="https://github.com/…" />
      </div>
      <div className="field">
        <label htmlFor={`desc-${key}`}>Description</label>
        <textarea id={`desc-${key}`} name="description" rows={10} defaultValue={project?.description ?? ""} />
        <small>Séparez les paragraphes par une ligne vide. Le premier sert de résumé sur la carte du projet.</small>
      </div>
      <div className="field">
        <label htmlFor={`high-${key}`}>Points clés</label>
        <textarea id={`high-${key}`} name="highlights" rows={4} defaultValue={project?.highlights ?? ""} />
        <small>Un point par ligne : ce que tu as livré, les résultats, les choix techniques.</small>
      </div>
      <MediaInput
        name="images"
        label="Galerie d'images"
        folder="projects"
        initial={project?.images ?? []}
        multiple
        hint="La première image sert de couverture ; elles défilent en carrousel sur le site. Format paysage conseillé (1200 × 750 px), 8 Mo max chacune."
      />
      <div className="flags">
        <label className="check">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? true} /> Publié
        </label>
        <label className="check">
          <input type="checkbox" name="show_dev" defaultChecked={project?.show_dev ?? true} /> Afficher dans la version développeur
        </label>
        <label className="check">
          <input type="checkbox" name="show_amoa" defaultChecked={project?.show_amoa ?? true} /> Afficher dans la version AMOA
        </label>
      </div>
    </AdminForm>
  );
}
