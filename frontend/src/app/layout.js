import "./globals.css";
import SiteShell from "./components/SiteShell";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  metadataBase: new URL("https://ahamed.dev"),
  title: { default: "CareerOS — Ahamed's living career record", template: "%s — CareerOS" },
  description: "CareerOS connects Ahamed's projects, skills, research, credentials, and writing in a living professional record powered by Supabase.",
  applicationName: "CareerOS",
  openGraph: {
    title: "CareerOS",
    description: "A living professional record backed by Supabase.",
    url: "https://ahamed.dev",
    siteName: "CareerOS",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider><SiteShell>{children}</SiteShell></ThemeProvider></body></html>;
}
