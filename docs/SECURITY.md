# Security

## Scope and reporting

This document covers the CareerOS repository, hosted frontend/API, Supabase project, and deployment pipeline. Do not report vulnerabilities through the public contact form if disclosure would expose exploit details. Until a dedicated security address is configured, contact the repository owner privately through the repository hosting platform.

Never include credentials, personal data, live exploit payloads, or unredacted evidence in an issue.

## Assets and trust priorities

1. Supabase service-role, database, deployment, Cron, and revalidation secrets.
2. Owner account/session and private contact submissions.
3. Database integrity and public evidence authenticity.
4. Availability of public pages/API.
5. Privacy of minimized analytics and staging files.

## Threat model

| Threat | Implemented controls | Remaining work |
|---|---|---|
| Unauthorized table read/write | RLS, column grants, anon key API, owner JWT claim | Automated RLS integration tests |
| Service credential exposure | Service role limited to Edge Function; env files ignored | Secret scanning and rotation runbook drills |
| Contact spam/injection | strict JSON, allow-list, normalization, honeypot, DB constraints, rate limit | Shared serverless limiter, notification filtering |
| Analytics tracking creep | event allow-list and minimized schema | Retention automation and privacy review |
| Malicious evidence file | private staging, MIME/size limits, human review | Malware scan, metadata stripping automation |
| Cache purge abuse | high-entropy secret, schema/table allow-list | Rotation procedure and delivery monitoring |
| Cron abuse | independent high-entropy header secret | Request audit/alerting |
| Supply-chain compromise | lockfiles and CI | Dependabot/Renovate, code scanning, pinned action SHAs |
| Imported misinformation | pending review and provenance | Formal reviewer checklist/audit UI |
| Session theft | HTTP-only, Secure production, SameSite=Lax cookies | CSP, session revocation UX, MFA policy |

## Authentication and authorization

- Owner login uses Supabase password Auth.
- Next.js stores access and refresh tokens in HTTP-only cookies and refreshes them in middleware.
- `/admin/*` requires either the owner app-metadata claim or configured owner email.
- Database mutations require `app_metadata.portfolio_owner = true`; email fallback does not satisfy RLS.
- Set claims through trusted administrative tooling, never client-editable metadata.

## Secret inventory

| Secret | Location | Consumers |
|---|---|---|
| Supabase anon key | frontend/backend environment | Public RLS-constrained access; safe to publish by design |
| Supabase service role | Supabase-managed function environment | Edge Function only |
| `SYNC_CRON_SECRET` | Function secret + Vault copy | Cron/function authentication |
| `GITHUB_SYNC_TOKEN` | Function secret | GitHub API only |
| `REVALIDATE_SECRET` | Frontend environment + webhook header | Cache invalidation |
| Supabase access token/password | GitHub production secrets | CI migrations/deploy |
| Vercel token/project IDs | GitHub production secrets | CI deploy |

Rotation: create the replacement, update all consumers, test, revoke the old value, review logs, and record completion. Never commit secret values or paste them into tickets/logs.

## Secure change checklist

- Identify affected actor, data classification, and trust boundary.
- Add/adjust constraints and RLS before exposing a route.
- Use explicit select projections for sensitive tables.
- Validate input at application and database boundaries.
- Return safe errors; log no secrets or unnecessary personal data.
- Add abuse limits and idempotency for writes.
- Test anonymous, ordinary authenticated, owner, and service behavior.
- Threat-model new third-party integrations and file types.
- Update this document and an ADR for important boundary changes.

## Incident response

1. **Triage:** timestamp, affected environment/data, indicators, and current exposure.
2. **Contain:** revoke credentials, pause integrations/deployments, disable affected endpoint or account.
3. **Preserve:** retain relevant provider audit logs without copying sensitive data broadly.
4. **Eradicate:** patch root cause, rotate dependent credentials, validate RLS/grants.
5. **Recover:** deploy in dependency order, verify integrity and smoke tests, monitor closely.
6. **Notify:** follow applicable legal/contractual obligations; communicate facts and scope.
7. **Learn:** write a blameless post-incident report with actions, owners, and dates.

See [Runbook](RUNBOOK.md) and [Backup and restore](BACKUP_RESTORE.md).

## Production headers and hardening backlog

Confirm at the hosting layer: TLS redirect, HSTS, CSP suited to Supabase/media origins, `X-Content-Type-Options: nosniff`, a restrictive referrer policy, permissions policy, and frame protection. Add automated dependency/security scanning and periodic access reviews. These controls are recommendations unless verified in deployed configuration.

