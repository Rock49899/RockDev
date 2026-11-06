import type { Metadata } from "next";
import HomePage from "@/components/portfolio/HomePage";
import { getSiteData } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { settings, profiles } = await getSiteData();
  const name = `${settings.first_name} ${settings.last_name}`.replace(/\.$/, "");
  return {
    title: `${name} — ${profiles.amoa.kicker}`,
    description: profiles.amoa.intro.replaceAll("**", ""),
    // Version destinée aux dossiers de candidature : elle reste hors des moteurs de recherche.
    robots: { index: false, follow: false },
  };
}

export default function Page() {
  return <HomePage variant="amoa" />;
}
