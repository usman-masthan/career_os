# ADR 0002: Make database RLS the authorization authority

- Status: Accepted
- Date: 2026-08-04

## Context

Most reads are public, operational writes are narrow, and owner records are sensitive. Application-only authorization could be bypassed by another access path.

## Decision

Express uses the Supabase anonymous key. RLS and column grants enforce public visibility and insert-only workflows. Owner mutations require an Auth JWT app-metadata claim. Service role is limited to privileged Edge Functions.

## Alternatives

Using service role in Express would simplify queries but make every API defect higher impact. Application-only checks would duplicate and weaken policy.

## Consequences

Database tests and careful grants are mandatory. Queries can fail until policies exist, but a compromised public runtime does not automatically gain unrestricted access.

