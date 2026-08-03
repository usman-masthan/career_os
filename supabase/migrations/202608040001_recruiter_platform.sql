-- Recruiter-first presentation, evidence media, privacy analytics and safe sync review.
alter table public.projects
  add column if not exists display_order integer not null default 100,
  add column if not exists recruiter_summary text,
  add column if not exists contribution text,
  add column if not exists scope text,
  add column if not exists architecture text,
  add column if not exists process text,
  add column if not exists limitations text,
  add column if not exists metrics jsonb not null default '[]'::jsonb
    check (jsonb_typeof(metrics) = 'array'),
  add column if not exists evidence_status text not null default 'prepared'
    check (evidence_status in ('planned','prepared','verified'));

alter table public.skills add column if not exists display_order integer not null default 100;
alter table public.credentials add column if not exists display_order integer not null default 100;
alter table public.achievements add column if not exists display_order integer not null default 100;
alter table public.experiences add column if not exists display_order integer not null default 100;
alter table public.research add column if not exists display_order integer not null default 100;

create table public.private_profile_contacts (
  profile_id uuid primary key references public.profile(id) on delete cascade,
  phone text,
  updated_at timestamptz not null default now()
);
insert into public.private_profile_contacts(profile_id,phone)
select id,phone from public.profile where phone is not null
on conflict(profile_id) do update set phone=excluded.phone,updated_at=now();
update public.profile set phone=null where phone is not null;
alter table public.private_profile_contacts enable row level security;
create policy "owner manages private profile contacts" on public.private_profile_contacts
  for all to authenticated using(public.is_careeros_owner()) with check(public.is_careeros_owner());
revoke select on public.profile from anon, authenticated;
grant select (
  id,slug,display_name,headline,bio,location,avatar_url,website_url,
  visibility,featured,verification_status,verification_url,source_platform,
  external_identifier,created_at,updated_at,email,linkedin_url,github_url,
  availability,initials
) on public.profile to anon, authenticated;
revoke all on public.private_profile_contacts from anon;
grant select,insert,update,delete on public.private_profile_contacts to authenticated;

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_type text not null check (media_type in ('image','diagram','report','finding','video')),
  title text not null,
  caption text,
  storage_path text,
  external_url text,
  alt_text text,
  display_order integer not null default 100,
  visibility text not null default 'private' check (visibility in ('public','private')),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (storage_path is not null or external_url is not null)
);
create index project_media_project_order_idx on public.project_media(project_id, display_order);
alter table public.project_media enable row level security;
create policy "public reads published project media" on public.project_media
  for select to anon, authenticated using (visibility = 'public' or public.is_careeros_owner());
create policy "owner manages project media" on public.project_media
  for all to authenticated using (public.is_careeros_owner()) with check (public.is_careeros_owner());

create table public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null check (event_name in ('page_view','project_open','cv_open','contact_submit','outbound_click')),
  path text not null check (char_length(path) between 1 and 500),
  subject_type text,
  subject_slug text,
  referrer_host text check (referrer_host is null or (char_length(referrer_host) <= 253 and position('/' in referrer_host) = 0)),
  occurred_at timestamptz not null default now()
);
create index analytics_events_time_idx on public.analytics_events(occurred_at desc);
alter table public.analytics_events enable row level security;
create policy "anonymous records privacy events" on public.analytics_events
  for insert to anon, authenticated with check (
    char_length(path) between 1 and 500
    and char_length(coalesce(referrer_host, '')) <= 253
  );
create policy "owner reads analytics" on public.analytics_events
  for select to authenticated using (public.is_careeros_owner());
revoke select, update, delete on public.analytics_events from anon;
grant insert (event_name, path, subject_type, subject_slug, referrer_host) on public.analytics_events to anon, authenticated;

alter table public.external_items
  add column if not exists review_status text not null default 'pending'
    check (review_status in ('pending','approved','rejected')),
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null;

alter table public.integration_accounts
  add column if not exists sync_interval_minutes integer not null default 360
    check (sync_interval_minutes between 15 and 10080),
  add column if not exists next_sync_at timestamptz,
  add column if not exists consecutive_failures integer not null default 0,
  add column if not exists last_error_at timestamptz;
alter table public.integration_accounts
  add constraint integration_credentials_must_be_empty check (credentials = '{}'::jsonb);

-- Integration operational data is owner-only. Credentials must remain empty;
-- function secrets live in Supabase's secret manager.
alter table public.integrations enable row level security;
alter table public.integration_accounts enable row level security;
alter table public.incoming_events enable row level security;
alter table public.sync_runs enable row level security;
alter table public.external_items enable row level security;
alter table public.publication_jobs enable row level security;
do $$
declare table_name text;
begin
  foreach table_name in array array['integrations','integration_accounts','incoming_events','sync_runs','external_items','publication_jobs'] loop
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_careeros_owner()) with check (public.is_careeros_owner())',
      'owner_only_' || table_name, table_name
    );
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-evidence', 'project-evidence', true, 10485760,
  array['image/png','image/jpeg','image/webp','application/pdf'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-evidence-staging', 'project-evidence-staging', false, 10485760,
  array['image/png','image/jpeg','image/webp','application/pdf'])
