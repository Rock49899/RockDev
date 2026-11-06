import type { Metadata } from "next";
import { getSiteData } from "@/lib/content";
import { body, display } from "@/lib/fonts";
import "./portfolio.css";

export async function generateMetadata(): Promise<Metadata> {
  const { settings, profiles } = await getSiteData();
  const name = `${settings.first_name} ${settings.last_name}`.replace(/\.$/, "");
  return {
    title: `${name} — ${profiles.dev.kicker}`,
    description: profiles.dev.intro.replaceAll("**", ""),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getSiteData();
  // Le thème est choisi dans l'admin (Général → Thème) et s'applique à tous les visiteurs.
  return (
    <html lang="fr" data-theme={settings.default_theme} className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
