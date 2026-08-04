# ADR 0003: Model claims as an evidence graph

- Status: Accepted
- Date: 2026-08-04

## Context

Flat portfolio pages make capability claims difficult to verify and duplicate information across pages.

## Decision

Normalize profiles, projects, skills, credentials, achievements, research, publications, evidence, and media. Use relationship tables and verification/provenance fields. Keep editorial page copy in `site_content` JSONB.

## Alternatives

Markdown/static JSON was easier to host but weaker for relationships, workflow, authorization, and integration mapping. A fully generic graph store added unnecessary complexity.

## Consequences

The model supports evidence exploration and reuse, while requiring migrations, editorial discipline, and more complex aggregate queries.