on conflict (id) do update set public = false,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads project evidence objects" on storage.objects
  for select to anon, authenticated using (bucket_id = 'project-evidence');
create policy "owner manages project evidence objects" on storage.objects
  for all to authenticated using (bucket_id = 'project-evidence' and public.is_careeros_owner())
  with check (bucket_id = 'project-evidence' and public.is_careeros_owner());
create policy "owner manages staged evidence objects" on storage.objects
  for all to authenticated using (bucket_id = 'project-evidence-staging' and public.is_careeros_owner())
  with check (bucket_id = 'project-evidence-staging' and public.is_careeros_owner());

update public.projects set display_order = case slug
  when 'agentic-soc-triage' then 10 when 'secure-web-vapt-lab' then 20
  when 'explainable-netflow-ids' then 30 when 'visualit' then 40 else 100 end,
  recruiter_summary = coalesce(recruiter_summary, impact),
  contribution = coalesce(contribution, approach),
  scope = coalesce(scope, challenge), process = coalesce(process, approach);

update public.site_content set content = jsonb_set(content, '{navigation}',
  '[{"label":"About","href":"/about"},{"label":"Projects","href":"/projects"},{"label":"Experience","href":"/experience"},{"label":"Research","href":"/research"},{"label":"Skills","href":"/skills"},{"label":"Certifications","href":"/certifications"},{"label":"Achievements","href":"/achievements"},{"label":"Writing","href":"/writing"},{"label":"Contact","href":"/contact"}]'::jsonb), updated_at = now()
where page_key = 'shell';

insert into public.site_content(page_key, content, visibility) values
('certifications', '{"eyebrow":"Verification registry / Certifications","title":"Learning signals with provenance.","intro":"Certificates, badges and structured learning records."}'::jsonb, 'public')
on conflict(page_key) do update set content=excluded.content, visibility='public', updated_at=now();
update public.site_content set content=jsonb_set(content,'{body}',
  '["Treat security as an engineering discipline: define scope, preserve evidence, communicate uncertainty, and build controls that teams can operate."]'::jsonb), updated_at=now()
where page_key='about';

grant usage, select on sequence public.analytics_events_id_seq to anon, authenticated;

insert into public.integrations(key,name,platform,status,config_schema) values
  ('github-public','GitHub public portfolio sync','github','active','{"account":"string","selected_repositories":"string[]"}'::jsonb),
  ('credly-verification','Credly verified badges','credly','active','{"public_profile_url":"string"}'::jsonb),
  ('linkedin-identity','LinkedIn approved identity','linkedin','disabled','{"profile_url":"string","oauth_fields":"string[]"}'::jsonb)
on conflict(key) do update set name=excluded.name, status=excluded.status, config_schema=excluded.config_schema, updated_at=now();

insert into public.integration_accounts(integration_id,profile_id,external_account_id,display_name,status,credentials,next_sync_at)
select integration.id, profile.id, 'usman-masthan', 'Ahamed Usman on GitHub', 'connected', '{}'::jsonb, now()
from public.integrations integration cross join public.profile profile
where integration.key='github-public' and profile.slug='ahamed-usman'
on conflict(integration_id,external_account_id) do update set status='connected', credentials='{}'::jsonb, next_sync_at=now(), updated_at=now();

insert into public.project_skills(project_id,skill_id,context,featured)
select project.id, skill.id, mapping.context, true
from (values
  ('agentic-soc-triage','python','Automation workflow implementation'),
  ('agentic-soc-triage','security-automation','Triage and escalation automation'),
  ('visualit','flutter','Production application engineering'),
  ('visualit','python','Application and AI services'),
  ('visualit','firebase','Production platform services'),
  ('visualit','gcp','Cloud delivery environment'),
  ('explainable-netflow-ids','python','Traffic feature and model pipeline'),
  ('explainable-netflow-ids','scikit-learn','Isolation Forest implementation'),
  ('explainable-netflow-ids','anomaly-detection','Detection methodology'),
  ('secure-web-vapt-lab','owasp-zap','Passive and manual validation'),
  ('secure-web-vapt-lab','nmap','Scoped service discovery'),
  ('secure-web-vapt-lab','docker','Isolated lab environment'),
  ('secure-web-vapt-lab','web-vulnerability-assessment','Assessment methodology')
) mapping(project_slug,skill_slug,context)
join public.projects project on project.slug=mapping.project_slug
join public.skills skill on skill.profile_id=project.profile_id and skill.slug=mapping.skill_slug
on conflict(project_id,skill_id) do update set context=excluded.context, featured=true;

update public.achievements achievement set project_id=project.id
from public.projects project where project.slug='visualit'
  and achievement.profile_id=project.profile_id and achievement.source_platform='manual';
