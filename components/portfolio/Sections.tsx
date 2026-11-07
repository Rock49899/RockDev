import Image from "next/image";
import Link from "next/link";
import { basePath, paragraphs, projectHref, stackItems } from "@/lib/view";
import type { Project, SiteView } from "@/lib/types";
import Carousel from "./Carousel";
import { Icon } from "./Icon";
import ScrollEffects from "./ScrollEffects";
import { TechLogo } from "./TechLogo";
import type { NavItem } from "./Shell";
import { Lines, Rich } from "./text";

const pad = (n: number) => String(n).padStart(2, "0");
const ART_VARIANTS = ["nova", "kinetic", "fold"] as const;
export const artClass = (index: number) => ART_VARIANTS[index % ART_VARIANTS.length];

export function navFor(view: SiteView): NavItem[] {
  const items: NavItem[] = [
    { id: "home", label: "Accueil", icon: "home" },
    { id: "about", label: "Profil", icon: "user" },
    { id: "work", label: "Projets", icon: "work" },
  ];
  if (view.projects.some((p) => p.kind === "funnel")) items.push({ id: "funnels", label: "Funnels", icon: "funnel" });
  items.push({ id: "skills", label: "Expertise", icon: "code" });
  if (view.experiences.length > 0) items.push({ id: "journey", label: "Parcours", icon: "journey" });
  items.push({ id: "contact", label: "Contact", icon: "mail" });
  return items;
}

/** Visuel d'un projet : galerie animée s'il y a des images, sinon le motif graphique du template. */
export function ProjectArt({
  project,
  className,
  offset,
  priority,
  mode = "card",
}: {
  project: Project;
  className: string;
  offset?: number;
  priority?: boolean;
  mode?: "card" | "stage";
}) {
  if (project.images.length > 0) {
    return (
      <div className={`${className} has-image`}>
        <Carousel images={project.images} title={project.title} mode={mode} offset={offset} priority={priority} />
      </div>
    );
  }
  return (
    <div className={className}>
      <i />
      <b />
      <span>{project.title.slice(0, 1)}</span>
    </div>
  );
}

function ProjectCard({ project, index, view }: { project: Project; index: number; view: SiteView }) {
  return (
    <article className={`project ${artClass(index)}`}>
      <span className="project-no">{pad(index + 1)}</span>
      <ProjectArt project={project} className="project-art" offset={index * 900} />
      <div className="project-copy">
        <small>{project.type}</small>
        <h3>
          <Link className="project-link" href={projectHref(view.variant, project.slug)}>
            {project.title}
          </Link>
        </h3>
        <p>{paragraphs(project.description)[0]}</p>
        <ul className="chips" aria-label="Technologies">
          {stackItems(project.stack).map((tech) => (
            <li key={tech}>
              <TechLogo name={tech} />
              {tech}
            </li>
          ))}
        </ul>
      </div>
      <div className="project-actions">
        {project.link_url && (
          <a
            className="round-arrow gh"
            href={project.link_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ouvrir ${project.title} en ligne`}
            title="Voir le projet en ligne"
          >
            <Icon name="external" />
          </a>
        )}
        {project.repo_url && (
          <a
            className="round-arrow gh"
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Code source de ${project.title} sur GitHub`}
            title="Voir le code sur GitHub"
          >
            <Icon name="github" />
          </a>
        )}
        <span className="round-arrow go" aria-hidden="true">
          <Icon name="arrow" />
        </span>
      </div>
    </article>
  );
}

