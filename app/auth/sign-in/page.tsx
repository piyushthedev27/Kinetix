import Link from "next/link";
import { Brand, Button } from "@/components/ui";

export default function SignInPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Brand />
        <h1>Welcome back</h1>
        <p>Continue your physics experiments.</p>
        <form>
          <label className="field">
            Email
            <input type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label className="field">
            Password
            <input type="password" autoComplete="current-password" placeholder="••••••••" required />
          </label>
          <Button href="/app">Sign in</Button>
        </form>
        <p className="form-note">
          <Link href="/auth/sign-up">Don&apos;t have an account? Create one</Link>
        </p>
      </section>
    </main>
  );
}
