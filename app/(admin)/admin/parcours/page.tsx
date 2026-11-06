import { Suspense } from "react";
import AdminFrame from "../AdminFrame";
import { RowsForm } from "../AdminUI";
import { SITE_FALLBACK } from "../fallback";

export default function JourneyAdminPage() {
  return (
    <Suspense fallback={SITE_FALLBACK}>
      <AdminFrame
        active="/admin/parcours"
        title="Parcours"
        lead="Expériences et formations. Coche la ou les versions où chaque ligne doit apparaître : par exemple, les postes d'analyste uniquement dans la version AMOA."
        render={(data) => <RowsForm table="experiences" rows={data.experiences} blank={2} />}
      />
    </Suspense>
  );
}
