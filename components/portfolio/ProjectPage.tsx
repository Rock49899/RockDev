import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/content";
import { lines, paragraphs, projectHref, selectVariant, stackItems } from "@/lib/view";
import type { Variant } from "@/lib/types";
import { Icon } from "./Icon";
import { TechLogo } from "./TechLogo";
import { ProjectArt, navFor } from "./Sections";
import Shell from "./Shell";

const pad = (n: number) => String(n).padStart(2, "0");

/** Page détail d'un projet : galerie en vedette, points clés, stack et liens (site, GitHub). */
export default async function ProjectPage({
  variant,
  params,
}: {
  variant: Variant;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const view = selectVariant(await getSiteData(), variant);
  const index = view.projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();

  const project = view.projects[index];
  const previous = view.projects[index - 1];
  const next = view.projects[index + 1];
  const base = variant === "amoa" ? "/amoa" : "";
  const highlights = lines(project.highlights);
  const [lead, ...story] = paragraphs(project.description);
  const subject = encodeURIComponent(`Projet similaire à ${project.title}`);

  return (
    <Shell settings={view.settings} profile={view.profile} variant={variant} mode="detail" nav={navFor(view)}>
      <article className="detail">
        <div className="detail-top">
          <Link className="back" href={`${base}/#${project.kind === "funnel" ? "funnels" : "work"}`}>
            <Icon name="arrow" /> {project.kind === "funnel" ? "Tous les funnels" : "Tous les projets"}
          </Link>
          <span className="detail-count">
            PROJET {pad(index + 1)} / {pad(view.projects.length)}
          </span>
        </div>

        <header className="detail-head">
          <small>{project.type}</small>
          <h1>{project.title}</h1>
          <p className="detail-lead">{lead}</p>
          {project.link_url && (
            <a className="primary detail-live" href={project.link_url} target="_blank" rel="noopener noreferrer">
              Voir le projet en ligne <Icon name="external" />
            </a>
          )}
        </header>

        <ProjectArt project={project} className="detail-art" mode="stage" priority />

        <div className="detail-grid">
          <div>
            {story.length > 0 && (
              <div className="detail-story">
                <h2 className="mini">Le projet</h2>
                {story.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            )}
            {highlights.length > 0 && story.length === 0 && (
              <>
                <h2 className="mini">Points clés</h2>
                <ul className="highlights">
                  {highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <aside className="detail-meta">
            <dl>
              {project.role && (
                <div>
                  <dt>Rôle</dt>
                  <dd>{project.role}</dd>
                </div>
              )}
              {project.year && (
                <div>
                  <dt>Année</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
              <div>
                <dt>Stack</dt>
                <dd>
                  <ul className="chips">
                    {stackItems(project.stack).map((tech) => (
                      <li key={tech}>
                        <TechLogo name={tech} />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <div className="detail-cta">
              {project.repo_url && (
                <a className="ghost github" href={project.repo_url} target="_blank" rel="noopener noreferrer">
                  <Icon name="github" /> Code source sur GitHub
                </a>
              )}
              <a className="ghost" href={`mailto:${view.settings.email}?subject=${subject}`}>
                Un projet similaire ? Parlons-en
              </a>
            </div>
          </aside>
        </div>

        <nav className="detail-pager" aria-label="Autres projets">
          {previous ? (
            <Link href={projectHref(variant, previous.slug)}>
              <small>← PROJET PRÉCÉDENT</small>
              <strong>{previous.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={projectHref(variant, next.slug)}>
              <small>PROJET SUIVANT →</small>
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </Shell>
  );
}
