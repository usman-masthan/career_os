-- Initial normalized portfolio records. After this migration, Supabase is the
-- only source of personal and career data used by the application.
insert into public.profile (
  slug, display_name, headline, bio, location, avatar_url, website_url,
  email, phone, linkedin_url, github_url, availability, initials,
  visibility, featured, source_platform, external_identifier
) values (
  'ahamed-usman', 'Ahamed Usman',
  'Cybersecurity | DevSecOps | Cloud Security Engineer',
  'Aspiring Security Engineer with hands-on experience in DevSecOps, cloud security, web vulnerability assessment and Python automation. Skilled in securing cloud-native systems, building CI/CD pipelines and researching AI backdoor attacks, with a strong focus on resilient, scalable and threat-aware solutions.',
  'Sri Lanka · Open to remote', '/profile.jpeg', 'https://ahamed.dev',
  'ahamedusman0104@gmail.com', '+94 76 112 0339',
  'https://linkedin.com/in/ahamed-usman', 'https://github.com/usman-masthan',
  'Open to cybersecurity, DevSecOps and cloud security opportunities', 'AU',
  'public', true, 'manual', 'primary-profile'
)
on conflict (slug) do update set
  display_name = excluded.display_name, headline = excluded.headline,
  bio = excluded.bio, location = excluded.location, avatar_url = excluded.avatar_url,
  website_url = excluded.website_url, email = excluded.email, phone = excluded.phone,
  linkedin_url = excluded.linkedin_url, github_url = excluded.github_url,
  availability = excluded.availability, initials = excluded.initials,
  visibility = excluded.visibility, featured = excluded.featured, updated_at = now();

