import { content } from "../content";

export const metadata = { title: "CV", description: "Ahamed’s concise professional CV." };

export default function CV() {
  return <main className="page"><header className="page-title"><p className="overline">Curriculum vitae</p><h1>Ahamed</h1><p>{content.profile.role} · {content.profile.location}</p></header>
    <section className="case-sections"><section><span>01</span><h2>Profile</h2><p>{content.profile.summary}</p></section><section><span>02</span><h2>Experience</h2><div>{content.experience.map(x=><p key={x.role}><b>{x.role} · {x.organisation}</b><br/>{x.detail}</p>)}</div></section><section><span>03</span><h2>Capabilities</h2><div className="skill-cloud">{content.skills.flatMap(x=>x.items).map(x=><span key={x}>{x}</span>)}</div></section><section><span>04</span><h2>Contact</h2><p><a href="mailto:hello@ahamed.dev">hello@ahamed.dev</a></p></section></section>
  </main>;
}
