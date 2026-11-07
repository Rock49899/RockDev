import type { Experience, Metric, Project, SiteData, SkillGroup, SoftSkill } from "./types";

/**
 * Contenu initial, tiré du CV. Il sert de repli tant que Supabase n'est pas
 * configuré, et c'est lui que l'admin envoie dans la base au premier lancement
 * (bouton « Initialiser le contenu »). Une fois la base remplie, elle fait foi.
 */

const metrics: Omit<Metric, "id">[] = [
  { variant: "dev", value: "4", label: "projets full-stack", sort: 1 },
  { variant: "dev", value: "3", label: "frameworks au quotidien", sort: 2 },
  { variant: "dev", value: "1", label: "projet piloté de bout en bout", sort: 3 },
  { variant: "dev", value: "∞", label: "curiosité", sort: 4 },
  { variant: "amoa", value: "4", label: "projets full-stack", sort: 1 },
  { variant: "amoa", value: "6+", label: "années d'expérience", sort: 2 },
  { variant: "amoa", value: "2", label: "métiers : économie et code", sort: 3 },
  { variant: "amoa", value: "∞", label: "curiosité", sort: 4 },
];

const skills: Omit<SkillGroup, "id">[] = [
  { variant: "dev", title: "FRONTEND", items: "React · Vue.js · TypeScript · JavaScript (ES6+) · Tailwind CSS · HTML5 · CSS3", sort: 1 },
  { variant: "dev", title: "BACKEND", items: "Laravel · PHP · Node.js · NestJS · API REST · Architecture MVC", sort: 2 },
  { variant: "dev", title: "DONNÉES", items: "MySQL · PostgreSQL · SQLite · MongoDB · SQL", sort: 3 },
  { variant: "dev", title: "FUNNELS & LANDING PAGES", items: "systeme.io · Funnels de vente · Landing pages", sort: 4 },
  { variant: "dev", title: "AUTOMATISATION", items: "Make · Scénarios d'automatisation · API REST", sort: 5 },
  { variant: "dev", title: "OUTILS & MÉTHODES", items: "Git · GitHub · GitLab · Docker · Agile / Scrum · Gestion de projet", sort: 6 },
  { variant: "amoa", title: "ANALYSE & PILOTAGE", items: "Analyse de données · Suivi-évaluation · Conception d'indicateurs · Rédaction de rapports · Planification stratégique", sort: 1 },
  { variant: "amoa", title: "FINANCE & CRÉDIT", items: "Gestion financière · Analyse de dossiers de crédit · Économie monétaire et bancaire · Comptabilité", sort: 2 },
  { variant: "amoa", title: "DONNÉES & OUTILS", items: "SQL · PostgreSQL · MySQL · Excel · SPSS · Git", sort: 3 },
  { variant: "amoa", title: "AUTOMATISATION", items: "Make · Automatisation de processus · API REST", sort: 4 },
  { variant: "amoa", title: "DÉVELOPPEMENT", items: "Laravel · PHP · Vue.js · React · Agile / Scrum", sort: 5 },
];

const softSkills: Omit<SoftSkill, "id">[] = [
  { variant: "dev", title: "Pilotage de projet", text: "Cadrage du besoin, coordination de l'équipe et suivi de la livraison sur la plateforme WALAB.", sort: 1 },
  { variant: "dev", title: "Esprit d'analyse", text: "Je décompose un besoin métier complexe en fonctionnalités claires avant d'écrire la première ligne.", sort: 2 },
  { variant: "dev", title: "Méthode agile", text: "Travail par itérations (Agile / Scrum), avec des livrables réguliers et visibles.", sort: 3 },
  { variant: "dev", title: "Communication", text: "Rédaction de rapports et de documents clairs, lisibles par les équipes comme par les non-techniques.", sort: 4 },
  { variant: "dev", title: "Autonomie", text: "Formation continue : React Native, modélisation de bases de données, SQL, HTML5 · CSS3.", sort: 5 },
  { variant: "amoa", title: "Rigueur analytique", text: "Analyse de données, suivi-évaluation et conception d'indicateurs économiques.", sort: 1 },
  { variant: "amoa", title: "Rédaction", text: "Rapports, propositions stratégiques et documents de cadrage structurés.", sort: 2 },
  { variant: "amoa", title: "Pilotage de projet", text: "Cadrage du besoin, coordination de l'équipe et suivi de la livraison sur WALAB.", sort: 3 },
  { variant: "amoa", title: "Compréhension métier", text: "Gestion du crédit, analyse de dossiers et finances publiques locales.", sort: 4 },
  { variant: "amoa", title: "Pont métier / technique", text: "Je traduis un besoin métier en spécifications que les développeurs peuvent construire.", sort: 5 },
];

