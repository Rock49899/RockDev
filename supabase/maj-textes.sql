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
