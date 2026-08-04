# ADR 0005: Ordered delivery and forward-only migrations

- Status: Accepted
- Date: 2026-08-04

## Context

Frontend and API releases can depend on new database objects. Independent automatic deployments create incompatible intermediate states, and rewriting applied SQL makes environments diverge.

## Decision

GitHub Actions validates then deploys Supabase migrations/functions, Express, and Next.js in order. Applied migrations are immutable; corrections use new migrations. Application code can roll back only when schema-compatible.

## Alternatives

Independent Vercel deploys and manually edited production schemas were rejected because they bypass ordering and auditability.

## Consequences

Releases are slower and schema changes require compatibility planning, but state is reproducible and failures easier to diagnose.

