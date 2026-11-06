"use client";

import { useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { MEDIA_BUCKET } from "@/lib/supabase/env";

type Props = {
  /** Nom du champ envoyé au formulaire : une valeur cachée par fichier. */
  name: string;
  label: string;
  folder: string;
  initial: string[];
  multiple?: boolean;
  kind?: "image" | "pdf";
  hint?: string;
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Envoie les fichiers directement du navigateur vers Supabase Storage (session de l'admin,
 * règles RLS du bucket) : aucune limite de taille côté serveur Next.js. Le formulaire ne
 * reçoit que les URLs publiques, dans l'ordre affiché (la première = couverture).
 */
export function MediaInput({ name, label, folder, initial, multiple = false, kind = "image", hint }: Props) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const accepted = kind === "pdf" ? ["application/pdf"] : IMAGE_TYPES;

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    try {
      const supabase = createBrowserSupabase();
      const added: string[] = [];
      for (const file of Array.from(files)) {
        if (!accepted.includes(file.type)) throw new Error(`Format non accepté : ${file.name}`);
        if (file.size > MAX_BYTES) throw new Error(`${file.name} dépasse 8 Mo.`);
        const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "fichier";
        const path = `${folder}/${crypto.randomUUID()}-${safe}`;
        const { error: uploadError } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
        if (uploadError) throw new Error(uploadError.message);
        added.push(supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl);
      }
      setUrls((current) => (multiple ? [...current, ...added] : added));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const move = (from: number, to: number) =>
    setUrls((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });

  return (
    <div className="field media">
      <span className="label">{label}</span>
      {urls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}
      {!multiple && urls.length === 0 && <input type="hidden" name={name} value="" />}

      {urls.length > 0 && (
        <ul className="media-list">
          {urls.map((url, index) => (
            <li key={url}>
              {kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element -- aperçu admin, sans optimisation
                <img src={url} alt={`${label} ${index + 1}`} className="thumb" />
              ) : (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Fichier actuel (PDF)
                </a>
              )}
              {multiple && index === 0 && <em className="cover">Couverture</em>}
              <div className="media-actions">
                {multiple && (
                  <>
                    <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label="Déplacer avant">
                      ←
                    </button>
                    <button type="button" onClick={() => move(index, index + 1)} disabled={index === urls.length - 1} aria-label="Déplacer après">
                      →
                    </button>
                  </>
                )}
                <button type="button" onClick={() => setUrls(urls.filter((u) => u !== url))}>
                  Retirer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={input}
        type="file"
        accept={accepted.join(",")}
        multiple={multiple}
        disabled={busy}
        onChange={(event) => onFiles(event.target.files)}
        aria-label={`Ajouter : ${label}`}
      />
      {busy && <small>Envoi en cours…</small>}
      {error && (
        <small role="alert" className="msg err">
          {error}
        </small>
      )}
      {hint && <small>{hint}</small>}
    </div>
  );
}
