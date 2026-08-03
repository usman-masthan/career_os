import { logout } from "./actions";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminPage() {
  return <main className="section-shell"><p className="overline">CareerOS / Private</p>
    <h1>Portfolio administration</h1>
    <p>Your authenticated session is active.</p>
    <form action={logout}><button className="button" type="submit">Sign out</button></form>
  </main>;
}
