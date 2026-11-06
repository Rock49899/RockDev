-- Portfolio : schéma Supabase.
-- À exécuter une fois dans Supabase > SQL Editor (relançable sans danger).
--
-- 1. Remplace l'e-mail ci-dessous par celui de ton compte admin (une seule occurrence).
-- 2. Crée ce compte dans Authentication > Users, puis désactive les inscriptions publiques
--    (Authentication > Sign In / Providers > "Allow new users to sign up" = off).
-- 3. Ouvre /admin : le bouton « Initialiser le contenu » remplit les tables à partir du CV.

create or replace function public.is_portfolio_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'houinsourodrigue72@gmail.com'
$$;

-- ───────────── Réglages communs aux deux versions (une seule ligne) ─────────────
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  first_name text, last_name text, logo_text text,
  email text, linkedin_url text, github_url text, location_text text,
  portrait_url text, copyright text, footer_note text,
  default_theme text default 'mono' check (default_theme in ('neon','ember','bio','mono')),
  updated_at timestamptz default now()
);

-- ───────────── Textes par version : 'dev' (racine) et 'amoa' (/amoa) ─────────────
create table if not exists public.profile (
  variant text primary key check (variant in ('dev','amoa')),
  kicker text, intro text, available boolean, availability_text text,
  experience_value text, experience_text text, hero_stack text,
  about_title text, about_accent text, about_p1 text, about_p2 text, about_cta text,
  work_title text, work_accent text, work_text text,
  funnels_title text, funnels_accent text, funnels_text text,
  skills_title text, skills_accent text, skills_text text,
  core_top text, core_main text, core_sub text,
  soft_title text, soft_accent text,
  journey_title text, journey_accent text, journey_text text,
  contact_title text, contact_accent text, cv_url text,
  updated_at timestamptz default now()
);

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  variant text not null check (variant in ('dev','amoa')),
  value text not null, label text not null, sort int not null default 0
);

create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  variant text not null check (variant in ('dev','amoa')),
  title text not null, items text default '', sort int not null default 0
);

create table if not exists public.soft_skills (
  id uuid primary key default gen_random_uuid(),
  variant text not null check (variant in ('dev','amoa')),
  title text not null, text text default '', sort int not null default 0
);

-- ───────────── Contenu partagé, avec visibilité par version ─────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  kind text not null default 'application' check (kind in ('application','funnel')),
  title text not null, type text default '', stack text default '',
  description text default '', highlights text default '',
  role text default '', year text default '',
  images text[] not null default '{}',
  link_url text default '', repo_url text default '',
  sort int not null default 0,
  published boolean not null default true,
  show_dev boolean not null default true,
  show_amoa boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('experience','formation')),
  period text default '', title text not null, org text default '', description text default '',
  show_dev boolean not null default true,
  show_amoa boolean not null default true,
  sort int not null default 0
);

-- ───────────── Sécurité : lecture publique, écriture admin ─────────────
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','profile','metrics','skill_groups','soft_skills','projects','experiences'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "lecture publique" on public.%I', t);
    execute format('drop policy if exists "ecriture admin" on public.%I', t);
    execute format('create policy "lecture publique" on public.%I for select using (true)', t);
    execute format(
      'create policy "ecriture admin" on public.%I for all to authenticated
         using (public.is_portfolio_admin()) with check (public.is_portfolio_admin())', t);
  end loop;
end $$;

-- ───────────── Stockage : photo, galeries de projets, CV ─────────────
-- Les envois partent directement du navigateur de l'admin vers ce bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media', 'portfolio-media', true, 8388608,
  array['image/jpeg','image/png','image/webp','image/avif','image/gif','application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media lecture" on storage.objects;
drop policy if exists "media ecriture" on storage.objects;
create policy "media lecture" on storage.objects for select
  using (bucket_id = 'portfolio-media');
create policy "media ecriture" on storage.objects for all to authenticated
  using (bucket_id = 'portfolio-media' and public.is_portfolio_admin())
  with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

-- ───────────── Mises à jour (sans danger si le schéma est déjà installé) ─────────────
alter table public.profile add column if not exists funnels_title text;
alter table public.profile add column if not exists funnels_accent text;
alter table public.profile add column if not exists funnels_text text;
alter table public.projects add column if not exists kind text not null default 'application';
alter table public.site_settings alter column default_theme set default 'mono';
