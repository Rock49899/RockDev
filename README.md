# Portfolio — Rock Rodrigue Houinsou

Portfolio Next.js (App Router, Cache Components) dont tout le contenu s'édite depuis un espace admin, sans toucher au code. Il existe en deux versions :

| Route | Pour qui | Contenu |
| --- | --- | --- |
| `/` | Clients, missions freelance | Développeur full-stack : projets, stack, qualités. Aucune mention du parcours d'économiste. |
| `/amoa` | Candidatures (MIAGE, AMOA, Business Analyst) | Économiste et développeur : parcours complet. Non indexée par les moteurs de recherche. |

Un point quasi invisible dans le pied de page de `/` mène à `/amoa`. Chaque projet a sa page détail (`/projets/<adresse>`, `/amoa/projets/<adresse>`) avec galerie animée, points clés et liens (projet en ligne, GitHub).

## Mise en route

1. **Supabase** : crée un projet, ouvre *SQL Editor*, colle `supabase/schema.sql` (en changeant l'e-mail admin sur la première ligne utile) et exécute-le.
2. **Compte admin** : *Authentication → Users → Add user* avec ce même e-mail, puis *Sign In / Providers* : désactive « Allow new users to sign up ».
3. **Variables d'environnement** : copie `.env.example` vers `.env.local` et renseigne l'URL et la clé publique (*Project Settings → API*).
4. Lance `npm run dev`, ouvre `/admin`, connecte-toi et clique sur **Initialiser le contenu** (une seule fois : il charge le contenu tiré du CV).

Tant que Supabase n'est pas configuré, le site s'affiche avec le contenu de départ de `lib/seed.ts`.

## Ce qui s'édite dans `/admin`

- **Général** : nom, photo, e-mail, liens LinkedIn/GitHub et **thème de couleurs** (Neon, Ember, Bio ou Signal), communs aux deux versions. Les visiteurs ne peuvent pas changer le thème : il se règle uniquement ici.
- **Version développeur / Version AMOA** : tous les textes de la page, le CV (PDF), les chiffres clés, l'expertise et les qualités humaines.
- **Projets** : titre, adresse de la page, technologies, rôle, description, points clés, galerie d'images (la première sert de couverture), liens, et la ou les versions où le projet apparaît.
- **Parcours** : expériences et formations, avec la version où chacune s'affiche.

Chaque enregistrement invalide le cache : le site public est mis à jour immédiatement.

## Architecture

- `lib/content.ts` : lecture publique du contenu (`use cache` + tag `portfolio`), invalidée par les Server Actions de l'admin.
- `lib/view.ts` : filtre le contenu pour une version (`dev` ou `amoa`).
- `lib/seed.ts` : contenu de départ, repli sans base, source du bouton « Initialiser ».
- `components/portfolio/` : `Shell` (barre latérale, thèmes), `Sections` (accueil), `Carousel`, `ProjectPage`.
- `app/(site)/` : le site public, avec sa feuille de style `portfolio.css` (4 thèmes : Neon, Ember, Bio, Signal).
- `app/(admin)/admin/` : l'admin. Protection en trois couches : `proxy.ts` (redirection), `requireAdmin()` dans chaque page et action, et RLS Supabase (seul l'e-mail admin peut écrire).
- Les images et le CV partent **directement du navigateur vers Supabase Storage** (bucket `portfolio-media`, 8 Mo max par fichier).

## Commandes

```bash
npm run dev     # développement
npm run build   # build de production
npm run lint    # ESLint
```