const projects: Omit<Project, "id">[] = [
  {
    kind: "application",
    year: "2026",
    images: [],
    repo_url: "",
    published: true,
    show_dev: true,
    show_amoa: true,
    slug: "topo",
    title: "TOPO",
    type: "BUDGET COMMUNAL / GOUVERNANCE",
    stack: "Laravel · PostgreSQL",
    role: "Projet personnel · V1 terminée",
    link_url: "https://topo-bj.online/",
    sort: 1,
    description: "Dans une mairie, comparer ce qui était prévu et ce qui a vraiment été dépensé veut dire ouvrir plusieurs tableurs et les rapprocher à la main. Topo remplace ce travail : pour chaque commune et chaque trimestre, il suit ce qui est voté, engagé, mandaté, payé, titré et recouvré, puis calcule le taux d'exécution, la part des recettes propres et du FADeC, et l'autofinancement.\n\nAvant d'écrire une ligne de code, j'ai rédigé l'expression du besoin, les règles de gestion et le modèle de données. C'est de cette étape que viennent deux règles dont je suis fier : le taux officiel et le taux réel (sans les reports ni les opérations d'ordre) sont calculés séparément, parce qu'un taux flatteur peut cacher un budget mal exécuté ; et un import est refusé si la somme des chapitres ne correspond pas au total imprimé du compte administratif. Un chiffre faux n'entre pas dans la base.\n\nL'administrateur règle lui-même les seuils d'alerte. Les droits sont définis par commune, et chaque modification est tracée dans un journal. Les montants sont en FCFA.",
    highlights: "Taux d'exécution officiel et taux réel, calculés séparément\nImport refusé si les chapitres ne recoupent pas le total du compte administratif\nSeuils d'alerte réglés par l'administrateur\nDroits définis par commune et journal des modifications",
  },
  {
    kind: "application",
    year: "Avr. – oct. 2026",
    images: [],
    repo_url: "",
    published: true,
    show_dev: true,
    show_amoa: true,
    slug: "walab",
    title: "WALAB",
    type: "SANTÉ / PRÉLÈVEMENT À DOMICILE",
    stack: "Laravel · Reverb · Firebase",
    role: "Chef de projet et développeur · équipe de 4",
    link_url: "",
    sort: 2,
    description: "Imaginez : vous devez faire des analyses et vous n'avez pas le temps d'aller au laboratoire. Vous commandez sur WALAB, un agent vient chez vous, vous le voyez arriver sur la carte, puis vous suivez votre prélèvement jusqu'à la réception des résultats, en ligne et de façon sécurisée. Derrière, la plateforme répartit l'argent entre les laboratoires, les agents préleveurs et WALAB.\n\nJ'ai dirigé l'équipe de quatre développeurs. Je suis parti de la vision de l'entreprise pour écrire le cahier des charges, j'ai découpé le travail en tâches, tenu les points quotidiens, fait le suivi d'avancement avec le client, et organisé les tests avant chaque livraison. Côté technique, j'ai développé une partie du back-end et du front-end, et relu le travail des autres avant qu'il parte en production.\n\nC'est le projet où j'ai appris à tenir ensemble un client, une équipe et une date de livraison. Il est en production pour de vrais utilisateurs.",
    highlights: "Équipe de quatre développeurs dirigée, du cahier des charges à la livraison\nSuivi de l'agent sur la carte et résultats en ligne sécurisés\nRépartition des paiements entre laboratoires, agents préleveurs et WALAB\nEn production pour de vrais utilisateurs",
  },
  {
    kind: "application",
    year: "2026",
    images: [],
    repo_url: "",
    published: true,
    show_dev: true,
    show_amoa: true,
    slug: "oscanm",
    title: "OSCANM",
    type: "RESTAURATION / QR CODE",
    stack: "Laravel · Vue.js · PostgreSQL",
    role: "Développeur full-stack · réalisé seul, terminé",
    link_url: "https://oscanm.site/",
    sort: 3,
    description: "À la fin d'un service, un restaurateur veut savoir deux choses : combien il a encaissé, et ce qu'il lui reste à servir. OscanM répond aux deux.\n\nLe client scanne le QR code de sa table et commande depuis son téléphone. Chaque commande porte son mode de paiement (espèces, carte, mobile) et son statut (en attente, payée, échouée, remboursée). Le back-office en tire le chiffre d'affaires du jour, le panier moyen et l'occupation des tables.\n\nLes boissons et les cocktails sont suivis au millilitre près. À l'enregistrement d'une boisson, le manager définit la quantité en stock. Pour un cocktail, il définit sa recette : combien de ml de chaque spiritueux ou ingrédient, à partir de ce que le barman sait déjà. Chaque commande déduit alors la bonne quantité, et le manager voit ce qu'il reste au fil du service. Il enregistre aussi ses approvisionnements en matières premières, ce qui lui permet de savoir quand racheter, avant la rupture. Une alerte l'avertit à l'approche du seuil.\n\nPour la nourriture, j'ai choisi la simplicité. Les ingrédients d'un plat sont trop variables pour être chiffrés honnêtement. Le manager garde donc la main : si un plat n'est plus disponible, il le désactive depuis son tableau de bord, et le client ne peut plus le commander.\n\nLe restaurateur gère aussi sa carte et son personnel. J'ai modélisé la facturation des abonnements des restaurants clients, en trois formules à prix différents. J'ai tout fait seul, du schéma de base de données à l'application.",
    highlights: "Commande depuis le téléphone grâce au QR code de la table\nChiffre d'affaires du jour, panier moyen et occupation des tables\nBoissons et cocktails suivis au millilitre, avec alerte avant rupture\nPlat indisponible : le manager le désactive, le client ne peut plus le commander\nFacturation des abonnements en trois formules",
  },
  {
    kind: "application",
    year: "2026",
    images: [],
    repo_url: "",
    published: true,
    show_dev: true,
    show_amoa: true,
    slug: "splitpay",
    title: "SPLITPAY",
    type: "FINTECH / MOBILE MONEY",
    stack: "Laravel 12 · Vue 3 · MySQL · Docker",
    role: "Projet personnel · terminé",
    link_url: "",
    sort: 4,
    description: "La règle qui structure le projet tient en une phrase : un paiement n'est validé que si l'opérateur le confirme. Un lien de paiement envoyé à une famille ne prouve rien. La confirmation de MTN ou de Moov, reçue via l'API PayPlus, fait foi.\n\nLa plateforme est multi-écoles et multi-sites, avec des rôles pour la direction, le gestionnaire et le comptable. L'année se clôture en faisant passer les étudiants au niveau suivant.\n\nJ'ai fait toute la chaîne : analyse du besoin, spécifications, modèle Merise, développement, puis un plan de tests.",
    highlights: "Import de la liste des étudiants depuis un fichier au format prédéfini\nScolarité découpée en tranches, liens de paiement envoyés aux familles\nMontant encaissé, reste à encaisser et taux de recouvrement, par mois et par site",
  },
];

