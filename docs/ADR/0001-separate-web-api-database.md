# ADR 0001: Separate web, API, and database layers

- Status: Accepted
- Date: 2026-08-04

## Context

The portfolio needs server rendering and interactive UI, a stable policy/aggregation boundary, and relational persistence with authorization.

## Decision

Use Next.js for presentation, Express for the public application API, and Supabase for PostgreSQL/Auth/Storage/functions. Deploy frontend and API as separate Vercel projects.

## Alternatives

Direct Next.js-to-Supabase reduced components but coupled UI to persistence. A single monolithic server simplified deployment but weakened independent scaling and frontend platform features.

## Consequences

Boundaries and releases are clearer, but configuration, CORS, availability, and deployment ordering span more services. Contract changes must be coordinated.

