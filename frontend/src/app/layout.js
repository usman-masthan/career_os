import "./globals.css";
import SiteShell from "./components/SiteShell";
import { ThemeProvider } from "./context/ThemeContext";
import { getProfile, getSiteContent, optional } from "./data";
import Analytics from "./components/Analytics";

// Content is managed in Supabase. Resolve it at request time so a temporary
// backend outage during `next build` cannot publish an empty static portfolio.
// Successful API responses remain cached by the data layer.
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const [site, profile] = await Promise.all([optional(() => getSiteContent("home"), {}), optional(getProfile)]);
  const record = profile.data[0] || {};
  const seo = site.data.seo || {};
  return { ...seo, metadataBase: new URL(record.website_url || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: seo.title || record.display_name, template: `%s — ${seo.title || record.display_name}` },
    openGraph: { type:"website", siteName:seo.title || record.display_name, title:seo.title, description:seo.description },
    twitter: { card:"summary_large_image", title:seo.title, description:seo.description },
  };
}

export default async function RootLayout({ children }) {
  const [profileResult, shellResult] = await Promise.all([optional(getProfile), optional(() => getSiteContent("shell"), {})]);
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider><Analytics/><SiteShell profile={profileResult.data[0] || {}} shell={shellResult.data}>{children}</SiteShell></ThemeProvider></body></html>;
}
