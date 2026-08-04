# ADR 0004: Review external imports before publishing

- Status: Accepted
- Date: 2026-08-04

## Context

External data may be inaccurate, unsafe, duplicated, irrelevant, or change without editorial intent.

## Decision

Ingest official-provider data into private `external_items`, preserve provenance and sync audits, default review to pending, and require human mapping to canonical public records. Keep secrets outside tables.

## Alternatives

Direct publishing was faster but could leak or misrepresent data. Scraping unsupported providers was rejected for reliability, compliance, and security reasons.

## Consequences

Public integrity improves at the cost of a manual review queue and operational tooling needs.

