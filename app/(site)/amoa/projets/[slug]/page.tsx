import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectPage from "@/components/portfolio/ProjectPage";
import { getSiteData } from "@/lib/content";
import { selectVariant } from "@/lib/view";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const view = selectVariant(await getSiteData(), "amoa");
  return view.projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const view = selectVariant(await getSiteData(), "amoa");
  const project = view.projects.find((p) => p.slug === slug);
  if (!project) return {};
  const name = `${view.settings.first_name} ${view.settings.last_name}`.replace(/\.$/, "");
  return {
    title: `${project.title} — ${name}`,
    description: project.description,
    robots: { index: false, follow: false },
  };
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<p className="detail-loading">Chargement du projet…</p>}>
      <ProjectPage variant="amoa" params={params} />
    </Suspense>
  );
}
