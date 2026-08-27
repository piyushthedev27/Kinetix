import { AppShell } from "@/components/layout";
import { PhysicsMotion } from "@/components/kinetix-motion";
import { Button } from "@/components/ui";

export default function ProfilePage() {
  return (
    <AppShell current="Profile">
      <div className="app-content profile-page">
        <header>
          <p className="eyebrow">Your profile</p>
          <h1 className="page-title">Alex&apos;s Physics Lab</h1>
          <p className="intro">A record of real attempts, visible improvements, and the next motion to test.</p>
        </header>

        <section className="profile-hero">
          <div>
            <span className="eyebrow">Projectile Motion</span>
            <h2>Your best throw is getting closer.</h2>
            <p>43° · 6.0 m/s · 5.8 m range</p>
            <Button href="/app/history/kx-2408-017" variant="secondary">
              Replay best attempt
            </Button>
          </div>
          <PhysicsMotion />
        </section>

        <div className="profile-stats">
          <article>
            <strong>4</strong>
            <span>Experiments completed</span>
          </article>
          <article>
            <strong>5.8 <small>m</small></strong>
            <span>Best range</span>
          </article>
          <article>
            <strong>43°</strong>
            <span>Closest launch angle</span>
          </article>
        </div>
      </div>
    </AppShell>
  );
}