do $$
declare owner_profile_id uuid;
begin
  select id into owner_profile_id from public.profile where slug = 'ahamed-usman';

  insert into public.projects (
    profile_id, slug, title, summary, description, project_url, repository_url,
    tags, impact, challenge, approach, outcome, visibility, featured,
    source_platform, external_identifier
  ) values
    (owner_profile_id, 'agentic-soc-triage', 'SOC Incident Triage & Support Automation',
     'A Python-based simulated SOC workflow that receives security alerts, prioritises them and manages them through L1 and L2 support processes.',
     'A simulated, auditable security-operations workflow.', null, 'https://github.com/usman-masthan/agentic-soc-triage',
     array['SOC operations','Incident response','Python automation','L1/L2 support'],
     'Structured triage, SLA tracking, escalation and auditable decision logs',
     'Security alerts need consistent severity classification, P1–P4 prioritisation, SLA tracking and clear escalation paths.',
     'The simulated workflow creates structured incident tickets, supports L1 investigation and L2 escalation, and records troubleshooting actions, stakeholder updates, closure notes and auditable decisions.',
     'The project evaluates triage performance using precision, recall and F1 and may compare rule-based triage with AI-assisted recommendations.',
     'public', true, 'manual', 'agentic-soc-triage'),
    (owner_profile_id, 'visualit', 'VisuaLit — Award-Winning AI Reading Platform',
     'A production AI-powered reading platform designed to improve reading, visualisation and accessibility for diverse users.',
     'Production engineering and release work for an accessible reading platform.', 'https://www.visualit.app/', null,
     array['Flutter','Python','Firebase','Google Cloud Platform','CI/CD','Android'],
     'Contributed to a project recognised through several major Sri Lankan technology competitions',
     'The production application needed reliable Android builds, releases, navigation and cross-device experiences.',
     'Resolved Android build and dependency failures, improved CI/CD and Google Play Store release reliability, conducted functional and regression testing, and fixed UI, navigation and stability issues.',
     'Supported release integrity, production readiness, performance improvements, device compatibility and accessible cross-device usability.',
     'public', true, 'manual', 'visualit'),
    (owner_profile_id, 'explainable-netflow-ids', 'Explainable Network Anomaly Detection',
     'A Python-based network-monitoring system that detects unusual network traffic and explains why an event was flagged.',
     'An explainable network anomaly-detection workflow.', null, 'https://github.com/usman-masthan/explainable-netflow-ids',
     array['Network security','Python','scikit-learn','Isolation Forest'],
     'Analyst-friendly anomaly scores, charts and explanations',
     'Unusual network activity must be identified while distinguishing suspicious traffic from legitimate anomalies such as scheduled backups.',
     'The system processes NetFlow-like records, engineers traffic features, and uses z-score analysis and Isolation Forest with false-positive troubleshooting and monitoring runbooks.',
     'It evaluates precision, recall, F1, AUROC and false-positive rates and produces explainable outputs for analyst review.',
     'public', true, 'manual', 'explainable-netflow-ids'),
    (owner_profile_id, 'secure-web-vapt-lab', 'Secure Web Application VAPT Lab',
     'An authorised vulnerability assessment conducted against intentionally vulnerable OWASP Juice Shop in a local, isolated, localhost-restricted Docker environment.',
     'An ethical, scoped web-application security laboratory.', null, 'https://github.com/usman-masthan/secure-web-vapt-lab',
     array['VAPT','OWASP ZAP','Nmap','Docker','HTTP analysis'],
     'Structured evidence, validation, remediation guidance and retesting',
     'Web security findings require a defined scope, ethical rules of engagement, evidence and careful separation of confirmed issues from informational findings and false positives.',
     'The laboratory deploys OWASP Juice Shop locally, performs Nmap service discovery, analyses HTTP traffic with OWASP ZAP and manually validates selected findings.',
     'It documents evidence, impact and remediation, retests selected controls and produces a structured VAPT report.',
     'public', true, 'manual', 'secure-web-vapt-lab')
  on conflict (profile_id, slug) do update set
    title = excluded.title, summary = excluded.summary, description = excluded.description,
    project_url = excluded.project_url, repository_url = excluded.repository_url,
    tags = excluded.tags, impact = excluded.impact, challenge = excluded.challenge,
    approach = excluded.approach, outcome = excluded.outcome,
    visibility = excluded.visibility, featured = excluded.featured, updated_at = now();

  insert into public.experiences (
    profile_id, organisation, role, description, location, started_at, ended_at,
    visibility, featured, source_platform, external_identifier
  ) values
    (owner_profile_id, 'SkillVerse (PVT) Ltd', 'Software Engineering Intern',
     'Resolved Android build and dependency failures, improving secure CI/CD delivery and Google Play Store release integrity. Conducted functional and regression testing, fixed UI, navigation and stability defects, and supported performance, accessibility, cross-device usability and production-release readiness for VisuaLit.',
     'Remote', '2025-08-01', '2026-07-31', 'public', true, 'manual', 'skillverse-intern'),
    (owner_profile_id, 'Third Space Global', 'Online Mathematics Tutor',
     'Delivered tailored one-to-one mathematics tutoring using digital tools, simplified complex concepts, adapted explanations to individual learning styles, and helped improve engagement and academic performance.',
     'Remote', '2024-02-01', '2024-09-30', 'public', false, 'manual', 'third-space-tutor')
  on conflict (profile_id, source_platform, external_identifier) do update set
    organisation = excluded.organisation, role = excluded.role,
    description = excluded.description, location = excluded.location,
    started_at = excluded.started_at, ended_at = excluded.ended_at,
    visibility = excluded.visibility, featured = excluded.featured, updated_at = now();

  insert into public.education (
    profile_id, institution, qualification, field_of_study, description,
    started_at, ended_at, visibility, featured, source_platform, external_identifier
  ) values (
    owner_profile_id, 'Informatics Institute of Technology, Colombo',
    'BSc (Hons)', 'Computer Science', 'In progress · Current GPA: 3.6',
    '2023-05-01', '2027-11-30', 'public', true, 'manual', 'iit-bsc-computer-science'
  ) on conflict (profile_id, source_platform, external_identifier) do update set
    institution = excluded.institution, qualification = excluded.qualification,
    field_of_study = excluded.field_of_study, description = excluded.description,
    started_at = excluded.started_at, ended_at = excluded.ended_at,
    visibility = excluded.visibility, featured = excluded.featured, updated_at = now();

  insert into public.credentials (
    profile_id, name, issuer, issued_at, visibility, featured,
    source_platform, external_identifier
  ) values
    (owner_profile_id, 'Cybersecurity and Cloud Fundamentals', 'Fortinet', null, 'public', true, 'manual', 'fortinet-nse-1'),
    (owner_profile_id, 'Introduction to Next Generation Firewall', 'Fortinet', null, 'public', true, 'manual', 'fortinet-nse-2'),
    (owner_profile_id, 'FortiGate Operator', 'Fortinet', null, 'public', true, 'manual', 'fortinet-nse-3')
  on conflict (profile_id, source_platform, external_identifier) do update set
    name = excluded.name, issuer = excluded.issuer, visibility = excluded.visibility,
    featured = excluded.featured, updated_at = now();

  insert into public.research (
    profile_id, slug, title, abstract, status, started_at,
    visibility, featured, source_platform, external_identifier
  ) values (
    owner_profile_id, 'federated-learning-backdoor-mitigation',
    'Mitigating stealthy backdoor attacks in non-IID federated-learning environments',
    'Conducting specialised research on mitigating stealthy backdoor attacks in non-IID federated-learning environments to improve AI-model robustness and integrity.',
    'Academic research · In progress', '2026-01-01', 'public', true, 'manual', 'federated-learning-research'
  ) on conflict (profile_id, slug) do update set
    title = excluded.title, abstract = excluded.abstract, status = excluded.status,
    started_at = excluded.started_at, visibility = excluded.visibility,
    featured = excluded.featured, updated_at = now();

  insert into public.achievements (
    profile_id, title, description, achieved_at, visibility, featured,
    source_platform, external_identifier
  ) values
    (owner_profile_id, 'Cisco Technopreneur 2025', 'VisuaLit team recognition · 1st Place · Investor’s Choice Award', '2025-01-01', 'public', true, 'manual', 'cisco-technopreneur-2025'),
    (owner_profile_id, 'Codesprint X', 'VisuaLit team recognition · 1st Runner-Up', '2025-01-01', 'public', true, 'manual', 'codesprint-x'),
    (owner_profile_id, 'Cutting Edge 2025', 'VisuaLit team recognition · 2nd Runner-Up', '2025-01-01', 'public', true, 'manual', 'cutting-edge-2025'),
    (owner_profile_id, 'NBQSA 2025', 'VisuaLit team recognition · Finalist', '2025-01-01', 'public', true, 'manual', 'nbqsa-2025')
  on conflict (profile_id, source_platform, external_identifier) do update set
    title = excluded.title, description = excluded.description,
    achieved_at = excluded.achieved_at, visibility = excluded.visibility,
    featured = excluded.featured, updated_at = now();

  insert into public.skills (
    profile_id, slug, name, category, visibility, featured,
    source_platform, external_identifier
  )
  select owner_profile_id,
         lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')),
         name, category, 'public', featured, 'manual',
         'skill-' || lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
  from (values
    ('DevSecOps Practices','Key competencies',true), ('Secure CI/CD','Key competencies',true),
    ('Infrastructure as Code','Key competencies',true), ('Cloud-Native Deployment','Key competencies',true),
    ('Security Automation','Key competencies',true), ('Web Vulnerability Assessment','Cybersecurity',true),
    ('Anomaly Detection','Cybersecurity',true), ('Security Research','Cybersecurity',true),
    ('Evidence Collection','Cybersecurity',false), ('Technical Documentation','Practice',false),
    ('Regression Testing','Practice',false), ('Functional Testing','Practice',false),
    ('OWASP ZAP','Security tools',true), ('Nmap','Security tools',true), ('curl','Security tools',false),
    ('Python','Programming',true), ('Bash','Programming',false), ('JavaScript','Programming',true),
    ('Node.js','Programming',true), ('Java','Programming',false),
    ('AWS','Cloud and DevOps',true), ('GCP','Cloud and DevOps',true), ('Firebase','Cloud and DevOps',false),
    ('Docker','Cloud and DevOps',true), ('Kubernetes','Cloud and DevOps',true), ('Terraform','Cloud and DevOps',true),
    ('GitHub Actions','Cloud and DevOps',true), ('Next.js','Systems and development',true),
    ('React','Systems and development',true), ('Flutter','Systems and development',true),
    ('Git','Systems and development',false), ('Linux Fundamentals','Systems and development',true),
    ('HTTP/HTTPS','Systems and development',false), ('scikit-learn','Systems and development',true)
  ) as seed(name, category, featured)
  on conflict (profile_id, name) do update set
    category = excluded.category, visibility = excluded.visibility,
    featured = excluded.featured, updated_at = now();
end $$;
