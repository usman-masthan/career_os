# Changelog

All notable user-visible and operationally significant changes should be recorded here. This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and intends to use semantic versioning once formal releases begin.

## [Unreleased]

### Added

- Comprehensive repository onboarding and implementation guide.
- Architecture, data model, API, security, operations, content, testing, recovery, privacy, observability, governance, and ADR documentation.

### Known limitations

- Admin area is a protected handoff rather than complete CRUD.
- Automated RLS, route integration, browser E2E, and accessibility suites remain to be added.
- In-memory API rate limits are not globally consistent across serverless instances.
- Retention, SLO, RPO/RTO, and alert policies are proposed until configured and approved.

## Maintenance rules

Use Added, Changed, Deprecated, Removed, Fixed, and Security headings. Link releases/tags when they exist. Do not disclose exploitable security details before remediation. Database-only operational corrections that affect users belong here; purely internal refactors usually do not.

