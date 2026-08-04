# Backup and restore

## Status

This is the required procedure and policy template. Supabase plan-specific backup/PITR availability and actual schedules must be verified in the production project before claiming compliance.

## Objectives (proposed)

- RPO: 24 hours normally; 15 minutes if point-in-time recovery is enabled.
- RTO: 4 hours for core public content, 8 hours for integrations/media reconciliation.
- Restore drill: quarterly and before major migration programs.

## Scope

Back up PostgreSQL schema/data, Auth configuration/user recovery requirements, Storage objects, Edge Function source (Git), function/Vault secret inventory (not values), Vercel/GitHub configuration inventory, and DNS/domain ownership. Git is not a database or media backup.

## Before a material migration

1. Confirm latest managed backup status and retention.
2. Export an encrypted logical backup when policy requires it.
3. Record migration/version and backup timestamp in the private change ticket.
4. Verify restore credentials and free destination capacity.
5. Run dry-run and test upgrade on non-production data.

Backups containing personal data are sensitive: encrypt, restrict access, log retrieval, and never commit them.

## Restore decision

Prefer a forward corrective migration. Restore only for irreparable corruption, accidental bulk deletion, or platform disaster. Incident lead and data owner approve the restore point because recovery may discard newer writes.

## Restore procedure

1. Contain writes and pause Cron/integrations/deployments.
2. Identify the last known-good point and quantify expected data loss.
3. Restore to a separate project/database when possible.
4. Validate row counts, constraints, RLS/grants, owner access, public/private separation, and representative records.
5. Reconcile Storage objects and database paths.
6. Rotate credentials if the incident involved exposure.
7. Switch/recover application connectivity in dependency order.
8. Smoke-test all critical flows and monitor.
9. Resume integrations only after canonical content integrity is confirmed.
10. Document actual RPO/RTO and lost/replayed writes.

## Restore drill evidence

Record date, backup identifier (non-secret), isolated target, duration, checks performed, result, gaps, and actions. Delete drill data securely after evidence is retained.

