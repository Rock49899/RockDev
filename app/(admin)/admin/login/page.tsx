import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="shell narrow">
      <h1>Espace admin</h1>
      <p className="lead">Connecte-toi pour modifier le contenu du portfolio.</p>
      {isSupabaseConfigured ? (
        <LoginForm />
      ) : (
        <div className="card">
          <p>
            Supabase n&apos;est pas encore configuré. Copie <code>.env.example</code> vers{" "}
            <code>.env.local</code>, renseigne les deux clés, puis relance le serveur.
          </p>
        </div>
      )}
    </main>
  );
}
