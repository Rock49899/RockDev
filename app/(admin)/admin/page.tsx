import { Suspense } from "react";
import { SETTINGS_GROUPS } from "@/lib/profile-fields";
import AdminFrame from "./AdminFrame";
import { AdminForm } from "./AdminForm";
import { FieldGroups } from "./AdminUI";
import { MediaInput } from "./MediaInput";
import { saveSettings } from "./actions";
import { SITE_FALLBACK } from "./fallback";

export default function AdminPage() {
  return (
    <Suspense fallback={SITE_FALLBACK}>
      <AdminFrame
        active="/admin"
        title="Général"
        lead="Réglages communs aux deux versions du site : identité, photo, contact, réseaux et thème."
        render={(data) => (
          <AdminForm action={saveSettings} className="stack">
            <div className="card">
              <MediaInput
                name="portrait_url"
                label="Photo de profil"
                folder="portrait"
                initial={data.settings.portrait_url ? [data.settings.portrait_url] : []}
                hint="Format portrait conseillé (ex. 900 × 1100 px), 8 Mo max."
              />
            </div>
            <FieldGroups groups={SETTINGS_GROUPS} values={data.settings} />
          </AdminForm>
        )}
      />
    </Suspense>
  );
}
