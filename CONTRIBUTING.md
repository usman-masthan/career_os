# Contributing to CareerOS

## Before starting

Read [README](README.md), [Architecture](docs/ARCHITECTURE.md), [Data model](docs/DATA_MODEL.md), [Security](docs/SECURITY.md), and relevant ADRs. Discuss changes that alter trust boundaries, schema ownership, public API compatibility, or product scope before implementation.

## Setup

Use Node 20. Follow the root README for dependencies, Supabase, and environment configuration. Never use production credentials/data for development.

## Branch and commit workflow

1. Create a focused branch from current `main`.
2. Keep changes small enough to review and avoid unrelated formatting.
3. Use clear imperative commits describing intent.
4. Rebase/update safely before review; never rewrite another contributor's shared work without agreement.
5. Open a PR with problem, approach, risk, tests, screenshots where relevant, schema/security/privacy effects, and rollback notes.

## Code expectations

- Preserve frontend/API/database separation and existing style.
- Validate at both application and database boundaries where meaningful.
- Use explicit safe projections for sensitive resources.
- Provide accessible loading, empty, failure, and success states.
- Do not add dependencies without explaining maintenance/security cost.
- Never commit `.env*`, tokens, dumps, personal submissions, build output, or unreviewed evidence.

## Database changes

Create a new migration with `npx supabase migration new <name>`. Include constraints, indexes, RLS policies, grants, and safe backfill. Test clean reset and upgrade. Applied migrations are immutable. Destructive changes require backup/recovery and compatibility plans.

## Required verification

```bash
cd backend && npm test
cd ../frontend && npm run lint && npm run build
```

Also perform tests described in [Testing](docs/TESTING.md) proportional to risk. Schema/auth changes require actor-based RLS checks; UI changes require keyboard/responsive checks.

## Documentation rule

Update docs in the same PR as behavior. Add an ADR for a significant, durable decision. Update API/data/content/runbook documents when their contracts change and add user-visible changes to `CHANGELOG.md`.

## Review checklist

- Scope and acceptance criteria satisfied.
- Tests cover success, boundary, and failure paths.
- No secrets/personal data or unsafe logs.
- RLS/grants preserve least privilege.
- Backward compatibility and rollout order are safe.
- Accessibility, privacy, performance, and operations considered.
- Documentation and migration history are correct.

## Conduct and security

Follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report vulnerabilities privately as described in [Security](docs/SECURITY.md), not in a public issue.

