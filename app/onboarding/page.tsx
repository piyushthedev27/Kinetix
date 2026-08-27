import { Button, Brand } from "@/components/ui";

export default function OnboardingPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Brand />
        <p className="eyebrow" style={{ marginTop: 28 }}>
          Welcome to Kinetix
        </p>
        <h1>Physics is better when you can see it.</h1>
        <p>Your first experiment is Projectile Motion. You&apos;ll need a ball, your phone, and a little space.</p>
        <Button href="/app">Set up experiment</Button>
      </section>
    </main>
  );
}

