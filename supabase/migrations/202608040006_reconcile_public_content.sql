-- Restore nested homepage keys that were replaced by top-level jsonb merges in
-- the previous content migration. jsonb_set updates each nested object without
-- removing sibling keys.
update public.site_content
set content = jsonb_set(
  jsonb_set(
    content,
    '{labels}',
    coalesce(content -> 'labels', '{}'::jsonb) || '{
      "status_unavailable":"Portfolio status unavailable",
      "recruiter_brief":"RECRUITER BRIEF",
      "current":"CURRENT",
      "profile":"PROFILE",
      "base":"BASE",
      "public_proof":"PUBLIC PROOF",
      "security_cases":"SECURITY CASES",
      "recruiter_summary":"Recruiter summary",
      "unavailable":"Live portfolio records are temporarily unavailable.",
      "case_label":"CASE",
      "repository_label":"PUBLIC REPOSITORY",
      "case_study_label":"CASE STUDY",
      "projects_empty":"No featured projects have been published."
    }'::jsonb,
    true
  ),
  '{sections}',
  coalesce(content -> 'sections', '{}'::jsonb) || '{
    "capabilities":{
      "eyebrow":"01 / Capability matrix",
      "title":"Claims connected",
      "emphasis":"to proof.",
      "href":"/skills",
      "link_label":"Inspect evidence →"
    },
    "projects":{
      "eyebrow":"02 / Featured operations",
      "title":"Work that survives",
      "emphasis":"inspection.",
      "href":"/projects",
      "link_label":"All case studies →"
    }
  }'::jsonb,
  true
), updated_at = now()
where page_key = 'home';

-- A record cannot be publicly described as verified when it has no public
-- verification destination. It remains visible as a training record.
update public.credentials
set verification_status = 'unverified', updated_at = now()
where verification_status = 'verified'
  and nullif(trim(coalesce(verification_url, '')), '') is null
  and nullif(trim(coalesce(credential_url, '')), '') is null;
