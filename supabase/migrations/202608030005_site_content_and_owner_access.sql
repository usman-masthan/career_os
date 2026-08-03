-- Complete the CareerOS application contract with editable page content and
-- owner access. The API's public clients remain constrained by RLS.
create or replace function public.is_careeros_owner()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'portfolio_owner')::boolean, false);
$$;

revoke all on function public.is_careeros_owner() from public;
grant execute on function public.is_careeros_owner() to anon, authenticated;

create table public.site_content (
  page_key text primary key,
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  visibility text not null default 'private' check (visibility in ('public', 'private')),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "public reads published site content"
  on public.site_content for select to anon, authenticated
  using (visibility = 'public' or public.is_careeros_owner());

create policy "owner manages site content"
  on public.site_content for all to authenticated
  using (public.is_careeros_owner())
  with check (public.is_careeros_owner());

-- Career records are publicly readable according to the visibility policies
-- in the preceding migration and mutable only by the CareerOS owner.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profile', 'projects', 'project_evidence', 'skills', 'project_skills',
    'credentials', 'credential_skills', 'achievements', 'experiences',
    'education', 'research', 'publications', 'social_posts', 'activity_events'
  ] loop
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_careeros_owner()) with check (public.is_careeros_owner())',
      'owner_manages_' || table_name,
      table_name
    );
  end loop;
end $$;

create policy "owner manages contacts"
  on public.contacts for all to authenticated
  using (public.is_careeros_owner())
  with check (public.is_careeros_owner());
