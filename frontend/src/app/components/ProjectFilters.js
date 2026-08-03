"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { sendEvent } from "./Analytics";

export default function ProjectFilters({ projects, copy }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [evidence, setEvidence] = useState("all");
  const tags = useMemo(() => [...new Set(projects.flatMap(project => project.tags || []))].sort(), [projects]);
  const visible = projects.filter(project => {
    const text = `${project.title} ${project.summary} ${(project.tags || []).join(" ")}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (tag === "all" || project.tags?.includes(tag)) && (evidence === "all" || project.evidence_status === evidence);
  });
  const evidenceLabel = project => project.repository_url ? copy.repository_label : copy.record_label;
  return <>
    <div className="filter-bar"><label><span>{copy.search_label}</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder={copy.search_placeholder}/></label><label><span>{copy.capability_label}</span><select value={tag} onChange={event => setTag(event.target.value)}><option value="all">{copy.all_capabilities}</option>{tags.map(item => <option key={item}>{item}</option>)}</select></label><label><span>{copy.evidence_label}</span><select value={evidence} onChange={event => setEvidence(event.target.value)}><option value="all">{copy.all_states}</option><option value="verified">{copy.verified}</option><option value="prepared">{copy.prepared}</option><option value="planned">{copy.planned}</option></select></label><output>{visible.length} / {projects.length} {copy.count_label}</output></div>
    <div className="project-list">{visible.map((project,index) => <Link href={`/projects/${project.slug}`} onClick={() => sendEvent("project_open",{subject_type:"project",subject_slug:project.slug})} key={project.id}><span>{String(index+1).padStart(2,"0")}</span><div><small>{evidenceLabel(project)} · {(project.tags || []).slice(0,3).join(" · ")}</small><h2>{project.title}</h2><p>{project.recruiter_summary || project.summary}</p></div><b>{copy.inspect_label}</b></Link>)}</div>
    {!visible.length && <p className="section-note">{copy.empty_message}</p>}
  </>;
}
