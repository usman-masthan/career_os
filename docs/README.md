# CareerOS documentation

This directory contains the durable technical and operational documentation for CareerOS. The root [README](../README.md) is the onboarding entry point.

## Document map

| Audience | Start here | Purpose |
|---|---|---|
| New developer | [Architecture](ARCHITECTURE.md), [Data model](DATA_MODEL.md), [Contributing](../CONTRIBUTING.md) | Understand and change the system |
| API consumer | [API](API.md) | Routes, payloads, errors, and limits |
| Content owner | [Content guide](CONTENT_GUIDE.md) | Safely create, review, and publish records |
| Reviewer/security engineer | [Security](SECURITY.md), [Testing](TESTING.md) | Verify controls and release quality |
| Operator/on-call | [Runbook](RUNBOOK.md), [Observability](OBSERVABILITY.md), [Backup and restore](BACKUP_RESTORE.md) | Operate and recover the service |
| Data/privacy reviewer | [Privacy](PRIVACY.md), [Data model](DATA_MODEL.md) | Understand collection, access, and retention |
| Architect | [ADRs](ADR/README.md) | Understand why major decisions were made |

## Status language

- **Implemented:** supported by repository code or migrations.
- **Configured externally:** designed here but must be enabled in Supabase, Vercel, or GitHub.
- **Proposed:** a target policy that requires owner approval or implementation.

If documentation conflicts with code, verify the behavior, fix the code or document in the same pull request, and record important design changes as an ADR.

