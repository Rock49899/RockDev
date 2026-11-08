-- Retire les redites sur WALAB et le rôle de chef de projet : le récit complet reste dans la fiche du projet.
-- À exécuter une fois dans Supabase > SQL Editor. Sans risque si on le relance.

delete from public.soft_skills where title = 'Pilotage de projet';

update public.metrics
  set value = '4', label = 'bases de données maîtrisées'
  where variant = 'dev' and label = 'projet piloté de bout en bout';

update public.experiences set description = '' where org like 'WALAB%';

update public.profile
  set about_p2 = $t$Je livre un **code structuré (MVC, API REST)** et je reste en contact avec mes clients tout au long du projet.$t$
  where variant = 'dev';

update public.profile
  set about_p2 = $t$Je prépare une licence MIAGE pour devenir **consultant AMOA** dans la banque et la fintech.$t$
  where variant = 'amoa';

update public.projects
  set highlights = $t$Suivi de l'agent sur la carte et résultats en ligne sécurisés
Répartition des paiements entre laboratoires, agents préleveurs et WALAB
En production pour de vrais utilisateurs$t$
  where slug = 'walab';

-- Titres de contact : le retour à la ligne avait été perdu à l'enregistrement.
update public.profile set contact_title = $t$UN PROJET
EN TÊTE ?$t$ where variant = 'dev';
update public.profile set contact_title = $t$CONSTRUISONS
QUELQUE CHOSE$t$ where variant = 'amoa';

-- Chiffres déjà présents dans le badge de la photo.
delete from public.metrics where variant = 'dev' and label = 'projets full-stack';
delete from public.metrics where variant = 'amoa' and label = $t$années d'expérience$t$;

-- Textes sans liste de technologies ni répétition (elles sont dans Expertise).
update public.profile set
  intro = $t$Je conçois, développe et livre des **plateformes web sur mesure** et des **funnels de vente**, du cadrage à la mise en ligne.$t$,
  about_p1 = $t$Je construis des **applications web de gestion** : paiement, commandes, stocks, suivi budgétaire.$t$,
  work_text = $t$Des plateformes complètes, de la base de données à l'interface.$t$,
  funnels_text = $t$Des pages et des tunnels de vente construits pour guider le visiteur jusqu'à l'action.$t$,
  skills_text = $t$Je choisis les outils selon le besoin du projet, jamais l'inverse.$t$,
  journey_text = ''
  where variant = 'dev';

update public.profile set
  intro = $t$Je conçois des **applications de gestion financière** qui rendent la donnée lisible et les décisions plus sûres.$t$,
  about_p1 = $t$Économiste de formation, j'ai commencé par le suivi-évaluation, l'analyse de données et la conception d'indicateurs. Aujourd'hui, je **traduis ces besoins métier en applications web**.$t$,
  funnels_text = $t$Des pages et des tunnels de vente pour guider le visiteur jusqu'à l'action.$t$,
  skills_text = $t$Je choisis les outils selon le besoin métier, jamais l'inverse.$t$,
  journey_text = ''
  where variant = 'amoa';

update public.soft_skills
  set text = $t$Je me forme en continu et j'apprends vite les outils dont un projet a besoin.$t$
  where title = 'Autonomie';

update public.experiences
  set description = $t$Développement full-stack d'applications web.$t$
  where org = 'La Pieuvre Technologique';
