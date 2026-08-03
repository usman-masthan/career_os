import { notFound } from "next/navigation";
import { content } from "../../content";

export function generateStaticParams() { return content.projects.map(({ slug }) => ({ slug })); }
export function generateMetadata({ params }) { const project = content.projects.find(x=>x.slug===params.slug); return project ? { title: project.title, description: project.summary } : {}; }

export default function CaseStudy({ params }) {
  const project = content.projects.find(x=>x.slug===params.slug); if (!project) notFound();
  return <main className="page case-study"><header className="page-title"><p className="overline">Project case study</p><h1>{project.title}</h1><p>{project.summary}</p><div className="skill-cloud">{project.tags.map(x=><span key={x}>{x}</span>)}</div></header>
    <div className="case-impact"><small>Headline outcome</small><strong>{project.impact}</strong></div>
    <div className="case-sections"><section><span>01</span><h2>Challenge</h2><p>{project.challenge}</p></section><section><span>02</span><h2>Approach</h2><p>{project.approach}</p></section><section><span>03</span><h2>Outcome</h2><p>{project.outcome}</p></section></div>
  </main>;
}
