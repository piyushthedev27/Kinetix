import Link from "next/link";
import { Brand, Button } from "@/components/ui";

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Brand />
        <h1>Start experimenting</h1>
        <p>Create a simple learner profile. You can set up your first throw next.</p>
        <form>
          <label className="field">
            Email
            <input type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label className="field">
            Password
            <input type="password" autoComplete="new-password" placeholder="At least 8 characters" required />
          </label>
          <Button href="/onboarding">Create account</Button>
        </form>
        <p className="form-note">
          <Link href="/auth/sign-in">Already have an account? Sign in</Link>
        </p>
      </section>
    </main>
  );
}

