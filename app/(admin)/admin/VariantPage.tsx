import { Suspense } from "react";
import { VARIANT_GROUPS } from "@/lib/profile-fields";
import { VARIANT_META, type Variant } from "@/lib/types";
import AdminFrame from "./AdminFrame";
import { AdminForm } from "./AdminForm";
import { FieldGroups, RowsForm } from "./AdminUI";
import { MediaInput } from "./MediaInput";
import { saveVariant } from "./actions";
import { SITE_FALLBACK } from "./fallback";

const TITLES = {
  dev: {
    title: "Version développeur",
    lead: "Page d'accueil du site (/), pensée pour séduire des clients : projets, stack et qualités en avant.",
    href: "/admin/dev",
  },
  amoa: {
    title: "Version AMOA",
    lead: "Page /amoa, pour les candidatures (MIAGE, AMOA, Business Analyst) : parcours d'économiste mis en avant. Non indexée par Google.",
    href: "/admin/amoa",
  },
} as const;

export default function VariantPage({ variant }: { variant: Variant }) {
  const meta = TITLES[variant];
  return (
    <Suspense fallback={SITE_FALLBACK}>
      <AdminFrame
        active={meta.href}
        title={meta.title}
        lead={meta.lead}
        render={(data) => (
          <>
            <section id="textes">
              <h2>Textes de la page</h2>
              <AdminForm action={saveVariant} className="stack">
                <input type="hidden" name="variant" value={variant} />
                <div className="card">
                  <MediaInput
                    name="cv_url"
                    label={`CV (PDF) — ${VARIANT_META[variant].label}`}
                    folder="cv"
                    kind="pdf"
                    initial={data.profiles[variant].cv_url ? [data.profiles[variant].cv_url] : []}
                    hint="Le bouton « Télécharger CV » de cette version pointera vers ce fichier."
                  />
                </div>
                <FieldGroups groups={VARIANT_GROUPS} values={data.profiles[variant]} />
              </AdminForm>
            </section>

            <section id="chiffres">
              <h2>Chiffres clés</h2>
              <p className="lead">Affichés dans la section À propos. Vider une ligne ou cocher « Supprimer » la retire.</p>
              <RowsForm table="metrics" variant={variant} rows={data.metrics.filter((m) => m.variant === variant)} blank={2} />
            </section>

            <section id="expertise">
              <h2>Expertise</h2>
              <p className="lead">Quatre groupes s&apos;affichent autour du médaillon. Sépare les compétences par « · ».</p>
              <RowsForm table="skill_groups" variant={variant} rows={data.skills.filter((s) => s.variant === variant)} blank={1} />
            </section>

            <section id="qualites">
              <h2>Qualités humaines</h2>
              <p className="lead">Tes savoir-être : une courte phrase de preuve vaut mieux qu&apos;un adjectif.</p>
              <RowsForm table="soft_skills" variant={variant} rows={data.softSkills.filter((s) => s.variant === variant)} blank={2} />
            </section>
          </>
        )}
      />
    </Suspense>
  );
}
