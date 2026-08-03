"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { navigation } from "../content";

export default function SiteShell({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [recruiter, setRecruiter] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (!recruiter) { setSeconds(60); return; }
    const timer = setInterval(() => setSeconds((value) => value > 0 ? value - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [recruiter]);

  return <div className={recruiter ? "recruiter-mode" : ""}>
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Ahamed.dev home"><span>A</span>Ahamed.dev</Link>
      <button className="menu" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
      <nav className={open ? "nav open" : "nav"} aria-label="Primary navigation">
        {navigation.map((item) => <Link key={item} href={`/${item.toLowerCase()}`} onClick={() => setOpen(false)}>{item === "Writing" ? "Writing / Updates" : item}</Link>)}
      </nav>
      <button className="mode-switch" aria-pressed={recruiter} onClick={() => { const next = !recruiter; setRecruiter(next); if (next) router.push("/"); }}>
        <span className="switch-dot" /> Recruiter mode {recruiter && <b>{seconds}s</b>}
      </button>
    </header>
    {recruiter && <div className="mode-banner"><strong>60-second view</strong><span>Only decision-ready evidence is shown.</span><button onClick={() => setRecruiter(false)}>Exit</button></div>}
    {children}
    <footer><Link className="brand" href="/"><span>A</span>Ahamed.dev</Link><p>Built as a living career system, not a static portfolio.</p><Link href="/admin/login">Admin login</Link></footer>
  </div>;
}
