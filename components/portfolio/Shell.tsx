"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { Settings, Variant, VariantProfile } from "@/lib/types";
import { Icon, type IconName } from "./Icon";

export type NavItem = { id: string; label: string; icon: IconName };

type Props = {
  settings: Settings;
  profile: Pick<VariantProfile, "cv_url">;
  variant: Variant;
  /** `home` : défilement sur la page ; `detail` : retour vers les sections de l'accueil. */
  mode: "home" | "detail";
  nav: NavItem[];
  children: ReactNode;
};

/** Barre latérale et menu mobile : communs à l'accueil et aux pages projet. */
export default function Shell({ settings, profile, variant, mode, nav, children }: Props) {
  const router = useRouter();
  const base = variant === "amoa" ? "/amoa" : "";
  const [active, setActive] = useState("home");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (mode !== "home") return;
    const onScroll = () => {
      const sections = nav
        .map(({ id }) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];
      const current = [...sections].reverse().find((s) => s.getBoundingClientRect().top <= 180);
      if (current) setActive(current.id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode, nav]);

  const go = (id: string) => {
    setMenu(false);
    if (mode === "home") document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    else router.push(`${base || "/"}${id === "home" ? "" : `#${id}`}`);
  };

  return (
    <div className="portfolio">
      <aside className={menu ? "sidebar open" : "sidebar"}>
        <button className="logo" onClick={() => go("home")} aria-label="Accueil">
          {settings.logo_text}
          <span>.</span>
        </button>
        <nav aria-label="Navigation principale">
          {nav.map(({ id, label, icon }) => (
            <button
              key={id}
              className={mode === "home" && active === id ? "active" : ""}
              aria-current={mode === "home" && active === id ? "true" : undefined}
              onClick={() => go(id)}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <a
          className="cv"
          href={profile.cv_url || `mailto:${settings.email}?subject=Demande de CV`}
          {...(profile.cv_url ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <Icon name="download" /> Télécharger CV
        </a>
        <div className="socials">
          {settings.github_url && (
            <a href={settings.github_url} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <Icon name="github" />
            </a>
          )}
          {settings.linkedin_url && (
            <a href={settings.linkedin_url} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <Icon name="linkedin" />
            </a>
          )}
        </div>
      </aside>

      <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}>
        <Icon name={menu ? "close" : "menu"} />
      </button>

      <main>{children}</main>
    </div>
  );
}
