create table if not exists public.site_content (
    page_key text primary key,
    content jsonb not null,
    updated_at timestamptz not null default now()
);

insert into public.site_content (page_key, content)
values (
    'home',
    $$
    {
      "seo": {
        "title": "Personal Portfolio",
        "description": "A portfolio built with Supabase, Next.js, and Express"
      },
      "hero": {
        "preTitle": "Hello, I'm",
        "name": "Dilum De Silva",
        "title": "Mobile Engineer | Lecturer | Speaker",
        "description": "Passionate about creating innovative mobile solutions and sharing knowledge through teaching and public speaking. Specializing in cross-platform development and user-centered design.",
        "ctas": [
          {
            "label": "Download CV",
            "href": "#",
            "variant": "primary"
          },
          {
            "label": "Contact Me",
            "href": "#contact",
            "variant": "outline"
          }
        ],
        "socialLinks": [
          {
            "label": "LinkedIn",
            "icon": "linkedin",
            "href": "#",
            "target": "_blank"
          },
          {
            "label": "Twitter",
            "icon": "twitter",
            "href": "#",
            "target": "_blank"
          },
          {
            "label": "Medium",
            "icon": "medium",
            "href": "#",
            "target": "_blank"
          },
          {
            "label": "GitHub",
            "icon": "github",
            "href": "#",
            "target": "_blank"
          },
          {
            "label": "Email",
            "icon": "email",
            "href": "mailto:hello@example.com"
          }
        ],
        "profileImage": {
          "src": "",
          "alt": "Profile image"
        }
      },
      "sections": {
        "skills": {
          "eyebrow": "Skills",
          "title": "Live from Supabase"
        },
        "projects": {
          "eyebrow": "Projects",
          "title": "Live from Supabase"
        }
      }
    }
    $$::jsonb
)
on conflict (page_key)
do update set
    content = excluded.content,
    updated_at = now();