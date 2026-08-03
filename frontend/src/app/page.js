import Link from "next/link";
import { content } from "./content";
import { getProjects, getSiteContent, getSkills, safely } from "./data";

const Arrow = () => <span aria-hidden="true">↗</span>;
const SectionNote = ({ children }) => <p className="section-note" role="status">{children}</p>;
const metadataFallback = {
  title: "CareerOS — Ahamed's living career record",
  description: "CareerOS connects Ahamed's projects, skills, research, credentials, and writing in a living professional record powered by Supabase.",
};

export const revalidate = 300;

export async function generateMetadata() {
  const { data } = await safely(getSiteContent, {});
  return { ...metadataFallback, ...(data?.seo || {}) };
}

export default async function Home() {
  const [siteResult, projectResult, skillResult] = await Promise.all([
    safely(getSiteContent, content),
    safely(getProjects, content.projects),
    safely(getSkills, content.skills),
  ]);
  const profile = { ...content.profile, ...(siteResult.data?.profile || {}) };
  const projects = Array.isArray(projectResult.data) ? projectResult.data : [];
  const skills = Array.isArray(skillResult.data) ? skillResult.data : [];
  const skillNames = skills.flatMap((skill) => Array.isArray(skill.items) ? skill.items : (skill.name ? [skill.name] : []));

  return <main>
    <section className="hero">
      <div className="eyebrow"><i /> {profile.availability}</div>
      <p className="kicker">Hello, I’m {profile.name}.</p>
      <h1>I build <em>useful systems</em><br />for ambitious ideas.</h1>
      <p className="lede">{profile.summary}</p>
      <div className="actions"><Link className="button primary" href="/projects">Explore selected work <Arrow /></Link><Link className="button" href="/contact">Start a conversation</Link></div>
      <div className="quick-facts"><span>Based in<br /><b>{profile.location}</b></span><span>Focus<br /><b>Engineering · AI · Product</b></span><span>Current<br /><b>Building CareerOS</b></span></div>
    </section>

    <section className="section recruiter-keep" id="projects"><div className="section-head"><div><p className="overline">01 / Selected work</p><h2>Work with a reason<br />to <em>exist.</em></h2></div><Link href="/projects">View all projects →</Link></div>
      {projectResult.unavailable && <SectionNote>Live project updates are unavailable; showing a curated selection.</SectionNote>}
      {projects.length ? <div className="project-grid">{projects.map((project, index) => <Link className="project-card" href={`/projects/${project.slug}`} key={project.id || project.slug}><span className="project-no">0{index + 1}</span><div className={`project-visual visual-${index + 1}`}><span>{project.title}</span></div><p className="tags">{(project.tags || project.tech_stack || []).join(" · ")}</p><h3>{project.title} <Arrow /></h3><p>{project.summary || project.description}</p>{project.impact && <strong>{project.impact}</strong>}</Link>)}</div> : <SectionNote>No public projects have been published yet. Please check back soon.</SectionNote>}
    </section>

    <section className="section statement"><p className="overline">02 / How I work</p><blockquote>“Clarity before complexity.<br /><em>Evidence before claims.</em>”</blockquote><p>I connect technical decisions to human outcomes, document the reasoning, and ship with care.</p></section>

    <section className="section recruiter-keep"><div className="section-head"><div><p className="overline">03 / Experience</p><h2>Practice, not<br /><em>posturing.</em></h2></div><Link href="/experience">Full experience →</Link></div><div className="timeline">{content.experience.map((item) => <article key={item.role}><time>{item.period}</time><div><h3>{item.role}</h3><b>{item.organisation}</b><p>{item.detail}</p></div></article>)}</div></section>
    <section className="section recruiter-keep compact"><div><p className="overline">Relevant skills</p><h2>Tools follow the <em>problem.</em></h2>{skillResult.unavailable && <SectionNote>Live skill updates are unavailable; showing core capabilities.</SectionNote>}</div>{skillNames.length ? <div className="skill-cloud">{skillNames.map(x => <span key={x}>{x}</span>)}</div> : <SectionNote>Skills evidence is being prepared for publication.</SectionNote>}</section>
    <section className="section recruiter-keep compact"><div><p className="overline">Latest credentials & research</p><h2>Always <em>learning.</em></h2></div><div>{content.credentials.slice(0,2).map(x=><p key={x.title}><b>{x.title}</b><br/><small>{x.issuer} · {x.date}</small></p>)}<Link href="/research">Read current research →</Link></div></section>
    <section className="contact-band recruiter-keep"><p>Have a hard problem worth solving?</p><h2>Let’s make it <em>clear.</em></h2><div className="actions"><a className="button primary" href="mailto:hello@ahamed.dev">hello@ahamed.dev <Arrow /></a><a className="button" href="/cv">View CV</a></div></section>
  </main>;
}
