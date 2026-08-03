-- Anonymous readers only see public career records; writes remain server/owner controlled.
do $$ declare t text; begin
  foreach t in array array['profile','projects','project_evidence','skills','credentials','achievements','experiences','education','research','publications','social_posts','activity_events'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select using (visibility = ''public'')', 'public_read_' || t, t);
  end loop;
end $$;
alter table public.project_skills enable row level security;
create policy "Public can read visible project skills" on public.project_skills for select using (
  exists(select 1 from public.projects p where p.id=project_id and p.visibility='public') and
  exists(select 1 from public.skills s where s.id=skill_id and s.visibility='public'));
alter table public.credential_skills enable row level security;
create policy "Public can read visible credential skills" on public.credential_skills for select using (
  exists(select 1 from public.credentials c where c.id=credential_id and c.visibility='public') and
  exists(select 1 from public.skills s where s.id=skill_id and s.visibility='public'));
