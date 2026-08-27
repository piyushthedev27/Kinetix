import { AppShell } from "@/components/layout";
import { Button, SectionHeading } from "@/components/ui";
import { Replay } from "@/components/physics";

export default function ExperimentDetailPage() {
  return (
    <AppShell current="Experiments">
      <div className="app-content">
        <SectionHeading
          eyebrow="Experiments / Projectile Motion"
          title="Projectile Motion"
          description="See how launch angle and velocity affect a real trajectory."
        />

        <section className="next-card">
          <div>
            <div className="motion-icon" style={{ marginBottom: 18 }}>
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path d="M6 39C16 8 30 7 43 29" />
                <circle cx="28" cy="12" r="3" fill="var(--lime)" />
              </svg>
            </div>
            <h2>What you&apos;ll measure</h2>
            <p>Launch angle · initial velocity · maximum height · range · flight time</p>
            <h2 style={{ marginTop: 24 }}>What you&apos;ll learn</h2>
            <p>How launch conditions change the shape and distance of a projectile.</p>
          </div>

          <Button href="/experiment/projectile-motion/setup">Start experiment</Button>
        </section>

        <div style={{ marginTop: 28 }}>
          <Replay controls showMetrics />
        </div>
      </div>
    </AppShell>
  );
}
