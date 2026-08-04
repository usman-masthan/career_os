# Content and evidence guide

## Principles

Publish accurate, scoped, verifiable claims. Prefer concrete contribution and outcome over adjectives. Distinguish what was built personally from team work, training labs, simulations, and plans. Never publish client secrets, credentials, personal data, active vulnerabilities, or material you lack permission to share.

## Record workflow

`Draft/private → evidence gathered → reviewed → public/unlisted → periodically verified → corrected/archived`

Imported items start `pending`; uploads start in the private staging bucket. Neither is approval.

## Writing standards

- Title: specific and understandable without internal context.
- Summary/recruiter summary: problem, contribution, result in 1–3 sentences.
- Challenge/scope: boundary, assumptions, constraints, and authorization.
- Approach/process: important decisions and validation, not a tool dump.
- Outcome/impact: attributable result; label estimates and simulations.
- Limitations: what was not tested, proven, or deployed.
- Verification: link to the best durable public source.
- Dates: use factual ISO dates; leave unknown values null rather than inventing precision.

## Slugs and ordering

Use lowercase ASCII words separated by hyphens. Treat a published slug as permanent. `display_order` sorts lower numbers first; leave space (10, 20, 30) for later inserts. `featured` is editorial promotion, not proof quality.

## Verification rubric

- `unverified`: owner assertion without independent/public proof.
- `pending`: evidence exists but review is incomplete.
- `verified`: source was checked, supports the exact claim, and is safe/public.
- `rejected`: evidence is invalid, unsafe, outdated, or does not support the claim.

Record the source URL when safe. Recheck external links and expiring credentials at least quarterly.

## Media review checklist

1. Upload to `project-evidence-staging` only.
2. Scan for malware and inspect hidden metadata.
3. Remove secrets, tokens, customer identifiers, emails, internal hosts/IPs, live findings, and unnecessary EXIF.
4. Confirm copyright/permission and that the artifact proves the stated claim.
5. Add concise alt text describing information, not appearance alone.
6. Publish the sanitized file to `project-evidence` and create `project_media`.
7. Test anonymous access and mobile rendering.

## `site_content` JSONB

Preserve the keys consumed by each page/component. Validate JSON, compare against the seeded object, preview empty/missing optional fields, and publish copy changes through a forward migration when they must be reproducible across environments. Do not embed secrets or private contact details in JSONB.

## Accessibility and SEO

Use one descriptive H1, logical headings, useful link text, plain language, alt text, and descriptive page title/description. Avoid keyword stuffing. Update canonical site/profile URL, sitemap, and Open Graph content when identity/domain changes.

## Editorial review

Before publishing: factual accuracy, authorization, privacy, security redaction, spelling, link validity, mobile layout, accessibility, evidence match, date/status, and cache invalidation. Record material corrections transparently in the changelog when users may have relied on the old claim.

