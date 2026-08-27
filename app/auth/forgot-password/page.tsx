import { Brand, Button } from "@/components/ui";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Brand />
        <h1>Reset your password</h1>
        <p>Enter your email and we&apos;ll send reset instructions when authentication is connected.</p>
        <label className="field">
          Email
          <input type="email" autoComplete="email" placeholder="you@example.com" />
        </label>
        <Button href="/auth/sign-in">Return to sign in</Button>
      </section>
    </main>
  );
}

