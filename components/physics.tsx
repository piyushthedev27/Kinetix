import { Pause, Play, RotateCcw } from "lucide-react";
import { MetricStrip } from "./ui";
import { primaryProjectileExperiment } from "@/lib/physics/projectile-data";
import { PhysicsGrid } from "./physics/PhysicsGrid";
import { Projectile } from "./physics/Projectile";
import { Trajectory as TrajectoryPath } from "./physics/Trajectory";
import { VelocityVector } from "./physics/VelocityVector";

export function Trajectory({ compact = false }: { compact?: boolean }) {
  const experiment = primaryProjectileExperiment;
  const sample = compact ? experiment.samples[experiment.samples.length - 1] : experiment.samples[2];

  return (
    <div className="trajectory">
      <svg viewBox="0 0 720 320" role="img" aria-label="Measured projectile trajectory and theoretical path">
        <PhysicsGrid className="grid" />
        <TrajectoryPath className="theory" d={experiment.theoryPath} />
        <TrajectoryPath className="actual" d={experiment.actualPath} />
        <Projectile className="physics-ball" point={sample.point} />
        <VelocityVector className="physics-vector" point={sample.point} tone="hero" />
      </svg>
      {!compact ? (
        <span className="tag info" style={{ position: "absolute", top: 12, left: 12 }}>
          Actual - solid · Theory - dashed
        </span>
      ) : null}
    </div>
  );
}

export function Replay({ controls = true }: { controls?: boolean }) {
  return (
    <div className="panel">
      <p className="eyebrow">Physics replay</p>
      <h2>Your throw</h2>
      <Trajectory compact />
      {controls ? (
        <div className="actions">
          <button className="button primary small" type="button">
            <Play size={14} />
            Replay
          </button>
          <button className="button ghost small" type="button">
            <Pause size={14} />
            Pause
          </button>
          <button className="button ghost small" type="button">
            <RotateCcw size={14} />
            Reset
          </button>
          <span className="mono" style={{ marginLeft: "auto", alignSelf: "center" }}>
            {primaryProjectileExperiment.flightTime.toFixed(2)}s
          </span>
        </div>
      ) : null}
      <MetricStrip metrics={primaryProjectileExperiment.metrics.slice(0, 3)} />
    </div>
  );
}
