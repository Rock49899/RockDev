import { useEffect, useState } from "react"

type IconName = "home" | "user" | "work" | "code" | "mail" | "arrow" | "download" | "github" | "linkedin" | "menu" | "close"
type Theme = "neon" | "ember" | "bio" | "mono"

const icons: Record<IconName, React.ReactNode> = {
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
  user: <><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
  work: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></>,
  code: <><path d="m8 9-4 3 4 3m8-6 4 3-4 3M14 5l-4 14"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></>,
  arrow: <><path d="M5 12h14m-5-5 5 5-5 5"/></>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4M5 21h14"/></>,
  github: <><path d="M15 22v-4c0-1 .4-2-1-3 4 0 7-2 7-6a5 5 0 0 0-1-3 5 5 0 0 0 0-4s-2 0-4 2a13 13 0 0 0-8 0C6 2 4 2 4 2a5 5 0 0 0 0 4 5 5 0 0 0-1 3c0 4 3 6 7 6-1 1-1 2-1 3v4"/><path d="M9 19c-3 1-3-2-5-2"/></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-7m0 3c1-4 6-4 6 1v3"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="m5 5 14 14M19 5 5 19"/></>,
}

function Icon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>
}

const nav = [
  ["home", "Accueil", "home"],
  ["about", "Profil", "user"],
  ["work", "Projets", "work"],
  ["skills", "Expertise", "code"],
  ["contact", "Contact", "mail"],
] as const

const projects = [
  { no: "01", title: "NOVA FINANCE", type: "FINTECH / FULLSTACK", stack: "Next.js · Node · PostgreSQL", className: "nova", text: "Un cockpit financier temps réel pensé pour rendre la complexité immédiatement lisible." },
  { no: "02", title: "KINETIC AI", type: "SAAS / INTELLIGENCE", stack: "React · Python · OpenAI", className: "kinetic", text: "Un espace de collaboration augmenté où l’IA disparaît derrière des usages fluides." },
  { no: "03", title: "FOLD STUDIO", type: "COMMERCE / EXPÉRIENCE", stack: "Three.js · Shopify · GSAP", className: "fold", text: "Une boutique immersive qui transforme chaque collection en espace éditorial." },
]

const themes: { id: Theme; no: string; name: string; note: string }[] = [
  { id: "neon", no: "01", name: "Neon", note: "Cyan · Violet" },
  { id: "ember", no: "02", name: "Ember", note: "Orange · Ambre" },
  { id: "bio", no: "03", name: "Bio", note: "Vert · Acide" },
  { id: "mono", no: "04", name: "Signal", note: "Rouge · Ivoire" },
]