export default function Sections({ view }: { view: SiteView }) {
  const { settings, profile, metrics, projects, skills, softSkills, experiences } = view;
  const fullName = `${settings.first_name} ${settings.last_name}`.replace(/\.$/, "");
  const columns = [
    { label: "Expériences", items: experiences.filter((e) => e.kind === "experience") },
    { label: "Formation", items: experiences.filter((e) => e.kind === "formation") },
  ].filter((column) => column.items.length > 0);
  const applications = projects.filter((p) => p.kind !== "funnel");
  const funnels = projects.filter((p) => p.kind === "funnel");
  let n = 0;
  const tag = (label: string) => `${pad(++n)} / ${label}`;

  return (
    <>
      <ScrollEffects />
      <section id="home" className="hero">
        {profile.available && (
          <div className="availability">
            <i /> {profile.availability_text}
          </div>
        )}
        <div className="hero-grid">
          <div className="hero-copy reveal">
            <div className="kicker">
              <span /> {profile.kicker} <span />
            </div>
            <h1>
              {settings.first_name}
              <br />
              <em>{settings.last_name}</em>
            </h1>
            <p className="intro">
              <Rich text={profile.intro} />
            </p>
            <div className="actions">
              <a className="primary" href="#work">
                Voir mes projets <Icon name="arrow" />
              </a>
              <a className="ghost" href="#contact">
                Me contacter
              </a>
            </div>
          </div>
          <div className="portrait-wrap">
            <div className="portrait-frame">
              {settings.portrait_url ? (
                <Image
                  src={settings.portrait_url}
                  alt={`Portrait de ${fullName}`}
                  fill
                  priority
                  sizes="(max-width: 720px) 90vw, 480px"
                />
              ) : (
                <div className="portrait-placeholder" aria-hidden="true">
                  {settings.logo_text}
                </div>
              )}
              <div className="scanline" />
            </div>
            <span className="corner top" />
            <span className="corner bottom" />
            <div className="xp">
              <strong>{profile.experience_value}</strong>
              <span>
                <Lines text={profile.experience_text} />
              </span>
            </div>
            <div className="coordinates">{settings.location_text}</div>
          </div>
        </div>
        <a className="scroll" href="#about">
          <i /> SCROLL TO EXPLORE
        </a>
      </section>

      <section id="about" className="about section-pad">
        <div className="section-tag">{tag("À PROPOS")}</div>
        <div className="about-grid">
          <h2>
            <Lines text={profile.about_title} />
            <br />
            <em>{profile.about_accent}</em>
          </h2>
          <div className="manifesto">
            <p>
              <Rich text={profile.about_p1} />
            </p>
            <p>
              <Rich text={profile.about_p2} />
            </p>
            <a className="text-link" href="#skills">
              {profile.about_cta} <Icon name="arrow" />
            </a>
          </div>
          <div className="metrics">
            {metrics.map((metric) => (
              <article key={metric.id}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="work section-pad">
        <div className="section-head">
          <div>
            <div className="section-tag">{tag("PROJETS SÉLECTIONNÉS")}</div>
            <h2>
              <Lines text={profile.work_title} />
              <br />
              <em>{profile.work_accent}</em>
            </h2>
          </div>
          <p>{profile.work_text}</p>
        </div>
        <div className="project-list">
          {applications.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} view={view} />
          ))}
        </div>
      </section>

      {funnels.length > 0 && (
        <section id="funnels" className="work funnels section-pad">
          <div className="section-head">
            <div>
              <div className="section-tag">{tag("FUNNELS & LANDING PAGES")}</div>
              <h2>
                <Lines text={profile.funnels_title} />
                <br />
                <em>{profile.funnels_accent}</em>
              </h2>
            </div>
            <p>{profile.funnels_text}</p>
          </div>
          <div className="project-list">
            {funnels.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} view={view} />
            ))}
          </div>
        </section>
      )}

      <section id="skills" className="skills section-pad">
        <div className="section-tag">{tag("EXPERTISE")}</div>
        <div className="skills-intro">
          <h2>
            <Lines text={profile.skills_title} />
            <br />
            <em>{profile.skills_accent}</em>
          </h2>
          <p>{profile.skills_text}</p>
        </div>
        <div className="orbit">
          <div className="orbit-core">
            <span>{profile.core_top}</span>
            <strong>{profile.core_main}</strong>
            <small>{profile.core_sub}</small>
          </div>
          {skills.slice(0, 6).map((group, index) => (
            <article key={group.id}>
              <span>{pad(index + 1)}</span>
              <h3>{group.title}</h3>
              <ul className="chips" aria-label={group.title}>
                {stackItems(group.items).map((tech) => (
                  <li key={tech}>
                    <TechLogo name={tech} />
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {softSkills.length > 0 && (
          <div className="soft">
            <div className="section-tag">QUALITÉS</div>
            <h2>
              <Lines text={profile.soft_title} />
              <br />
              <em>{profile.soft_accent}</em>
            </h2>
            <div className="soft-grid">
              {softSkills.map((skill, index) => (
                <article key={skill.id}>
                  <span>{pad(index + 1)}</span>
                  <h3>{skill.title}</h3>
                  <p>{skill.text}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {experiences.length > 0 && (
        <section id="journey" className="journey section-pad">
          <div className="section-head">
            <div>
              <div className="section-tag">{tag("PARCOURS")}</div>
              <h2>
                <Lines text={profile.journey_title} />
                <br />
                <em>{profile.journey_accent}</em>
              </h2>
            </div>
            <p>{profile.journey_text}</p>
          </div>
          <div className="timeline">
            {columns.map((column) => (
              <div key={column.label}>
                <h3 className="col-title">{column.label}</h3>
                {column.items.map((item) => (
                  <article className="t-item" key={item.id}>
                    <span className="t-period">{item.period}</span>
                    <h3>{item.title}</h3>
                    {item.org && <span className="t-org">{item.org}</span>}
                    {item.description && <p>{item.description}</p>}
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="contact" className="contact section-pad">
        <div className="terminal">
          <div className="terminal-bar">
            <span />
            <span />
            <span />
            <small>contact.sh</small>
          </div>
          <p>
            <b>$</b> initiate_collaboration --with=&quot;{settings.first_name.toLowerCase()}&quot;
          </p>
          <p className="success">✓ Profil chargé. Connexion possible.</p>
        </div>
        <div className="contact-copy">
          <div className="section-tag">{tag("CONTACT")}</div>
          <h2>
            <Lines text={profile.contact_title} />
            <br />
            <em>{profile.contact_accent}</em>
          </h2>
          <a className="big-mail" href={`mailto:${settings.email}`}>
            {settings.email} <Icon name="arrow" />
          </a>
        </div>
        <SiteFooter view={view} />
      </section>
    </>
  );
}

export function SiteFooter({ view }: { view: SiteView }) {
  const { settings, variant } = view;
  return (
    <footer>
      <span>{settings.copyright}</span>
      <span>{settings.footer_note}</span>
      <span className="footer-links">
        <Link href={`${basePath(variant) || "/"}#home`} scroll>
          RETOUR EN HAUT ↑
        </Link>
        {variant === "dev" ? (
          <Link className="alt-version" href="/amoa" aria-label="Autre version du portfolio">
            ·
          </Link>
        ) : (
          <Link className="alt-version visible" href="/">
            ← VERSION DÉVELOPPEUR
          </Link>
        )}
      </span>
    </footer>
  );
}
