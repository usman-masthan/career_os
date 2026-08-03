import { notFound } from "next/navigation";
import { getProject, getSiteContent, optional } from "../../data";
import TrackedLink from "../../components/TrackedLink";

const storageBase = process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-evidence/` : "";
const Verification = ({ item, label }) => item.verification_url ? <TrackedLink className="verification" href={item.verification_url} details={{subject_type:"evidence",subject_slug:item.id}}>{label}</TrackedLink> : null;

export async function generateMetadata({ params }) {
  const { data: project } = await optional(() => getProject(params.slug), null);
  return project ? { title: project.title, description: project.recruiter_summary || project.summary, alternates:{canonical:`/projects/${project.slug}`}, openGraph:{title:project.title,description:project.summary,type:"article"} } : {};
}

export default async function CaseStudy({ params }) {
  const [{ data: project }, { data: copy }] = await Promise.all([
    optional(() => getProject(params.slug), null), optional(() => getSiteContent("project_case"), {}),
  ]);
  if (!project) notFound();
  const skills=(project.project_skills||[]).map(item=>item.skills).filter(Boolean);
  const media=project.project_media||[]; const evidence=project.project_evidence||[];
  const schema={"@context":"https://schema.org","@type":"SoftwareSourceCode",name:project.title,description:project.summary,codeRepository:project.repository_url,url:project.project_url,programmingLanguage:(project.tags||[])};
  return <main className="page case-study"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    <header className="case-header"><div><p className="overline">{copy.case_file} / {project.repository_url ? copy.public_repository : copy.project_record}</p><h1>{project.title}</h1><p>{project.recruiter_summary||project.summary}</p><div className="skill-cloud">{(project.tags||[]).map(tag=><span key={tag}>{tag}</span>)}</div><div className="actions">{project.repository_url&&<TrackedLink className="button primary" href={project.repository_url} details={{subject_type:"project",subject_slug:project.slug}}>{copy.view_repository}</TrackedLink>}{project.project_url&&<TrackedLink className="button" href={project.project_url} details={{subject_type:"project",subject_slug:project.slug}}>{copy.live_project}</TrackedLink>}</div></div><aside className="case-brief"><span>{copy.headline_outcome}</span><strong>{project.impact}</strong><dl><div><dt>{copy.evidence_label}</dt><dd>{evidence.length}</dd></div><div><dt>{copy.media_label}</dt><dd>{media.length}</dd></div><div><dt>{copy.skills_label}</dt><dd>{skills.length}</dd></div></dl></aside></header>
    {Array.isArray(project.metrics)&&project.metrics.length>0&&<section className="metric-strip">{project.metrics.map(metric=><div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.context}</small></div>)}</section>}
    <div className="case-sections">{(copy.sections||[]).map((section,index)=>[String(index+1).padStart(2,"0"),section.title,project[section.field]||project[section.fallback]]).filter(([, ,body])=>body).map(([number,title,body])=><section key={number}><span>{number}</span><h2>{title}</h2><p>{body}</p></section>)}</div>
    {evidence.length > 0 && <section className="evidence-section"><div className="section-head"><div><p className="overline">{copy.evidence_heading}</p><h2>{copy.evidence_title}<br/><em>{copy.evidence_emphasis}</em></h2></div></div><div className="evidence-grid">{evidence.map(item=><article key={item.id}><small>{item.evidence_type}</small><h3>{item.title}</h3><p>{item.description}</p><Verification item={item} label={copy.view_source}/></article>)}</div></section>}
    {media.length > 0 && <section className="media-section"><p className="overline">{copy.project_media}</p><div className="media-grid">{media.map(item=><figure key={item.id}>{item.media_type==="image"&&<img src={item.storage_path?`${storageBase}${item.storage_path}`:item.external_url} alt={item.alt_text||item.title}/>}<figcaption><b>{item.title}</b>{item.caption&&<span>{item.caption}</span>}</figcaption></figure>)}</div></section>}
    {skills.length>0&&<section className="related-skills"><p className="overline">{copy.connected_capabilities}</p><div className="skill-cloud">{skills.map(skill=><span key={skill.id}>{skill.name} · {skill.verification_status}</span>)}</div></section>}
  </main>;
}
