export default function PageHeader({ eyebrow, title, intro, status }) {
  return <header className="page-title"><div className="page-status"><p className="overline">{eyebrow}</p>{status && <span><i/>{status}</span>}</div><h1>{title}</h1>{intro && <p>{intro}</p>}</header>;
}
