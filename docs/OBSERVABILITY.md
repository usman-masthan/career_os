# Observability

## Objectives

Detect user-visible failure, security-relevant anomalies, data pipeline problems, and releases that break critical flows without collecting unnecessary personal data.

## Signals

- Vercel frontend: request errors/latency, build/deploy failures, function logs.
- Vercel API: status/latency by route, 429 rate, Supabase operation failures.
- Supabase: database/Auth/Storage health, advisor findings, webhook delivery, Edge Function logs.
- Integration tables: failed `sync_runs`, consecutive failures, stale `last_synced_at`.
- GitHub Actions: failed/cancelled stages and release duration.

## Proposed service indicators and targets

| Indicator | Proposed target |
|---|---|
| Public frontend successful requests | 99.9% monthly |
| API successful eligible requests | 99.9% monthly |
| p95 API read latency | < 750 ms |
| Content update visible | < 5 minutes fallback; < 1 minute webhook normal |
| Scheduled GitHub sync freshness | Within configured interval + 30 minutes |

Targets are not guarantees until monitoring is configured and baselined.

## Alerts (proposed)

- SEV-1: suspected secret/data exposure, destructive data change, private record publicly readable.
- SEV-2: frontend/API 5xx or reachability above threshold for 5 minutes; database unavailable; deployment partially completed.
- SEV-3: webhook failures, five consecutive integration failures, elevated contact abuse, backup failure.

Every alert needs an owner, runbook link, actionable context, deduplication, and test schedule.

## Logging rules

Use structured event name, timestamp, environment, route/operation, safe status/code, deployment/version, and provider request ID. Never log tokens, Authorization/cookie headers, passwords, contact bodies/emails, full webhook payloads, raw imported private content, or service keys. Redact before export, not only in dashboards.

## Dashboards

Maintain views for availability/latency/error rate, deploy health, Supabase health/advisors, webhook delivery, integration freshness/failures, contact/analytics aggregate volume, and backup status. Link each panel to its runbook.

## Synthetic checks

Monitor frontend `/`, API `/api/home`, sitemap, and one stable project route from outside the hosting provider. Use non-mutating checks by default; test write flows in controlled scheduled jobs with explicit cleanup.

## Review cadence

Weekly: failed jobs/functions/webhooks. Monthly: SLOs, access and alert noise. Quarterly: restore and incident exercises, retention deletion evidence, threat model and dependency review.

