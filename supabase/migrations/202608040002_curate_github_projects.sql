-- Promote the owner-approved GitHub repositories into the canonical portfolio.
-- Repository metadata remains synchronized in external_items; projects remain the
-- curated public records and can be enriched independently in Supabase.
do $$
declare
  owner_profile_id uuid;
  imported record;
  project_id uuid;
begin
  select id into owner_profile_id
  from public.profile
  where slug = 'ahamed-usman';

  if owner_profile_id is null then
    raise exception 'Portfolio owner profile was not found';
  end if;

  for imported in
    select
      external.id as external_item_id,
      external.external_identifier,
      external.source_url,
      external.raw_data,
      selection.slug,
      selection.title,
      selection.display_order,
      selection.featured
    from public.external_items external
    join (values
      ('agentic-soc-triage', 'agentic-soc-triage', 'SOC Incident Triage & Support Automation', 10, true),
      ('secure-web-vapt-lab', 'secure-web-vapt-lab', 'Secure Web Application VAPT Lab', 20, true),
      ('explainable-netflow-ids', 'explainable-netflow-ids', 'Explainable Network Anomaly Detection', 30, true),
      ('bounded-agentic-cyber-defence', 'bounded-agentic-cyber-defence', 'Bounded Agentic Cyber Defence', 50, false),
      ('cloud-delivery-pipeline', 'cloud-delivery-pipeline', 'Cloud Delivery Pipeline', 60, false),
      ('secops-fortress', 'secops-fortress', 'SecOps Fortress', 70, false),
      ('secrets-injection', 'secrets-injection', 'Secrets Injection', 80, false),
      ('career_os', 'career-os', 'CareerOS', 90, false)
    ) as selection(repository_name, slug, title, display_order, featured)
      on external.raw_data ->> 'name' = selection.repository_name
    where external.source_platform = 'github'
      and external.item_type = 'repository'
      and external.deleted_at is null
  loop
    insert into public.projects (
      profile_id, slug, title, summary, description, project_url,
      repository_url, tags, visibility, featured, verification_status,
      verification_url, source_platform, external_identifier, display_order,
      recruiter_summary, evidence_status
    ) values (
      owner_profile_id,
      imported.slug,
      imported.title,
      coalesce(nullif(imported.raw_data ->> 'description', ''), 'Selected public repository maintained on GitHub.'),
      coalesce(nullif(imported.raw_data ->> 'description', ''), 'Selected public repository maintained on GitHub.'),
      nullif(imported.raw_data ->> 'homepage', ''),
      imported.source_url,
      case
        when nullif(imported.raw_data ->> 'language', '') is null then '{}'::text[]
        else array[imported.raw_data ->> 'language']
      end,
      'public', imported.featured, 'verified', imported.source_url,
      'github', imported.external_identifier, imported.display_order,
      coalesce(nullif(imported.raw_data ->> 'description', ''), 'Selected public repository maintained on GitHub.'),
      'planned'
    )
    on conflict (profile_id, slug) do update set
      repository_url = excluded.repository_url,
      verification_status = excluded.verification_status,
      verification_url = excluded.verification_url,
      display_order = excluded.display_order,
      updated_at = now()
    returning id into project_id;

    update public.external_items
    set review_status = 'approved',
        reviewed_at = now(),
        canonical_table = 'projects',
        canonical_id = project_id
    where id = imported.external_item_id;
  end loop;
end $$;