function App() {
  const [active, setActive] = useState("home")
  const [menu, setMenu] = useState(false)
  const [project, setProject] = useState<(typeof projects)[number] | null>(null)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("portfolio-theme")
    return themes.some((item) => item.id === saved) ? (saved as Theme) : "neon"
  })

  useEffect(() => {
    const handler = () => {
      const sections = nav.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
      const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= 180)
      if (current) setActive(current.id)
    }
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenu(false)
  }

  const changeTheme = (nextTheme: Theme) => {
    setTheme(nextTheme)
    localStorage.setItem("portfolio-theme", nextTheme)
  }

  return (
    <div className={`portfolio theme-${theme}`}>
      <aside className={menu ? "sidebar open" : "sidebar"}>
        <button className="logo" onClick={() => go("home")} aria-label="Accueil">ND<span>.</span></button>
        <nav aria-label="Navigation principale">
          {nav.map(([id, label, icon]) => (
            <button key={id} className={active === id ? "active" : ""} onClick={() => go(id)}>
              <Icon name={icon} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <a className="cv" href="mailto:hello@noah.dev?subject=Demande de CV"><Icon name="download" /> Télécharger CV</a>
        <div className="socials">
          <a href="https://github.com" aria-label="GitHub"><Icon name="github" /></a>
          <a href="https://linkedin.com" aria-label="LinkedIn"><Icon name="linkedin" /></a>
        </div>
      </aside>

      <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="Menu"><Icon name={menu ? "close" : "menu"} /></button>

      <main>
        <div className="theme-switcher" aria-label="Choisir une direction chromatique">
          <span className="theme-label">COLOR SYSTEM</span>
          <div className="theme-options">
            {themes.map((item) => (
              <button
                key={item.id}
                className={theme === item.id ? "active" : ""}
                onClick={() => changeTheme(item.id)}
                aria-label={`Thème ${item.name}, ${item.note}`}
                title={`${item.name} — ${item.note}`}
              >
                <i className={`swatch swatch-${item.id}`} />
                <span><b>{item.no} / {item.name}</b><small>{item.note}</small></span>
              </button>
            ))}
          </div>
        </div>
        <section id="home" className="hero">
          <div className="availability"><i /> Disponible pour une nouvelle mission</div>
          <div className="hero-grid">
            <div className="hero-copy reveal">
              <div className="kicker"><span /> FULLSTACK CREATIVE DEVELOPER <span /></div>
              <p className="overline">Bonjour, je suis</p>
              <h1>NOAH<br /><em>DUPONT.</em></h1>
              <p className="intro">Je conçois des <b>expériences numériques</b> où l’ingénierie robuste rencontre un design audacieux.</p>
              <div className="actions">
                <button className="primary" onClick={() => go("work")}>Voir mes projets <Icon name="arrow" /></button>
                <button className="ghost" onClick={() => go("contact")}>Me contacter</button>
              </div>
            </div>
            <div className="portrait-wrap">
              <div className="portrait-frame">
                <img src="https://images.unsplash.com/photo-1760800185627-12eb152aaca4?crop=faces&fit=crop&w=900&h=1100&q=85" alt="Portrait créatif d’un développeur sous des lumières bleues et rouges" />
                <div className="scanline" />
              </div>
              <span className="corner top" /><span className="corner bottom" />
              <div className="xp"><strong>07+</strong><span>années à construire<br />le numérique</span></div>
              <div className="coordinates">48.8566° N — 2.3522° E</div>
            </div>
          </div>
          <button className="scroll" onClick={() => go("about")}><i /> SCROLL TO EXPLORE</button>
        </section>

        <section id="about" className="about section-pad">
          <div className="section-tag">01 / À PROPOS</div>
          <div className="about-grid">
            <h2>ESPRIT CRÉATIF,<br /><em>CODE PRÉCIS.</em></h2>
            <div className="manifesto">
              <p>Je transforme des problématiques complexes en produits évidents. Pas seulement des interfaces qui fonctionnent — des expériences qui <b>restent en mémoire.</b></p>
              <p>De la stratégie au dernier commit, je réunis produit, design et architecture pour livrer vite, proprement et avec intention.</p>
              <button className="text-link" onClick={() => go("skills")}>Découvrir mon approche <Icon name="arrow" /></button>
            </div>
            <div className="metrics">
              <article><strong>42</strong><span>produits livrés</span></article>
              <article><strong>12</strong><span>pays touchés</span></article>
              <article><strong>98%</strong><span>clients satisfaits</span></article>
              <article><strong>∞</strong><span>curiosité</span></article>
            </div>
          </div>
        </section>

        <section id="work" className="work section-pad">
          <div className="section-head">
            <div><div className="section-tag">02 / PROJETS SÉLECTIONNÉS</div><h2>DU CODE QUI<br /><em>PREND POSITION.</em></h2></div>
            <p>Une sélection de produits où performance, narration et utilité avancent ensemble.</p>
          </div>
          <div className="project-list">
            {projects.map((item) => (
              <button className={`project ${item.className}`} key={item.no} onClick={() => setProject(item)}>
                <span className="project-no">{item.no}</span>
                <div className="project-art"><i /><b /><span>{item.title.slice(0, 1)}</span></div>
                <div className="project-copy"><small>{item.type}</small><h3>{item.title}</h3><p>{item.text}</p><b>{item.stack}</b></div>
                <span className="round-arrow"><Icon name="arrow" /></span>
              </button>
            ))}
          </div>
        </section>

        <section id="skills" className="skills section-pad">
          <div className="section-tag">03 / EXPERTISE</div>
          <div className="skills-intro"><h2>TOUTE LA STACK.<br /><em>UNE SEULE VISION.</em></h2><p>Je choisis les outils selon le problème, jamais l’inverse. Mon terrain de jeu va du pixel à l’infrastructure.</p></div>
          <div className="orbit">
            <div className="orbit-core"><span>FULL</span><strong>STACK</strong><small>DEVELOPER</small></div>
            {[
              ["01", "FRONTEND", "React · Next.js · TypeScript · Three.js"],
              ["02", "BACKEND", "Node.js · Python · API · Microservices"],
              ["03", "DATA & CLOUD", "PostgreSQL · Redis · AWS · Docker"],
              ["04", "PRODUCT", "UX · Design system · Performance · SEO"],
            ].map(([no, title, text]) => <article key={no}><span>{no}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section id="contact" className="contact section-pad">
          <div className="terminal">
            <div className="terminal-bar"><span /><span /><span /><small>contact.sh</small></div>
            <p><b>$</b> initiate_collaboration --with="noah"</p>
            <p className="success">✓ Profil chargé. Connexion possible.</p>
          </div>
          <div className="contact-copy">
            <div className="section-tag">04 / CONTACT</div>
            <h2>CONSTRUISONS<br />QUELQUE CHOSE<br /><em>D’INATTENDU.</em></h2>
            <a className="big-mail" href="mailto:hello@noah.dev">hello@noah.dev <Icon name="arrow" /></a>
          </div>
          <footer><span>© 2026 NOAH DUPONT</span><span>DESIGNÉ ET CODÉ AVEC INTENTION</span><button onClick={() => go("home")}>RETOUR EN HAUT ↑</button></footer>
        </section>
      </main>

      {project && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={project.title}>
          <button className="modal-close" onClick={() => setProject(null)}><Icon name="close" /></button>
          <div className={`modal-art ${project.className}`}><span>{project.title.slice(0, 1)}</span></div>
          <div className="modal-copy"><small>CASE STUDY — {project.no}</small><h2>{project.title}</h2><p>{project.text} Une architecture pensée pour évoluer, une direction artistique conçue pour différencier.</p><div><span>RÔLE<br /><b>Lead fullstack</b></span><span>STACK<br /><b>{project.stack}</b></span></div><button className="primary" onClick={() => setProject(null)}>Fermer l’étude <Icon name="close" /></button></div>
        </div>
      )}
    </div>
  )
}

export default App
