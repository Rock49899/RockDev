import { getSiteData } from "@/lib/content";
import { selectVariant } from "@/lib/view";
import type { Variant } from "@/lib/types";
import Sections, { navFor } from "./Sections";
import Shell from "./Shell";

export default async function HomePage({ variant }: { variant: Variant }) {
  const view = selectVariant(await getSiteData(), variant);
  return (
    <Shell settings={view.settings} profile={view.profile} variant={variant} mode="home" nav={navFor(view)}>
      <Sections view={view} />
    </Shell>
  );
}
