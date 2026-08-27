import { AppShell } from "@/components/layout";
import { LivePhysicsLab } from "@/components/kinetix-motion";
import { Button } from "@/components/ui";

export default function LabPage() {
  return (
    <AppShell current="Experiments">
      <div className="app-content lab-page">
        <header className="lab-page__intro">
          <div>
            <p className="eyebrow">Live experiment</p>
            <h1 className="page-title">Physics is happening now.</h1>
            <p className="intro">
              A simulated phone stream makes the upcoming real connection and analysis workflow tangible.
            </p>
          </div>
          <Button href="/experiment/projectile-motion/capture">Open phone capture</Button>
        </header>

        <LivePhysicsLab />

        <section className="lab-insight">
          <span className="eyebrow">Live insight</span>
          <h2>
            At the current angle, your path is <strong>0.9 m</strong> shorter than the theoretical 45° example.
          </h2>
          <Button href="/experiment/projectile-motion/compare" variant="secondary">
            Compare with theory
          </Button>
        </section>
      </div>
    </AppShell>
  );
}

