"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="card login">
      <label>
        E-mail
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        Mot de passe
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
      {state && !state.ok && (
        <p role="alert" className="msg err">
          {state.message}
        </p>
      )}
    </form>
  );
}
