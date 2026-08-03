create table if not exists public.site_content (
    page_key text primary key,
    content jsonb not null,
    updated_at timestamptz not null default now()
);

-- Stage 1 seed: the curated identity and homepage content mirrored by the typed
-- frontend content module. Future admin publishing can update these records.
insert into public.site_content (page_key, content)
values
('home', $json$
{
  "seo": {"title":"Ahamed.dev — Software Engineer & AI Builder","description":"The CareerOS of Ahamed: selected software, applied AI research, experience, credentials, and writing."},
  "profile": {"name":"Ahamed","brand":"Ahamed.dev","role":"Software Engineer · AI & data systems","location":"Sri Lanka · Open to remote","availability":"Available for selected opportunities","summary":"I design dependable digital products at the intersection of software engineering, applied AI, and thoughtful user experience."},
  "actions": [
    {"label":"Explore selected work","href":"/projects"},
    {"label":"Start a conversation","href":"mailto:hello@ahamed.dev"},
    {"label":"View CV","href":"/cv"}
  ]
}
$json$::jsonb),
('projects', $json$
{
  "items": [
    {"slug":"career-os","title":"CareerOS","summary":"An evidence-first career platform that turns projects, learning, and outcomes into a navigable professional record.","impact":"One source of truth for career evidence","tags":["Next.js","Supabase","Product systems"]},
    {"slug":"signal-lab","title":"Signal Lab","summary":"A research workspace for testing, comparing, and communicating machine-learning experiments.","impact":"Faster path from experiment to decision","tags":["Python","Machine learning","Data visualisation"]},
    {"slug":"access-map","title":"Access Map","summary":"A responsive, accessibility-led service discovery concept built for constrained devices and connections.","impact":"Designed for inclusive, low-friction access","tags":["React","Accessibility","Service design"]}
  ]
}
$json$::jsonb),
('career', $json$
{
  "skills":[{"group":"Engineering","items":["JavaScript / TypeScript","React & Next.js","Node.js","Python","SQL & Supabase"]},{"group":"AI & data","items":["Applied machine learning","Data analysis","Experiment design","Responsible AI"]},{"group":"Practice","items":["System design","Accessible UI","Product discovery","Technical writing"]}],
  "experience":[{"period":"Present","role":"Independent Software Engineer","organisation":"Ahamed.dev","detail":"Building human-centred web and AI systems, from product framing through reliable delivery."}],
  "credentials":[{"date":"2026","title":"CareerOS — continuous professional development","issuer":"Ahamed.dev"},{"date":"2025","title":"Applied AI & responsible product practice","issuer":"Independent study"}],
  "research":[{"title":"Evidence-aware professional knowledge systems","status":"Active inquiry"},{"title":"Human-readable evaluation for applied AI","status":"Working notes"}]
}
$json$::jsonb)
on conflict (page_key) do update set content = excluded.content, updated_at = now();
