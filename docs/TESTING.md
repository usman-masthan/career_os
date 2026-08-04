# Testing strategy

## Goals

Protect public/private boundaries, evidence integrity, critical recruiter journeys, operational writes, and deployability. Tests should be deterministic and must not require production services.

## Current automated coverage

- Backend unit tests: contact normalization/validation/honeypot and analytics allow-list.
- Frontend CI: ESLint and production build.
- Deployment: API home and frontend reachability smoke checks.

Run:

```bash
cd backend && npm test
cd ../frontend && npm run lint && npm run build
```

## Required test layers

| Layer | Required cases |
|---|---|
| Unit | validators, formatting, cache mapping, content helpers |
| API integration | every route, RLS-filtered results, 404/422/429/500, nested evidence |
| Database | constraints, grants, all actor roles, migration upgrade/reset |
| Component | contact states, filters, evidence explorer, accessible names |
| E2E | home→project, skill evidence, contact, CV, owner login/redirect, metadata routes |
| Security | RLS bypass attempts, payload/body limits, CORS, secret endpoints, file access |
| Accessibility | keyboard, focus, landmarks/headings, labels/errors, contrast, reduced motion |
| Performance | home/project LCP, API aggregate latency, image/PDF weight |

## RLS test matrix

For each table, test anonymous, authenticated non-owner, owner JWT claim, and where necessary service role. Assert both permitted behavior and denial. Contact and analytics tests must prove public inserts cannot become selects/updates/deletes.

## Test data

Use synthetic identities and `example.com` addresses. Fixtures must contain public/private/unlisted variants, verified/unverified evidence, missing optional values, expired credentials, empty collections, and Unicode/long boundary inputs. Never copy production contacts or tokens.

## Manual release acceptance

- Viewports: 375, 768, 1440 px.
- Chrome plus one Firefox/WebKit check for material UI changes.
- Keyboard-only and reduced motion.
- Loading, empty, unavailable, validation, 404, and global error states.
- Sitemap, robots, metadata, Open Graph, CV download, Storage media.
- Contact persistence/privacy and analytics minimization.
- Webhook invalidation and owner session refresh.

## CI policy

No merge with failing required checks. Warnings must be tracked if accepted. Schema changes require clean-reset and upgrade-path validation. Flaky tests are defects: quarantine only with an issue, owner, and deadline.

## Coverage backlog

Highest priority: Supabase RLS integration harness, Express route integration tests, Playwright E2E/accessibility, webhook tests, distributed rate-limit test, and dependency/security scanning.

