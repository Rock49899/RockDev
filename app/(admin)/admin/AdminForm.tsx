"use client";

import { useActionState, type ReactNode } from "react";
import type { ActionState } from "./actions";

type Props = {
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  /** Bouton secondaire (ex. suppression), envoyé avec `intent=<valeur>`. */
  extraIntent?: { value: string; label: string; confirm?: string };
  className?: string;
};

export function AdminForm({ action, children, submitLabel = "Enregistrer", extraIntent, className }: Props) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className={className}>
      {children}
      <div className="bar">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : submitLabel}
        </button>
        {extraIntent && (
          <button
            className="btn danger"
            type="submit"
            name="intent"
            value={extraIntent.value}
            disabled={pending}
            onClick={(event) => {
              if (extraIntent.confirm && !window.confirm(extraIntent.confirm)) event.preventDefault();
            }}
          >
            {extraIntent.label}
          </button>
        )}
        {state && (
          <p role="status" className={state.ok ? "msg ok" : "msg err"}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
