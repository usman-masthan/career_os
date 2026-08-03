import "./globals.css";
import SiteShell from "./components/SiteShell";

export const metadata = {
  metadataBase: new URL("https://ahamed.dev"),
  title: { default: "Ahamed.dev — Software Engineer & AI Builder", template: "%s — Ahamed.dev" },
  description: "The CareerOS of Ahamed: selected software, applied AI research, experience, credentials, and writing.",
  openGraph: { title: "Ahamed.dev", description: "Useful systems for ambitious ideas.", url: "https://ahamed.dev", siteName: "Ahamed.dev", type: "website" },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>;
}