const experiences: Omit<Experience, "id">[] = [
  { kind: "experience", period: "Avr. 2026 — Sept. 2026", title: "Développeur full-stack et chef de projet", org: "WALAB, plateforme de service de laboratoire à domicile", description: "Cadrage du besoin, coordination de l'équipe et suivi de la livraison. Développement de la plateforme (Laravel, React, MySQL).", show_dev: true, show_amoa: true, sort: 1 },
  { kind: "experience", period: "Janv. 2026 — Avr. 2026", title: "Stage : développeur full-stack", org: "La Pieuvre Technologique", description: "Développement full-stack d'applications web (Laravel, Vue.js, MySQL).", show_dev: true, show_amoa: true, sort: 2 },
  { kind: "experience", period: "Janv. 2023 — Août 2024", title: "Responsable analyste suivi-évaluation", org: "Cabinet Smart Solutions Bénin", description: "Conception et mise en œuvre de systèmes de suivi-évaluation. Analyse de données, rédaction de rapports, conception d'indicateurs économiques et planification stratégique.", show_dev: false, show_amoa: true, sort: 3 },
  { kind: "experience", period: "Févr. 2021 — Avr. 2022", title: "Assistant suivi des opérations de crédit", org: "Kotchami Okoumansou", description: "Élaboration de plans de gestion des crédits, collecte des fonds, analyse des dossiers de crédit.", show_dev: false, show_amoa: true, sort: 4 },
  { kind: "experience", period: "Janv. — Sept. 2020", title: "Stage : recherche, études et analyse statistique et économique", org: "Cabinet Smart Solutions Bénin", description: "Contribution à des études économiques et analyses statistiques, préparation de rapports et de propositions stratégiques, collecte et dépouillement de données.", show_dev: false, show_amoa: true, sort: 5 },
  { kind: "experience", period: "Sept. — Nov. 2019", title: "Stage académique, service de planification", org: "Mairie de Glazoué", description: "Collecte de données pour l'élaboration des plans de développement communaux.", show_dev: false, show_amoa: true, sort: 6 },
  { kind: "formation", period: "2025", title: "Certification en développement full-stack", org: "Epitech Coding Academy, Cotonou", description: "", show_dev: true, show_amoa: true, sort: 7 },
  { kind: "formation", period: "2016 — 2020", title: "Licence en économie et finance des collectivités locales", org: "Université de Parakou (FASEG)", description: "Comptabilité générale et publique locale, gestion financière des collectivités, économie monétaire et bancaire, planification locale, statistiques, recherche opérationnelle, informatique appliquée.", show_dev: false, show_amoa: true, sort: 8 },
  { kind: "formation", period: "2023 — 2024", title: "Développement d'applications mobiles avec React Native", org: "Blemama", description: "", show_dev: true, show_amoa: false, sort: 9 },
  { kind: "formation", period: "2024", title: "Création de site web avec HTML5 et CSS3", org: "OpenClassrooms", description: "", show_dev: true, show_amoa: false, sort: 10 },
  { kind: "formation", period: "Certifications", title: "Gestion de projet agile · Modélisation d'une base de données · Interrogation d'une base avec SQL", org: "", description: "", show_dev: true, show_amoa: true, sort: 11 },
];

