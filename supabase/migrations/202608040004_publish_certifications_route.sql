-- Expose the certification registry in recruiter-facing navigation. Individual
-- credential rows remain audience-visible only when visibility = 'public'.
update public.site_content
set content = jsonb_set(
  content,
  '{navigation}',
  '[
    {"label":"Projects","href":"/projects"},
    {"label":"Skills","href":"/skills"},
    {"label":"Experience","href":"/experience"},
    {"label":"Certifications","href":"/certifications"},
    {"label":"About","href":"/about"},
    {"label":"CV","href":"/cv"},
    {"label":"Contact","href":"/contact"}
  ]'::jsonb
), updated_at = now()
where page_key = 'shell';

insert into public.site_content(page_key, content, visibility)
values (
  'certifications',
  '{"eyebrow":"Certification record","title":"Cybersecurity learning with provenance.","intro":"Published certifications and structured training records with direct verification links where available."}'::jsonb,
  'public'
)
on conflict(page_key) do update set
  content = excluded.content,
  visibility = 'public',
  updated_at = now();
