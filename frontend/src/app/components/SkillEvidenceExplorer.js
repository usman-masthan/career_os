"use client";

import { useEffect, useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function VerificationLink({ record }) {
  if (!record.verification_url) return <span className="verification muted">{record.verification_status || "unverified"}</span>;
  return <a className="verification" href={record.verification_url} target="_blank" rel="noreferrer">Verify evidence ↗</a>;
}

export default function SkillEvidenceExplorer() {
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [message, setMessage] = useState("Loading skills…");

  useEffect(() => {
    fetch(`${apiBase}/skills`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load skills")))
      .then((items) => {
        setSkills(items);
        if (items.length) setSelected(items[0].slug);
        else setMessage("No visible skills have been published yet.");
      })
      .catch((error) => setMessage(error.message));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setEvidence(null);
    setMessage("Loading connected evidence…");
    fetch(`${apiBase}/skills/${encodeURIComponent(selected)}/evidence`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load skill evidence")))
      .then((item) => { setEvidence(item); setMessage(""); })
      .catch((error) => setMessage(error.message));
  }, [selected]);

  return <div className="skill-explorer">
    <div className="skill-picker" role="list" aria-label="Select a skill">
      {skills.map((skill) => <button key={skill.id} type="button" className={selected === skill.slug ? "active" : ""} onClick={() => setSelected(skill.slug)} aria-pressed={selected === skill.slug}>{skill.name}</button>)}
    </div>
    <div className="evidence-panel" aria-live="polite">
      {!evidence && <p className="evidence-message">{message}</p>}
      {evidence && <>
        <header><small>{evidence.category || "Capability evidence"}</small><h2>{evidence.name}</h2><p>{evidence.description}</p><VerificationLink record={evidence} /></header>
        <EvidenceGroup title="Projects" empty="No public projects connected yet.">
          {evidence.projects.map((project) => <article key={project.id}><h3>{project.title}</h3><p>{project.skill_context || project.summary}</p><VerificationLink record={project} />
            {project.evidence?.length > 0 && <ul>{project.evidence.map((item) => <li key={item.id}><span><b>{item.title}</b>{item.description && <small>{item.description}</small>}</span><VerificationLink record={item} /></li>)}</ul>}
          </article>)}
        </EvidenceGroup>
        <EvidenceGroup title="Credentials" empty="No public credentials connected yet.">{evidence.credentials.map((item) => <article key={item.id}><h3>{item.name}</h3><p>{item.issuer}{item.issued_at ? ` · ${item.issued_at}` : ""}</p><VerificationLink record={item} /></article>)}</EvidenceGroup>
        <EvidenceGroup title="Achievements" empty="No public achievements connected yet.">{evidence.achievements.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.description}</p><VerificationLink record={item} /></article>)}</EvidenceGroup>
      </>}
    </div>
  </div>;
}

function EvidenceGroup({ title, empty, children }) {
  return <section className="evidence-group"><div className="evidence-heading"><h2>{title}</h2><span>{children.length}</span></div>{children.length ? <div className="evidence-records">{children}</div> : <p className="evidence-message">{empty}</p>}</section>;
}
