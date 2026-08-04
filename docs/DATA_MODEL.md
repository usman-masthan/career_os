# Data model

## Authority and conventions

Ordered SQL in `supabase/migrations/` is the canonical contract. This document is explanatory. UUIDs identify career records; operational analytics use bigint identity. Dates represent career periods, while timestamptz represents events. Slugs are stable, lowercase URL identifiers.

Common publication fields are `visibility`, `featured`, `verification_status`, `verification_url`, source provenance, and timestamps. `display_order` is lower-first where present.

## Domain groups

### Identity and career graph

| Table | Purpose | Important relationships/fields |
|---|---|---|
| `profile` | Public professional identity | Optional `auth.users`; unique `slug`; public contact/social fields; phone removed from public projection |
| `private_profile_contacts` | Owner-only phone data | One-to-one with profile |
| `projects` | Case studies | Belongs to profile; narrative fields, metrics JSON array, evidence state, URLs |
| `skills` | Capability vocabulary | Belongs to profile; category, proficiency |
| `project_skills` | Project-to-skill proof | Composite key; context and featured flag |
| `project_evidence` | Links/artifacts supporting a project | Belongs to project; type, URL, hash, provenance |
| `project_media` | Curated display media | Belongs to project; storage/external location; one location required |
| `credentials` | Certificates/badges/training | Belongs to profile; issuer and validity dates |
| `credential_skills` | Credential-to-skill proof | Composite key |
| `achievements` | Outcomes/recognition | Belongs to profile; optionally linked to skill/project |
| `experiences` | Employment/roles | Belongs to profile; organization, role, period/location |
| `education` | Formal education | Belongs to profile; institution, qualification, field, period |
| `research` | Research records | Belongs to profile; unique per-profile slug, abstract/status |
| `publications` | Writing/public output | Belongs to profile; optional research link; DOI uniqueness |
| `social_posts` | Canonical social items | Belongs to profile; source ID/hash deduplication |
| `activity_events` | Public professional timeline | Belongs to profile; typed subject and metadata |

### Presentation and operations

| Table | Purpose | Access |
|---|---|---|
| `site_content` | Page-specific JSONB copy | Public if published; owner manages |
| `contacts` | Contact submissions/status | Anonymous insert of name/email/message; owner reads/manages |
| `analytics_events` | Minimal interaction events | Anonymous/authenticated insert; owner read |

Allowed analytics events: `page_view`, `project_open`, `cv_open`, `contact_submit`, and `outbound_click`.

### Integrations

| Table | Purpose |
|---|---|
| `integrations` | Provider configuration metadata and enabled state |
| `integration_accounts` | Profile/provider account, schedule, health, failure count |
| `incoming_events` | Idempotent raw webhook inbox |
| `sync_runs` | Execution audit, counts, cursor, and error |
| `external_items` | Raw imported items, canonical mapping, review status |
| `publication_jobs` | Idempotent outbound publication queue |

`integration_accounts.credentials` must remain `{}` by constraint. Secrets belong in Supabase secrets/Vault.

## Lifecycle states

- Visibility: `public`, `unlisted`, `private` (some tables use public/private only).
- Verification: `unverified`, `pending`, `verified`, `rejected`.
- Project evidence readiness: `planned`, `prepared`, `verified`.
- External review: `pending`, `approved`, `rejected`.
- Integration account: `connected`, `paused`, `error`, `revoked`.
- Sync: `queued`, `running`, `succeeded`, `failed`, `cancelled`.

Do not equate `unlisted` with secret: current anonymous policies only return `public`, but sensitive data belongs in a private table/bucket.

## Deletion behavior

Profile-owned career and integration records generally cascade when their parent is deleted. Optional contextual links such as achievement-to-project, publication-to-research, and contact-to-profile use `SET NULL`. Validate exact foreign keys in the migration before any deletion.

## Storage model

- `project-evidence-staging`: private, owner-managed, 10 MiB limit.
- `project-evidence`: public-read, owner-managed, 10 MiB limit.
- Allowed types: PNG, JPEG, WebP, PDF.

The database stores the public object path and descriptive metadata; Storage stores the binary.

## RLS access matrix

| Actor | Public career/site content | Private/owner data | Contacts | Analytics | Integration data |
|---|---|---|---|---|---|
| Anonymous | Read public | None | Insert valid fields only | Insert allowed fields | None |
| Authenticated non-owner | Same public access | None | No owner access | Insert allowed fields | None |
| Owner claim | Manage | Manage | Manage | Read | Manage |
| Service role | Bypasses RLS | Full; function-only | Full | Full | Full |

## Migration rules

1. Create migrations with `npx supabase migration new <name>`.
2. Include constraints, indexes, RLS, grants, and data backfill in the same reviewed change.
3. Make data migrations deterministic/idempotent where practical.
4. Test from a clean `supabase db reset` and existing-state upgrade.
5. Never edit migration history already applied outside your machine.
6. Back up before destructive or high-volume production changes.

## Proposed retention classification

| Data | Proposed retention | Disposal trigger |
|---|---|---|
| Public career/content | While published; archive by owner | Owner decision |
| Contact submissions | 12 months after resolution | Scheduled deletion |
| Analytics events | 13 months | Scheduled deletion/aggregation |
| Sync runs/incoming events | 90 days | Scheduled deletion |
| Rejected external items | 90 days | Scheduled deletion |
| Staging files | 30 days if not approved | Scheduled cleanup |
| Approved public evidence | While referenced | Unpublish and delete after review |

These are proposed targets, not currently automated. Approve them in [Privacy](PRIVACY.md) and implement scheduled cleanup before describing them as guarantees.

