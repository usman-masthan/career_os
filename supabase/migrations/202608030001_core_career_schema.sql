-- CareerOS core evidence graph.
create extension if not exists pgcrypto;

create table public.profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  slug text not null unique, display_name text not null, headline text, bio text,
  location text, avatar_url text, website_url text,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')),
  featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')),
  verification_url text, source_platform text, external_identifier text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (source_platform, external_identifier)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  slug text not null, title text not null, summary text, description text, project_url text, repository_url text,
  started_at date, ended_at date,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')),
  verification_url text, source_platform text, external_identifier text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(profile_id, slug), unique (profile_id, source_platform, external_identifier)
);

create table public.project_evidence (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.projects(id) on delete cascade,
  title text not null, description text, evidence_type text not null default 'link', url text, occurred_at timestamptz,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')),
  verification_url text, source_platform text, external_identifier text, content_hash text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (project_id, source_platform, external_identifier), unique (project_id, content_hash)
);

create table public.skills (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  slug text not null, name text not null, category text, description text, proficiency text,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')),
  verification_url text, source_platform text, external_identifier text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(profile_id, slug), unique(profile_id, name), unique (profile_id, source_platform, external_identifier)
);

create table public.project_skills (
  project_id uuid not null references public.projects(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  context text, featured boolean not null default false, created_at timestamptz not null default now(),
  primary key(project_id, skill_id)
);

create table public.credentials (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  name text not null, issuer text not null, issued_at date, expires_at date, credential_url text,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')),
  verification_url text, source_platform text, external_identifier text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (profile_id, source_platform, external_identifier)
);

create table public.credential_skills (
  credential_id uuid not null references public.credentials(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(credential_id, skill_id)
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete set null, project_id uuid references public.projects(id) on delete set null,
  title text not null, description text, achieved_at date,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')),
  verification_url text, source_platform text, external_identifier text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (profile_id, source_platform, external_identifier)
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  organisation text not null, role text not null, description text, location text, started_at date, ended_at date,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')), verification_url text,
  source_platform text, external_identifier text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (profile_id, source_platform, external_identifier)
);

create table public.education (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  institution text not null, qualification text, field_of_study text, description text, started_at date, ended_at date,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')), verification_url text,
  source_platform text, external_identifier text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (profile_id, source_platform, external_identifier)
);

create table public.research (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  slug text not null, title text not null, abstract text, status text, started_at date, ended_at date, url text,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')), verification_url text,
  source_platform text, external_identifier text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(profile_id, slug), unique (profile_id, source_platform, external_identifier)
);

create table public.publications (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  research_id uuid references public.research(id) on delete set null, slug text not null, title text not null, abstract text,
  publication_type text, publisher text, published_at timestamptz, url text, doi text,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')), verification_url text,
  source_platform text, external_identifier text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(profile_id, slug), unique (doi), unique (profile_id, source_platform, external_identifier)
);

create table public.social_posts (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  body text, post_url text, published_at timestamptz,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')), verification_url text,
  source_platform text not null, external_identifier text not null, content_hash text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(profile_id, source_platform, external_identifier), unique (profile_id, content_hash)
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(), profile_id uuid not null references public.profile(id) on delete cascade,
  event_type text not null, subject_type text, subject_id uuid, title text, occurred_at timestamptz not null default now(), metadata jsonb not null default '{}'::jsonb,
  visibility text not null default 'public' check (visibility in ('public','unlisted','private')), featured boolean not null default false,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified','rejected')), verification_url text,
  source_platform text, external_identifier text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (profile_id, source_platform, external_identifier)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(), profile_id uuid references public.profile(id) on delete set null,
  name text not null, email text not null, message text not null, status text not null default 'new', source_platform text default 'website',
  external_identifier text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (source_platform, external_identifier)
);

create index project_skills_skill_idx on public.project_skills(skill_id);
create index credential_skills_skill_idx on public.credential_skills(skill_id);
create index achievements_skill_idx on public.achievements(skill_id) where skill_id is not null;
create index project_evidence_project_idx on public.project_evidence(project_id);
