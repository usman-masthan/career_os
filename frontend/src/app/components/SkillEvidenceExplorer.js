"use client";

import { useEffect, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL;

function VerificationLink({ record, copy }) {
  if (!record.verification_url) return <span className="verification muted">{record.verification_status || copy.unverified_label}</span>;
  return <a className="verification" href={record.verification_url} target="_blank" rel="noreferrer">{copy.verify_label}</a>;
}

export default function SkillEvidenceExplorer({ copy }) {
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [message, setMessage] = useState(copy.loading_skills);

  useEffect(() => {
    if (!apiBase) { setMessage(copy.api_unavailable); return; }
    fetch(`${apiBase}/skills`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(copy.skills_error)))
      .then((items) => {
        setSkills(items);
        if (items.length) setSelected(items[0].slug);
        else setMessage(copy.skills_empty);
      })
      .catch((error) => setMessage(error.message));
  }, [copy.api_unavailable, copy.skills_empty, copy.skills_error]);

  useEffect(() => {
    if (!selected) return;
    setEvidence(null);
    setMessage(copy.loading_evidence);
    fetch(`${apiBase}/skills/${encodeURIComponent(selected)}/evidence`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(copy.evidence_error)))
      .then((item) => { setEvidence(item); setMessage(""); })
      .catch((error) => setMessage(error.message));
  }, [selected, copy.evidence_error, copy.loading_evidence]);

  return <div className="skill-explorer">
    <div className="skill-picker" role="list" aria-label={copy.picker_label}>
      {skills.map((skill) => <button key={skill.id} type="button" className={selected === skill.slug ? "active" : ""} onClick={() => setSelected(skill.slug)} aria-pressed={selected === skill.slug}>{skill.name}</button>)}
    </div>
    <div className="evidence-panel" aria-live="polite">
      {!evidence && <p className="evidence-message">{message}</p>}
      {evidence && <>
        <header><small>{evidence.category || copy.capability_label}</small><h2>{evidence.name}</h2><p>{evidence.description}</p><VerificationLink record={evidence} copy={copy} /></header>
        <EvidenceGroup title={copy.projects_label} empty={copy.projects_empty}>
          {evidence.projects.map((project) => <article key={project.id}><h3>{project.title}</h3><p>{project.skill_context || project.summary}</p><VerificationLink record={project} copy={copy} />
            {project.evidence?.length > 0 && <ul>{project.evidence.map((item) => <li key={item.id}><span><b>{item.title}</b>{item.description && <small>{item.description}</small>}</span><VerificationLink record={item} copy={copy} /></li>)}</ul>}
          </article>)}
        </EvidenceGroup>
        <EvidenceGroup title={copy.credentials_label} empty={copy.credentials_empty}>{evidence.credentials.map((item) => <article key={item.id}><h3>{item.name}</h3><p>{item.issuer}{item.issued_at ? ` · ${item.issued_at}` : ""}</p><VerificationLink record={item} copy={copy} /></article>)}</EvidenceGroup>
        <EvidenceGroup title={copy.achievements_label} empty={copy.achievements_empty}>{evidence.achievements.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.description}</p><VerificationLink record={item} copy={copy} /></article>)}</EvidenceGroup>
      </>}
    </div>
  </div>;
}

function EvidenceGroup({ title, empty, children }) {
  return <section className="evidence-group"><div className="evidence-heading"><h2>{title}</h2><span>{children.length}</span></div>{children.length ? <div className="evidence-records">{children}</div> : <p className="evidence-message">{empty}</p>}</section>;
}
