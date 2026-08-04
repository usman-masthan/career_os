# API reference

## Conventions

- Base URL: `https://<api-host>/api`; local: `http://localhost:5000/api`.
- JSON requests require `Content-Type: application/json`.
- Public endpoints use Supabase anonymous access and RLS.
- Dates are ISO date strings; timestamps are ISO 8601 UTC strings.
- Collection endpoints currently have no pagination.

Error envelope:

```json
{"error":{"code":"VALIDATION_ERROR","message":"The contact submission is invalid.","fields":{"email":"Must be a valid email address."}}}
```

Unexpected database errors return a generic message; internal details stay in server logs.

## Read endpoints

| Route | Response/notes |
|---|---|
| `GET /home` | `{content, profile, projects, skills, certifications, achievements, experiences, research}`; featured/limited aggregate |
| `GET /profile` | Array of public profiles using an explicit safe column projection |
| `GET /projects` | Public projects ordered by `display_order` |
| `GET /projects/:slug` | One project plus visible project skills, evidence, media, and achievements; `404` if hidden/missing |
| `GET /skills` | Public skills alphabetically |
| `GET /skills/:slug/evidence` | Skill plus connected projects/evidence, credentials, achievements; `404` if hidden/missing |
| `GET /experiences` | Public records newest start first |
| `GET /education` | Public records newest start first |
| `GET /credentials` | Public records newest issue first |
| `GET /certifications` | Explicit public credential projection, display order then issue date |
| `GET /research` | Public records newest start first |
| `GET /achievements` | Public records newest achievement first |
| `GET /publications` | Public records newest publication first |
| `GET /site-content/:pageKey` | The published JSON object for a page key |

Example:

```bash
curl --fail "http://localhost:5000/api/projects/example-project"
```

## `POST /contact`

Rate limit: 5 requests per 15 minutes per origin/IP pair (per process instance).

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "message": "I would like to discuss a security engineering role.",
  "website": ""
}
```

Rules: no unknown fields; name 2–100 characters; email 5–254 and valid; message 10–5000; values must be strings. `website` is a honeypot. A filled honeypot returns `202` without persistence.

- `202`: accepted.
- `422`: validation failure.
- `429`: rate limited.
- `500`: storage failure.

## `POST /analytics/events`

Rate limit: 60 requests per minute (per process instance).

```json
{
  "event_name": "project_open",
  "path": "/projects/example-project",
  "subject_type": "project",
  "subject_slug": "example-project",
  "referrer_host": "example.com"
}
```

Allowed names: `page_view`, `project_open`, `cv_open`, `contact_submit`, `outbound_click`. `path` must be local and at most 500 characters. Optional subject type/slug limits are 50/200; referrer must be a hostname without `/`, at most 253.

- `202`: accepted with an empty body.
- `422`: invalid event.
- `429`: rate limited.

## Next.js application routes

- `POST /api/contact`: same-origin proxy, 10-second upstream timeout, returns upstream status/body or `502`.
- `POST /api/revalidate`: requires `x-revalidate-secret`; accepts a Supabase webhook payload with `schema=public` and an allow-listed table; returns invalidated tags.
- `GET /cv/download`: dynamically generates a PDF; `Cache-Control: no-store`.

## Compatibility policy

Current API version is unversioned. Additive fields are allowed; removing/renaming fields or changing semantics requires coordinated frontend release and an ADR. Before external consumers exist, introduce `/api/v1` and an OpenAPI contract. Never expose a private column merely because RLS filters rows; use explicit projections for sensitive resources.

