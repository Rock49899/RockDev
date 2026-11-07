-- Met à jour le contenu des projets (textes, stack, rôle, liens) sans toucher aux images ni à la publication.
-- À exécuter une fois dans Supabase > SQL Editor. Sans risque si on le relance.

-- L'ancien projet « Budget communal » devient Topo.
update public.projects set slug = 'topo' where slug = 'budget-communal' and not exists (select 1 from public.projects where slug = 'topo');

insert into public.projects (slug, kind, title, type, stack, description, highlights, role, year, link_url, sort, published, show_dev, show_amoa)
values
  ($txt$topo$txt$, $txt$application$txt$, $txt$TOPO$txt$, $txt$BUDGET COMMUNAL / GOUVERNANCE$txt$, $txt$Laravel · PostgreSQL$txt$, $txt$Dans une mairie, comparer ce qui était prévu et ce qui a vraiment été dépensé veut dire ouvrir plusieurs tableurs et les rapprocher à la main. Topo remplace ce travail : pour chaque commune et chaque trimestre, il suit ce qui est voté, engagé, mandaté, payé, titré et recouvré, puis calcule le taux d'exécution, la part des recettes propres et du FADeC, et l'autofinancement.

Avant d'écrire une ligne de code, j'ai rédigé l'expression du besoin, les règles de gestion et le modèle de données. C'est de cette étape que viennent deux règles dont je suis fier : le taux officiel et le taux réel (sans les reports ni les opérations d'ordre) sont calculés séparément, parce qu'un taux flatteur peut cacher un budget mal exécuté ; et un import est refusé si la somme des chapitres ne correspond pas au total imprimé du compte administratif. Un chiffre faux n'entre pas dans la base.

L'administrateur règle lui-même les seuils d'alerte. Les droits sont définis par commune, et chaque modification est tracée dans un journal. Les montants sont en FCFA.$txt$, $txt$Taux d'exécution officiel et taux réel, calculés séparément
Import refusé si les chapitres ne recoupent pas le total du compte administratif
Seuils d'alerte réglés par l'administrateur
Droits définis par commune et journal des modifications$txt$, $txt$Projet personnel · V1 terminée$txt$, $txt$2026$txt$, $txt$https://topo-bj.online/$txt$, 1, true, true, true),
  ($txt$walab$txt$, $txt$application$txt$, $txt$WALAB$txt$, $txt$SANTÉ / PRÉLÈVEMENT À DOMICILE$txt$, $txt$Laravel · Reverb · Firebase$txt$, $txt$Imaginez : vous devez faire des analyses et vous n'avez pas le temps d'aller au laboratoire. Vous commandez sur WALAB, un agent vient chez vous, vous le voyez arriver sur la carte, puis vous suivez votre prélèvement jusqu'à la réception des résultats, en ligne et de façon sécurisée. Derrière, la plateforme répartit l'argent entre les laboratoires, les agents préleveurs et WALAB.

J'ai dirigé l'équipe de quatre développeurs. Je suis parti de la vision de l'entreprise pour écrire le cahier des charges, j'ai découpé le travail en tâches, tenu les points quotidiens, fait le suivi d'avancement avec le client, et organisé les tests avant chaque livraison. Côté technique, j'ai développé une partie du back-end et du front-end, et relu le travail des autres avant qu'il parte en production.

C'est le projet où j'ai appris à tenir ensemble un client, une équipe et une date de livraison. Il est en production pour de vrais utilisateurs.$txt$, $txt$Équipe de quatre développeurs dirigée, du cahier des charges à la livraison
Suivi de l'agent sur la carte et résultats en ligne sécurisés
Répartition des paiements entre laboratoires, agents préleveurs et WALAB
En production pour de vrais utilisateurs$txt$, $txt$Chef de projet et développeur · équipe de 4$txt$, $txt$Avr. – oct. 2026$txt$, $txt$$txt$, 2, true, true, true),
  ($txt$oscanm$txt$, $txt$application$txt$, $txt$OSCANM$txt$, $txt$RESTAURATION / QR CODE$txt$, $txt$Laravel · Vue.js · PostgreSQL$txt$, $txt$À la fin d'un service, un restaurateur veut savoir deux choses : combien il a encaissé, et ce qu'il lui reste à servir. OscanM répond aux deux.

Le client scanne le QR code de sa table et commande depuis son téléphone. Chaque commande porte son mode de paiement (espèces, carte, mobile) et son statut (en attente, payée, échouée, remboursée). Le back-office en tire le chiffre d'affaires du jour, le panier moyen et l'occupation des tables.

Les boissons et les cocktails sont suivis au millilitre près. À l'enregistrement d'une boisson, le manager définit la quantité en stock. Pour un cocktail, il définit sa recette : combien de ml de chaque spiritueux ou ingrédient, à partir de ce que le barman sait déjà. Chaque commande déduit alors la bonne quantité, et le manager voit ce qu'il reste au fil du service. Il enregistre aussi ses approvisionnements en matières premières, ce qui lui permet de savoir quand racheter, avant la rupture. Une alerte l'avertit à l'approche du seuil.

Pour la nourriture, j'ai choisi la simplicité. Les ingrédients d'un plat sont trop variables pour être chiffrés honnêtement. Le manager garde donc la main : si un plat n'est plus disponible, il le désactive depuis son tableau de bord, et le client ne peut plus le commander.

Le restaurateur gère aussi sa carte et son personnel. J'ai modélisé la facturation des abonnements des restaurants clients, en trois formules à prix différents. J'ai tout fait seul, du schéma de base de données à l'application.$txt$, $txt$Commande depuis le téléphone grâce au QR code de la table
Chiffre d'affaires du jour, panier moyen et occupation des tables
Boissons et cocktails suivis au millilitre, avec alerte avant rupture
Plat indisponible : le manager le désactive, le client ne peut plus le commander
Facturation des abonnements en trois formules$txt$, $txt$Développeur full-stack · réalisé seul, terminé$txt$, $txt$2026$txt$, $txt$https://oscanm.site/$txt$, 3, true, true, true),
  ($txt$splitpay$txt$, $txt$application$txt$, $txt$SPLITPAY$txt$, $txt$FINTECH / MOBILE MONEY$txt$, $txt$Laravel 12 · Vue 3 · MySQL · Docker$txt$, $txt$La règle qui structure le projet tient en une phrase : un paiement n'est validé que si l'opérateur le confirme. Un lien de paiement envoyé à une famille ne prouve rien. La confirmation de MTN ou de Moov, reçue via l'API PayPlus, fait foi.

La plateforme est multi-écoles et multi-sites, avec des rôles pour la direction, le gestionnaire et le comptable. L'année se clôture en faisant passer les étudiants au niveau suivant.

J'ai fait toute la chaîne : analyse du besoin, spécifications, modèle Merise, développement, puis un plan de tests.$txt$, $txt$Import de la liste des étudiants depuis un fichier au format prédéfini
Scolarité découpée en tranches, liens de paiement envoyés aux familles
Montant encaissé, reste à encaisser et taux de recouvrement, par mois et par site$txt$, $txt$Projet personnel · terminé$txt$, $txt$2026$txt$, $txt$$txt$, 4, true, true, true)
on conflict (slug) do update set
  title = excluded.title, type = excluded.type, stack = excluded.stack,
  description = excluded.description, highlights = excluded.highlights,
  role = excluded.role, year = excluded.year, sort = excluded.sort,
  link_url = case when excluded.link_url <> '' then excluded.link_url else public.projects.link_url end;
