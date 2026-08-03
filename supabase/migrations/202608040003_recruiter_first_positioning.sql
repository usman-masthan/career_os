-- Focus the public portfolio on a credible, evidence-backed entry-level security story.
update public.profile set
  headline = 'Entry-Level Cybersecurity Professional',
  bio = 'Entry-level cybersecurity professional with hands-on projects in SOC operations, vulnerability assessment, security automation and cloud-native delivery. I investigate threats, secure applications and automate security workflows. Based in Sri Lanka and open to local or remote opportunities.',
  availability = 'Open to entry-level cybersecurity roles in Sri Lanka and remote',
  updated_at = now()
where slug = 'ahamed-usman';

update public.site_content set content = jsonb_build_object(
  'seo', jsonb_build_object(
    'title', 'Ahamed Usman — Entry-Level Cybersecurity Professional',
    'description', 'Hands-on cybersecurity projects in SOC operations, vulnerability assessment, network analysis and Python security automation.'
  ),
  'kicker', 'ENTRY-LEVEL CYBERSECURITY / PORTFOLIO',
  'hero_title', 'I investigate threats,',
  'hero_emphasis', 'secure and automate.',
  'quick_facts', jsonb_build_array(
    jsonb_build_object('label','TARGET','value','Entry-level cybersecurity roles'),
    jsonb_build_object('label','CORE STRENGTHS','value','Investigation · Assessment · Automation'),
    jsonb_build_object('label','PUBLIC PROOF','value','Three security repositories')
  ),
  'recruiter_summary', jsonb_build_array(
    jsonb_build_object('label','Target','value','Entry-level cybersecurity roles'),
    jsonb_build_object('label','Strengths','value','Investigation, vulnerability assessment and automation'),
    jsonb_build_object('label','Tools','value','Python, Linux, Nmap, OWASP ZAP and Docker'),
    jsonb_build_object('label','Availability','value','Sri Lanka and remote')
  )
), updated_at = now() where page_key = 'home';

update public.site_content set content = jsonb_build_object(
  'mark','AU',
  'brand_subtitle','ENTRY-LEVEL CYBERSECURITY',
  'footer_text','Hands-on security work, documented with restraint.',
  'navigation',jsonb_build_array(
    jsonb_build_object('label','Projects','href','/projects'),
    jsonb_build_object('label','Skills','href','/skills'),
    jsonb_build_object('label','Experience','href','/experience'),
    jsonb_build_object('label','About','href','/about'),
    jsonb_build_object('label','CV','href','/cv'),
    jsonb_build_object('label','Contact','href','/contact')
  )
), updated_at = now() where page_key = 'shell';

-- Only security projects appear in the homepage's primary proof section.
update public.projects set featured = (slug in (
  'agentic-soc-triage','secure-web-vapt-lab','explainable-netflow-ids'
)), display_order = case slug
  when 'agentic-soc-triage' then 10
  when 'secure-web-vapt-lab' then 20
  when 'explainable-netflow-ids' then 30
  when 'visualit' then 40
  else display_order end,
  updated_at = now();

update public.projects set
  recruiter_summary = 'A simulated SOC workflow for alert classification, P1-P4 prioritisation, SLA tracking, investigation and escalation.',
  scope = 'A controlled simulation of SOC alert handling. It does not represent production SOC employment or access to a live customer environment.',
  contribution = 'Designed and implemented the Python workflow, ticket structure, prioritisation logic, L1 investigation path, L2 escalation path and auditable decision logging.',
  architecture = 'Structured alerts move through classification, priority assignment, ticket state transitions, SLA checks and escalation, with each decision recorded for review.',
  process = 'Python automation, deterministic triage rules, structured incident records and evaluation using precision, recall and F1 where labelled test data is available.',
  limitations = 'The workflow uses simulated alerts and is not a replacement for a production SIEM, analyst judgement or validated incident-response procedures.',
  evidence_status = 'prepared'
where slug = 'agentic-soc-triage';

update public.projects set
  recruiter_summary = 'An authorized web-security assessment performed against OWASP Juice Shop in an isolated, localhost-restricted Docker lab.',
  scope = 'Testing is limited to an intentionally vulnerable OWASP Juice Shop instance running locally in an isolated Docker environment. No third-party systems are targeted.',
  contribution = 'Defined the rules of engagement, built the lab, performed service discovery and HTTP analysis, manually validated selected findings, documented remediation and retested controls.',
  architecture = 'A localhost-restricted Docker target is assessed through Nmap, OWASP ZAP and manual HTTP inspection while evidence and findings remain inside the lab.',
  process = 'Authorized scope definition, service discovery, passive scanning, manual validation, false-positive review, remediation guidance and selective retesting.',
  limitations = 'This is a demonstration lab, not a commercial penetration test. Findings apply only to the deliberately vulnerable local target and selected test conditions.',
  evidence_status = 'prepared'
where slug = 'secure-web-vapt-lab';

update public.projects set
  recruiter_summary = 'A Python network-monitoring project that identifies unusual traffic and explains the features that caused each alert.',
  scope = 'The project evaluates NetFlow-like demonstration data and focuses on analyst-readable anomaly detection rather than claiming production intrusion detection.',
  contribution = 'Built the feature-processing, z-score and Isolation Forest workflow, anomaly explanations, evaluation outputs and false-positive troubleshooting guidance.',
  architecture = 'NetFlow-like records pass through feature engineering, statistical and Isolation Forest analysis, scoring, explanation and analyst review outputs.',
  process = 'Python, scikit-learn, z-score analysis, Isolation Forest and evaluation using precision, recall, F1, AUROC and false-positive rate where labels support them.',
  limitations = 'Results depend on the representativeness and labelling of demonstration data. An anomaly is not automatically a malicious event and requires analyst validation.',
  evidence_status = 'prepared'
where slug = 'explainable-netflow-ids';

-- Keep the homepage capability list short and defensible. General development
-- technologies remain available on the full skills page as engineering foundations.
update public.skills set featured = false, updated_at = now();
update public.skills set featured = true,
  display_order = case slug
    when 'security-automation' then 10 when 'web-vulnerability-assessment' then 20
    when 'anomaly-detection' then 30 when 'python' then 40
    when 'linux-fundamentals' then 50 when 'secure-ci-cd' then 60
    when 'docker' then 70 when 'owasp-zap' then 80
    when 'nmap' then 90 else 100 end,
  category = case
    when slug in ('python','linux-fundamentals','docker') then 'Engineering foundations'
    when slug in ('owasp-zap','nmap') then 'Security tools'
    else 'Security capabilities' end,
  updated_at = now()
where slug in ('security-automation','web-vulnerability-assessment','anomaly-detection','python','linux-fundamentals','secure-ci-cd','docker','owasp-zap','nmap');

update public.research set featured = false, updated_at = now()
where verification_url is null;
