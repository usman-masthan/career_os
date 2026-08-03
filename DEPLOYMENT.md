# CareerOS operations

CareerOS uses Next.js for the public site, Express as the public application boundary, and Supabase for PostgreSQL, Auth, Storage, privacy analytics and scheduled integrations. Versioned SQL under `supabase/migrations/` is the canonical database contract.

## Release order

1. Back up the database and review `npx supabase db push --dry-run`.
2. Apply pending SQL with `npx supabase db push`.
3. Deploy Edge Functions, then configure their secrets.
4. Deploy the Express API with its server-only environment.
5. Deploy Next.js with its public environment.
6. Smoke-test `/api/home`, a project detail, contact submission, analytics `202`, Storage media, sitemap and admin authentication.

Schema changes are forward-only. Roll back application code independently; correct a deployed schema with a new migration rather than editing migration history.

## Environment

Frontend:

- `NEXT_PUBLIC_API_URL`: absolute Express base URL including `/api`.
- `NEXT_PUBLIC_SITE_URL`: canonical public origin used by sitemap and robots.
- `NEXT_PUBLIC_SUPABASE_URL`: project URL used by Auth and public Storage assets.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: publishable/anonymous key protected by RLS.
- `PORTFOLIO_OWNER_EMAILS`: server-only fallback for the owner session; prefer an Auth `portfolio_owner` app-metadata claim.

Backend:

- `SUPABASE_URL` and `SUPABASE_ANON_KEY`: RLS-constrained public database client.
- `FRONTEND_URL`: canonical allowed CORS origin.
- `DEVELOPMENT_ORIGINS`: optional comma-separated local origins.
- `PORT`, `REQUEST_BODY_LIMIT`: runtime controls.

Do not expose or use a service-role key in either web application. Supabase provides the service-role key to deployed Edge Functions. Integration credentials belong in function secrets, never in `integration_accounts.credentials`.

## GitHub synchronization

Deploy the official-API sync function without platform JWT verification because the endpoint uses a separate high-entropy cron secret:

```bash
npx supabase functions deploy github-sync --no-verify-jwt
npx supabase secrets set SYNC_CRON_SECRET=<random-secret>
npx supabase secrets set GITHUB_SYNC_TOKEN=<optional-fine-grained-read-token>
```

Invoke `github-sync` every 15 minutes through Supabase Cron. Store the same random value as a Vault secret named `github_sync_cron_secret`, and send it in the `x-sync-secret` header. The function itself respects each account's `next_sync_at`, applies exponential retry backoff, and writes source records as `pending`; imported items must be approved before canonical mapping.

GitHub public repositories may run without a token at lower rate limits. Credly records use official badge verification/embed URLs. LinkedIn remains disabled until approved OAuth access is configured; scraping is not permitted.

## Content and evidence workflow

- Manage normalized records and `site_content` through Supabase Table Editor.
- Control public output with `visibility`, `featured`, `display_order` and verification fields.
- Upload candidate PNG, JPEG, WebP or PDF evidence to the private `project-evidence-staging` bucket. After sanitization review, move approved assets to the public `project-evidence` bucket and create a public `project_media` record with accurate alt text.
- Never move secrets, customer data, access tokens, live findings or unredacted reports into the public bucket.

## Privacy analytics and contact

Analytics records contain only event name, path, optional subject slug, referrer hostname and timestamp. They intentionally exclude cookies, message bodies, full referrer URLs, IP addresses and cross-site identifiers. Contact rows are insert-only for anonymous users and readable only by the owner.

## Cache and validation

Public records revalidate every five minutes. After urgent content changes, redeploy or trigger route-tag revalidation when available. Before release run backend tests, frontend production build, keyboard/reduced-motion checks, responsive checks at 375/768/1440 widths, and Supabase security advisors.
