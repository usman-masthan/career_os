import Link from "next/link";
import { getHome, optional, formatPeriod } from "./data";
import TrackedLink from "./components/TrackedLink";

const Arrow = () => <span aria-hidden="true">↗</span>;
const Empty = ({ children }) => <p className="section-note">{children}</p>;

export const revalidate = 300;

export async function generateMetadata() {
  const { data } = await optional(getHome, {});
  return data?.content?.seo || {};
}

export default async function Home() {
  const { data, unavailable } = await optional(getHome, {});
  const { content = {}, profile = {}, projects = [], skills = [], certifications = [], achievements = [], experiences = [], research = [] } = data;
  const labels = content.labels || {};
  const categories = skills.reduce((groups, skill) => {
    const category = skill.category || "Capability";
    groups[category] ||= [];
    groups[category].push(skill);
    return groups;
  }, {});
  const personSchema = profile.id ? {
    "@context": "https://schema.org", "@type": "Person", name: profile.display_name,
    jobTitle: profile.headline, description: profile.bio, url: profile.website_url,
    sameAs: [profile.linkedin_url, profile.github_url].filter(Boolean), knowsAbout: skills.map((skill) => skill.name),
  } : null;

  return <main>
    {personSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />}
    <section className="hero command-hero">
      <div className="hero-copy">
        <div className="eyebrow"><i /> {profile.availability || labels.status_unavailable}</div>
        <p className="kicker">{content.kicker}</p>
        <h1>{content.hero_title}<br/><em>{content.hero_emphasis}</em></h1>
        <p className="lede">{profile.bio}</p>
        <div className="actions">
          {content.actions?.projects?.href&&<Link className="button primary" href={content.actions.projects.href}>{content.actions.projects.label} <Arrow/></Link>}
          {content.actions?.cv?.href&&<TrackedLink className="button" href={content.actions.cv.href} eventName="cv_open">{content.actions.cv.label}</TrackedLink>}
          {content.actions?.contact?.href&&<Link className="text-action" href={content.actions.contact.href}>{content.actions.contact.label}</Link>}
        </div>
      </div>
      <aside className="identity-card" aria-label={`${profile.display_name || "Portfolio owner"} professional status`}>
        <div className="identity-top"><span>{labels.recruiter_brief}</span><span className="signal">{labels.current}</span></div>
        <div className="portrait-wrap"><img src={profile.avatar_url || "/profile-placeholder.svg"} alt={`Portrait of ${profile.display_name || "portfolio owner"}`}/><span className="portrait-fallback">{profile.initials || "?"}</span><div className="scan-line"/></div>
        <div className="identity-name"><p>{labels.profile}</p><h2>{profile.display_name}</h2><span>{profile.headline}</span></div>
        <div className="identity-meta"><span>{labels.base}<br/><b>{profile.location}</b></span><span>{labels.public_proof}<br/><b>{projects.length} {labels.security_cases}</b></span></div>
      </aside>
      <div className="quick-facts">{(content.quick_facts || []).map((fact, index) => <span key={fact.label}>{String(index + 1).padStart(2,"0")} / {fact.label}<br/><b>{fact.value}</b></span>)}</div>
    </section>

    <section className="recruiter-summary" aria-label={labels.recruiter_summary}>
      <p className="overline">{labels.recruiter_summary}</p>
      <dl>{(content.recruiter_summary || []).map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
    </section>

    {unavailable && <div className="section"><Empty>{labels.unavailable}</Empty></div>}

    <section className="section" id="capabilities"><div className="section-head"><div><p className="overline">{content.sections?.capabilities?.eyebrow}</p><h2>{content.sections?.capabilities?.title}<br/><em>{content.sections?.capabilities?.emphasis}</em></h2></div>{content.sections?.capabilities?.href&&<Link href={content.sections.capabilities.href}>{content.sections.capabilities.link_label}</Link>}</div>
      {Object.keys(categories).length ? <div className="capability-matrix">{Object.entries(categories).map(([category, items]) => <article key={category}><header><h3>{category}</h3><span>{items.length.toString().padStart(2,"0")}</span></header>{items.map(skill => <Link href={`/skills#${skill.slug}`} key={skill.id}><span className={`status-dot ${skill.verification_status === "verified" ? "verified" : ""}`}/>{skill.name}<small>{skill.verification_status}</small></Link>)}</article>)}</div> : <Empty>{labels.capabilities_empty}</Empty>}
    </section>

    <section className="section" id="projects"><div className="section-head"><div><p className="overline">{content.sections?.projects?.eyebrow}</p><h2>{content.sections?.projects?.title}<br/><em>{content.sections?.projects?.emphasis}</em></h2></div>{content.sections?.projects?.href&&<Link href={content.sections.projects.href}>{content.sections.projects.link_label}</Link>}</div>
      {projects.length ? <div className="project-grid">{projects.map((project,index) => <Link className="project-card" href={`/projects/${project.slug}`} key={project.id}><div className="card-index"><span>{labels.case_label} / {String(index+1).padStart(2,"0")}</span><b>{project.repository_url ? labels.repository_label : labels.case_study_label} <Arrow/></b></div><div className="project-visual"><span>{project.title.slice(0,2).toUpperCase()}</span><i/></div><p className="tags">{(project.tags || []).join(" · ")}</p><h3>{project.title}</h3><p>{project.recruiter_summary || project.summary}</p>{project.impact && <strong>{project.impact}</strong>}</Link>)}</div> : <Empty>{labels.projects_empty}</Empty>}
    </section>

    <HomeSignalSection config={content.sections?.certifications} href="/certifications"><div className="signal-list">{certifications.map(item => <article key={item.id}><span className={`status-dot ${item.verification_status === "verified" ? "verified" : ""}`}/><div><small>{item.issuer}</small><h3>{item.name}</h3></div><b>{item.verification_url ? labels.verification_available : labels.training_record}</b></article>)}</div></HomeSignalSection>
    <HomeSignalSection config={content.sections?.recognition} href="/achievements"><div className="signal-list">{achievements.map(item => <article key={item.id}><span>{item.achieved_at?.slice(0,4) || "—"}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></HomeSignalSection>
    <section className="section"><div className="section-head"><div><p className="overline">{content.sections?.experience?.eyebrow}</p><h2>{content.sections?.experience?.title}<br/><em>{content.sections?.experience?.emphasis}</em></h2></div>{content.sections?.experience?.href&&<Link href={content.sections.experience.href}>{content.sections.experience.link_label}</Link>}</div><div className="timeline">{experiences.map(item => <article key={item.id}><time>{formatPeriod(item.started_at,item.ended_at,item.location)}</time><div><h3>{item.role}</h3><b>{item.organisation}</b><p>{item.description}</p></div></article>)}</div></section>
    {research.length > 0 && <HomeSignalSection config={content.sections?.research} href="/research"><div className="article-stack">{research.map(item => <article key={item.id}><small>{item.status}</small><h3>{item.title}</h3><p>{item.abstract}</p></article>)}</div></HomeSignalSection>}
    <section className="contact-band"><p>{content.sections?.contact?.eyebrow}</p><h2>{content.sections?.contact?.title}<br/><em>{content.sections?.contact?.emphasis}</em></h2><div className="actions">{content.sections?.contact?.href&&<Link className="button primary" href={content.sections.contact.href}>{content.sections.contact.link_label} <Arrow/></Link>}{profile.linkedin_url && <TrackedLink className="button" href={profile.linkedin_url} details={{subject_type:"profile",subject_slug:"linkedin"}}>{content.sections?.contact?.linkedin_label}</TrackedLink>}</div></section>
  </main>;
}

function HomeSignalSection({config,children}){return <section className="section split-section"><div><p className="overline">{config?.eyebrow}</p><h2>{config?.title}<br/><em>{config?.emphasis}</em></h2>{config?.href&&<Link className="inline-link" href={config.href}>{config.link_label}</Link>}</div>{children}</section>}
