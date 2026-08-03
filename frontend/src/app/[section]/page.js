import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "../content";

const sections = {
  about: { eyebrow: "About", title: "Engineering with intent.", intro: content.profile.summary, body: ["I care about the whole path from an ambiguous question to a dependable product. That means listening closely, modelling the problem, making trade-offs visible, and leaving systems easier to understand than I found them.", "CareerOS makes that practice inspectable. It connects outcomes to projects, skills to evidence, and ongoing learning to the work it improves."] },
  experience: { eyebrow: "Experience", title: "A practice built by doing.", intro: "Roles matter. The decisions, outcomes, and learning behind them matter more." },
  research: { eyebrow: "Research", title: "Questions worth staying with.", intro: "Working inquiries across applied AI, evidence systems, and humane software." },
  skills: { eyebrow: "Capabilities", title: "A toolkit, not a checklist.", intro: "Skills are grouped by how they contribute to shipping clear, responsible products." },
  credentials: { eyebrow: "Credentials", title: "Learning with receipts.", intro: "Recent learning and verified development, kept close to the work it informs." },
  achievements: { eyebrow: "Achievements", title: "Outcomes over applause.", intro: "Milestones that reflect sustained practice: shipping CareerOS, establishing an evidence-led workflow, and turning independent research into reusable product thinking." },
  writing: { eyebrow: "Writing / Updates", title: "Notes from the work.", intro: "Short field notes on engineering decisions, applied AI, accessible interfaces, and building CareerOS in public." },
  contact: { eyebrow: "Contact", title: "Let’s make it clear.", intro: "If you have a useful problem, a thoughtful team, or an idea that needs a technical path, I’d like to hear about it." },
  projects: { eyebrow: "Projects", title: "Selected work.", intro: "Products and experiments presented with their context, decisions, and outcomes." }
};

export function generateMetadata({ params }) { const page = sections[params.section]; return page ? { title: page.eyebrow, description: page.intro } : {}; }

export default function SectionPage({ params }) {
  const page = sections[params.section]; if (!page) notFound();
  return <main className="page"><header className="page-title"><p className="overline">Ahamed.dev / {page.eyebrow}</p><h1>{page.title}</h1><p>{page.intro}</p></header>
    {params.section === "projects" && <div className="project-list">{content.projects.map((x,i)=><Link href={`/projects/${x.slug}`} key={x.slug}><span>0{i+1}</span><div><h2>{x.title}</h2><p>{x.summary}</p><small>{x.tags.join(" · ")}</small></div><b>View case study ↗</b></Link>)}</div>}
    {params.section === "experience" && <div className="timeline">{content.experience.map(x=><article key={x.role}><time>{x.period}</time><div><h2>{x.role}</h2><b>{x.organisation}</b><p>{x.detail}</p></div></article>)}</div>}
    {params.section === "research" && <div className="article-grid">{content.research.map(x=><article key={x.title}><small>{x.status}</small><h2>{x.title}</h2><p>{x.abstract}</p></article>)}</div>}
    {params.section === "skills" && <div className="article-grid">{content.skills.map(x=><article key={x.group}><small>Capability area</small><h2>{x.group}</h2><div className="skill-cloud">{x.items.map(y=><span key={y}>{y}</span>)}</div></article>)}</div>}
    {params.section === "credentials" && <div className="article-grid">{content.credentials.map(x=><article key={x.title}><small>{x.date}</small><h2>{x.title}</h2><p>{x.issuer}</p></article>)}</div>}
    {page.body && <div className="prose">{page.body.map(x=><p key={x}>{x}</p>)}</div>}
    {params.section === "achievements" && <div className="article-grid"><article><small>01</small><h2>CareerOS launched</h2><p>Designed a structured, responsive home for professional evidence.</p></article><article><small>02</small><h2>Research into practice</h2><p>Converted ongoing inquiry into explainable product and engineering patterns.</p></article></div>}
    {params.section === "writing" && <div className="article-grid"><article><small>Build note · 2026</small><h2>Why a career needs an operating system</h2><p>Moving beyond portfolio claims toward connected, maintainable evidence.</p></article><article><small>Field note · 2026</small><h2>Designing a useful 60-second view</h2><p>Respecting recruiter attention without flattening the work.</p></article></div>}
    {params.section === "contact" && <div className="contact-card"><h2>Start a conversation</h2><a href="mailto:hello@ahamed.dev">hello@ahamed.dev ↗</a><p>For roles, collaborations, research conversations, and considered freelance work.</p></div>}
  </main>;
}