/** Les lignes à insérer en base (sans identifiants : Supabase les génère). */
export const seedRows = { metrics, skills, softSkills, projects, experiences };

const withIds = <T extends object>(prefix: string, rows: T[]) =>
  rows.map((row, i) => ({ id: `${prefix}${i + 1}`, ...row }));

export const seed: SiteData = {
  settings: {
    first_name: "ROCK",
    last_name: "HOUINSOU.",
    logo_text: "RH",
    email: "houinsourodrigue72@gmail.com",
    linkedin_url: "https://linkedin.com/in/rock-dev-fullstack",
    github_url: "",
    location_text: "GODOMEY, ABOMEY-CALAVI — BÉNIN",
    portrait_url: "",
    copyright: "© 2026 ROCK RODRIGUE HOUINSOU",
    footer_note: "DESIGNÉ ET CODÉ PAR ROCKVIRTUOSO",
    default_theme: "mono", // Signal : rouge · ivoire
  },
  profiles: {
    dev: {
      kicker: "DÉVELOPPEUR FULL-STACK · FUNNEL BUILDER",
      intro:
        "Je conçois, développe et livre des **plateformes web sur mesure** et des **funnels de vente**, du cadrage à la mise en ligne : Laravel, React, Vue.js, systeme.io et Make.",
      available: true,
      availability_text: "Disponible pour de nouvelles missions",
      experience_value: "4",
      experience_text: "projets full-stack\nà mon actif",
      hero_stack: "Laravel · React · Vue.js · TypeScript · PostgreSQL · systeme.io · Make",
      about_title: "DU BESOIN",
      about_accent: "AU PRODUIT LIVRÉ.",
      about_p1:
        "Développeur full-stack, je construis des **applications web de gestion** : paiement, commandes, stocks, suivi budgétaire. Laravel et Node.js côté serveur, Vue.js et React côté interface.",
      about_p2:
        "J'ai piloté de bout en bout la plateforme WALAB : cadrage du besoin, coordination de l'équipe, développement et suivi de la livraison. Je livre un **code structuré (MVC, API REST)** et je tiens mes clients informés de l'avancement.",
      about_cta: "Voir ma stack",
      work_title: "DES PLATEFORMES",
      work_accent: "CONÇUES POUR SERVIR.",
      work_text:
        "Paiement, commandes, stocks, budget : des plateformes web complètes, de la base de données à l'interface.",
      funnels_title: "FUNNELS &",
      funnels_accent: "LANDING PAGES.",
      funnels_text:
        "Des pages et des tunnels de vente construits pour guider le visiteur jusqu'à l'action, avec systeme.io et des automatisations Make.",
      skills_title: "DU SERVEUR",
      skills_accent: "À L'INTERFACE.",
      skills_text:
        "Je choisis les outils selon le besoin du projet, jamais l'inverse : back-end, front-end, données et méthodes.",
      core_top: "FULL",
      core_main: "STACK",
      core_sub: "DEVELOPER",
      soft_title: "AU-DELÀ",
      soft_accent: "DU CODE.",
      journey_title: "PARCOURS",
      journey_accent: "DE DÉVELOPPEUR.",
      journey_text: "Mes expériences et formations en développement.",
      contact_title: "UN PROJET\nEN TÊTE ?",
      contact_accent: "PARLONS-EN.",
      cv_url: "",
    },
    amoa: {
      kicker: "ÉCONOMISTE · DÉVELOPPEUR FULL-STACK",
      intro:
        "Économiste de formation et développeur full-stack, je conçois des **applications de gestion financière** qui rendent la donnée lisible et les décisions plus sûres.",
      available: true,
      availability_text: "Ouvert aux opportunités AMOA & Business Analysis",
      experience_value: "6+",
      experience_text: "années entre finance,\nanalyse et code",
      hero_stack: "Analyse de données · SQL · Modélisation · Gestion de projet · Agile",
      about_title: "ANALYSER,",
      about_accent: "PUIS CONSTRUIRE.",
      about_p1:
        "Économiste de formation, j'ai commencé par le suivi-évaluation, l'analyse de données et la conception d'indicateurs. Aujourd'hui, je **traduis ces besoins métier en applications web** : gestion financière, paiement, commandes et stocks.",
      about_p2:
        "Chef de projet et développeur full-stack sur la plateforme WALAB, je pilote de bout en bout, du cadrage à la livraison. Je prépare une licence MIAGE pour devenir **consultant AMOA** dans la banque et la fintech.",
      about_cta: "Découvrir mon approche",
      work_title: "DES OUTILS QUI",
      work_accent: "SERVENT LE MÉTIER.",
      work_text:
        "Une sélection de plateformes où gestion financière, rigueur d'analyse et expérience utilisateur avancent ensemble.",
      funnels_title: "FUNNELS &",
      funnels_accent: "LANDING PAGES.",
      funnels_text: "Des pages et des tunnels construits avec systeme.io et des automatisations Make.",
      skills_title: "DE L'ANALYSE",
      skills_accent: "AU CODE.",
      skills_text:
        "Je choisis les outils selon le besoin métier, jamais l'inverse. Du cadrage fonctionnel à la base de données.",
      core_top: "FINANCE",
      core_main: "TECH",
      core_sub: "ANALYSE & CODE",
      soft_title: "SAVOIR-ÊTRE",
      soft_accent: "ET MÉTHODE.",
      journey_title: "ÉCONOMISTE",
      journey_accent: "ET DÉVELOPPEUR.",
      journey_text: "De l'économie et du suivi-évaluation au développement full-stack.",
      contact_title: "CONSTRUISONS\nQUELQUE CHOSE",
      contact_accent: "D'UTILE.",
      cv_url: "",
    },
  },
  metrics: withIds("m", metrics),
  skills: withIds("s", skills),
  softSkills: withIds("q", softSkills),
  projects: withIds("p", projects),
  experiences: withIds("e", experiences),
};
