-- Fields consumed by the public portfolio. Personal and career information is
-- stored here, never in the frontend bundle.
alter table public.profile
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists linkedin_url text,
  add column if not exists github_url text,
  add column if not exists availability text,
  add column if not exists initials text;

alter table public.projects
  add column if not exists tags text[] not null default '{}',
  add column if not exists impact text,
  add column if not exists challenge text,
  add column if not exists approach text,
  add column if not exists outcome text;

-- UI copy is editable independently from normalized career records.
insert into public.site_content (page_key, content, visibility)
values
  ('home', '{"seo":{"title":"CareerOS","description":"A Supabase-backed professional portfolio."},"kicker":"SECURITY ENGINEER / PORTFOLIO","hero_title":"Defending systems.","hero_emphasis":"Engineering trust.","quick_facts":[{"label":"FOCUS","value":"Cybersecurity · DevSecOps"},{"label":"PRACTICE","value":"Cloud Security · Security Automation"},{"label":"PRINCIPLE","value":"Evidence over assumptions"}],"statement":{"eyebrow":"02 / Security portfolio","title":"Discover. Detect.","emphasis":"Triage safely.","body":"Security work connected through policy controls, human approval and audit logging."}}'::jsonb, 'public'),
  ('shell', '{"mark":"AU","brand_subtitle":"SECURITY / ENGINEERING","footer_text":"Security is a practice, not a claim.","admin_label":"SYSTEM ACCESS","navigation":[{"label":"About","href":"/about"},{"label":"Projects","href":"/projects"},{"label":"Experience","href":"/experience"},{"label":"Research","href":"/research"},{"label":"Skills","href":"/skills"},{"label":"Credentials","href":"/credentials"},{"label":"Achievements","href":"/achievements"},{"label":"Writing / Updates","href":"/writing"},{"label":"Contact","href":"/contact"}]}'::jsonb, 'public'),
  ('about', '{"eyebrow":"About","title":"Security engineering with intent.","intro":"A professional profile grounded in security engineering evidence."}'::jsonb, 'public'),
  ('projects', '{"eyebrow":"Projects","title":"Selected security work.","intro":"Published project records and case studies."}'::jsonb, 'public'),
  ('experience', '{"eyebrow":"Experience","title":"Professional experience.","intro":"Software engineering, secure delivery, testing and teaching experience."}'::jsonb, 'public'),
  ('research', '{"eyebrow":"Research","title":"Research and model integrity.","intro":"Published and ongoing research records."}'::jsonb, 'public'),
  ('skills', '{"eyebrow":"Capabilities","title":"Security and engineering toolkit.","intro":"Skills connected to public evidence."}'::jsonb, 'public'),
  ('credentials', '{"eyebrow":"Credentials","title":"Professional credentials.","intro":"Published training and certification records."}'::jsonb, 'public'),
  ('achievements', '{"eyebrow":"Achievements","title":"Recognition and outcomes.","intro":"Published achievement records."}'::jsonb, 'public'),
  ('writing', '{"eyebrow":"Writing / Updates","title":"Writing and publications.","intro":"Published articles, papers and updates."}'::jsonb, 'public'),
  ('contact', '{"eyebrow":"Contact","title":"Start a conversation.","intro":"Use the published contact channels below.","card_title":"Contact details"}'::jsonb, 'public')
on conflict (page_key) do update
set content = excluded.content, visibility = excluded.visibility, updated_at = now();
