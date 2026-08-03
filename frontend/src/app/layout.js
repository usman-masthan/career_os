import "./globals.css";
import SiteShell from "./components/SiteShell";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  metadataBase: new URL("https://ahamed.dev"),
  title: { default: "Ahamed.dev — Software Engineer & AI Builder", template: "%s — Ahamed.dev" },
  description: "The CareerOS of Ahamed: selected software, applied AI research, experience, credentials, and writing.",
  openGraph: { title: "Ahamed.dev", description: "Useful systems for ambitious ideas.", url: "https://ahamed.dev", siteName: "Ahamed.dev", type: "website" },
};

export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider><SiteShell>{children}</SiteShell></ThemeProvider></body></html>;
}
