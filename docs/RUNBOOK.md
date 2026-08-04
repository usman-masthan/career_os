# Operations runbook

## Ownership and environments

Record current service owners, escalation contacts, Supabase project ref, Vercel project names, domains, and status-page links in the private operations system—not in this public file. Production changes flow through the protected GitHub `production` environment.

## Routine release

1. Confirm CI passes and review migration/application compatibility.
2. Back up before material database changes.
3. Run `npx supabase db push --dry-run` and review every pending migration.
4. Merge to `main`.
5. Observe GitHub Actions: Supabase migrations/functions → backend → frontend.
6. Verify `/api/home`, project detail, contact proxy, analytics `202`, public media, sitemap, CV, and owner login.
7. Record any operationally significant change in the changelog.

Never edit an applied migration or allow independent Vercel auto-deploys to bypass order.

## Health checks

```bash
curl --fail --silent --show-error https://<api-domain>/api/home
curl --fail --silent --show-error https://<frontend-domain>/
curl --fail --silent --show-error https://<frontend-domain>/robots.txt
curl --fail --silent --show-error https://<frontend-domain>/sitemap.xml
```

Test contact/analytics with controlled data; do not generate fake personal submissions in production.

## Incident triage

1. Declare severity and start a timestamped incident log.
2. Identify frontend, API, database/Auth/Storage, integration, or deployment scope.
3. Check recent deployments/configuration first, then provider status and logs.
4. Contain without destroying evidence.
5. Communicate current impact, workaround, and next update time.

Suggested severity: SEV-1 security/data loss or total outage; SEV-2 major function unavailable; SEV-3 degraded/non-critical; SEV-4 routine defect.

## Playbooks

### Frontend unavailable

- Check Vercel deployment/logs/domain and last workflow.
- Verify required environment variables and backend reachability.
- Redeploy last known-good application commit if schema-compatible.

### API unavailable or returning 500

- Request `/api/home`; inspect Vercel logs for config/database failures.
- Verify `SUPABASE_URL`, anonymous key, project health, RLS, and migration state.
- Roll back API code only if compatible. Do not use a service-role key as a workaround.

### Bad schema migration

- Stop dependent releases.
- Assess data integrity and take a fresh backup if safe.
- Create, review, and deploy a forward corrective migration.
- Restore only when correction cannot preserve integrity and incident authority approves.

### Contact abuse

- Preserve minimal aggregate evidence; avoid storing attacker payloads unnecessarily.
- Tighten/temporarily disable endpoint at the application boundary.
- Move to a shared limiter/WAF rule for distributed abuse.
- Never expose contact rows during investigation.

### Cache stale

- Inspect webhook status, URL, header secret, payload schema/table, and frontend logs.
- Rotate the secret if exposure is suspected and update both consumers.
- Redeploy frontend for urgent invalidation; normal TTL is 300 seconds.

### GitHub sync failing

- Inspect `sync_runs`, account status/failures/`next_sync_at`, function logs, and GitHub rate limit.
- Verify function/Vault secrets and optional token.
- Pause the account if repeated failures create noise; public content is unaffected.

### Credential exposure

- Revoke/rotate immediately in the provider.
- Update all consumers and test.
- Search repository history, build logs, function logs, and tickets for exposure scope.
- Follow [Security](SECURITY.md) incident steps and notify as required.

## Rollback and recovery

- Application: deploy a known-good commit.
- Database: forward-fix by default; use restore procedure in [Backup and restore](BACKUP_RESTORE.md) only with explicit incident decision.
- Content: update canonical row, then revalidate.
- Integration: pause account/function/Cron; imported pending data cannot publish itself.

## Secret rotation checklist

Inventory dependents → generate replacement → update secret stores/environments → deploy/restart → test → revoke old → inspect logs → record date/owner. For shared webhook/Cron secrets, update receiver and sender within the shortest possible overlap.

## Post-incident

Within five business days for serious incidents, document timeline, impact, detection, root cause, contributing factors, response, recovery, and corrective actions with owners/dates. Update tests, runbooks, monitoring, and ADRs.

