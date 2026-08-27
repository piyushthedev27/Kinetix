import { AppShell } from "@/components/layout";
import { Button, MetricStrip } from "@/components/ui";
import { Replay } from "@/components/physics";
import { experimentMetrics } from "@/lib/mock-data";
import { primaryProjectileExperiment } from "@/lib/physics/projectile-data";

export default function HistoryDetailPage() {
  return (
    <AppShell current="History">
      <div className="app-content">
        <p className="eyebrow">
          Projectile Motion · {primaryProjectileExperiment.dateLabel}
        </p>
        <h1 className="page-title">Your throw</h1>

        <div className="result-grid" style={{ marginTop: 28 }}>
          <Replay showMetrics={false} />
          <section className="panel explanation">
            <p className="eyebrow">What happened?</p>
            <h2>Closer to the predicted path.</h2>
            <p>Your {Math.round(primaryProjectileExperiment.angle)}° launch angle brought this attempt closer to the {Math.round(primaryProjectileExperiment.targetAngle)}° theory.</p>
            <Button href="/experiment/projectile-motion/setup">Try again</Button>
          </section>
        </div>

        <MetricStrip metrics={experimentMetrics} />
      </div>
    </AppShell>
  );
}
