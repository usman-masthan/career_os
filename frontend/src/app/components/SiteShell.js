"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
export default function SiteShell({ children, profile, shell }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return <div>
    <header className="site-header">
      <Link className="brand" href="/" aria-label={`${profile.display_name || "Portfolio"} home`}><span>{shell.mark || profile.initials}</span><b>{profile.display_name}</b><small>{shell.brand_subtitle || profile.headline}</small></Link>
      <button className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-navigation">{shell.menu_label}</button>
      <nav id="primary-navigation" className={open ? "nav open" : "nav"} aria-label={shell.navigation_label}>
        {(shell.navigation || []).map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
      </nav>
      {shell.header_cta?.href && <Link className="header-cta" href={shell.header_cta.href}>{shell.header_cta.label}</Link>}
    </header>
    {children}
    <footer><Link className="brand" href="/"><span>{shell.mark || profile.initials}</span><b>{profile.display_name}</b></Link><p>{shell.footer_text}</p>{shell.footer_link?.href&&<Link href={shell.footer_link.href}>{shell.footer_link.label}</Link>}</footer>
  </div>;
}
