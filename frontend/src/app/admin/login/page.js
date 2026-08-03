import { login } from "../actions";

export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default function Login({ searchParams }) {
  const message = searchParams?.error
    ? "Sign-in failed. Check your credentials and owner access."
    : null;
  return <main className="login-page"><form action={login} className="login-card">
    <p className="overline">CareerOS / Private</p><h1>Welcome back.</h1>
    <p>Sign in to manage Ahamed.dev content.</p>
    {message && <p role="alert">{message}</p>}
    <label>Email<input required type="email" name="email" autoComplete="email" placeholder="you@ahamed.dev" /></label>
    <label>Password<input required type="password" name="password" autoComplete="current-password" /></label>
    <button className="button primary" type="submit">Sign in securely →</button>
  </form></main>;
}
