# Privacy and data handling

## Purpose

This engineering document describes CareerOS data handling. It is not jurisdiction-specific legal advice or a substitute for a reviewed public privacy notice.

## Data collected

| Category | Fields | Purpose | Public? |
|---|---|---|---|
| Career/profile | Published identity, experience, projects, evidence, links | Operate portfolio | Chosen records are public |
| Contact | Name, email, message, timestamps/status | Respond to enquiries | No |
| Analytics | Event name, local path, optional subject type/slug, referrer hostname, time | Understand aggregate usage | No; owner-read |
| Owner Auth | Email, password verifier/session metadata managed by Supabase | Secure administration | No |
| Integration | Public GitHub repository metadata, sync/review state | Candidate content ingestion | No until curated canonical record is public |
| Technical/provider | Request/function/deployment logs | Security and reliability | No |

The application intentionally does not store analytics cookies, IP addresses in `analytics_events`, full referrer URLs, contact message content in analytics, or cross-site identifiers. Hosting/provider logs may independently process IP/user-agent data under provider configuration.

## Processing principles

Collect only what is needed; restrict by role; keep raw imports private; verify before publishing; define retention; support correction/deletion; and never reuse contact messages for analytics or marketing without a valid disclosed basis.

## Access and processors

- Supabase processes database, Auth, Storage, functions, and scheduled integration data.
- Vercel processes frontend/API requests and operational logs.
- GitHub supplies public repository metadata and hosts source/CI.
- Only the authorized owner and necessary infrastructure administrators should access private rows/logs.

Maintain a private inventory of regions, subprocessors, agreements, and access grants.

## Retention (proposed)

Targets are listed in [Data model](DATA_MODEL.md): contacts 12 months after resolution, analytics 13 months, sync/inbox/rejected imports 90 days, unapproved staging 30 days. These are not guaranteed until approved and automated. Legal/security holds may temporarily override deletion and must be documented.

## Requests and deletion

Provide a verified private channel for access, correction, or deletion requests. Verify identity proportionately, locate data across database/Storage/provider logs/backups, record the decision/deadline, delete or correct production data, allow backup expiry unless urgent erasure procedure applies, and confirm completion without exposing additional data.

## Public evidence

Public records and Storage objects may be cached or copied by third parties. Before publication, confirm consent/authority, redact unrelated people and systems, remove metadata, and publish only what is necessary. Removing from CareerOS cannot guarantee removal from external archives.

## Breach handling

Follow [Security](SECURITY.md) and [Runbook](RUNBOOK.md). Determine affected data/people, exposure period, containment, legal notification duties, and corrective action. Avoid broadening exposure during investigation.

## Cookies and local storage

Admin authentication uses HTTP-only access/refresh cookies with SameSite Lax and Secure in production. Theme preference uses browser local storage. Public analytics does not require a tracking cookie.

