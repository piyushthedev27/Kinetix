"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { MetricStrip } from "./ui";
import { primaryProjectileExperiment } from "@/lib/physics/projectile-data";
import { PhysicsGrid } from "./physics/PhysicsGrid";
import { Projectile } from "./physics/Projectile";
import { Trajectory as TrajectoryPath } from "./physics/Trajectory";
import { VelocityVector } from "./physics/VelocityVector";

export function Trajectory({ compact = false, frameIndex }: { compact?: boolean; frameIndex?: number }) {
  const experiment = primaryProjectileExperiment;
  const sample = compact
    ? experiment.samples[frameIndex ?? experiment.samples.length - 1]
    : experiment.samples[frameIndex ?? 2];

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

export function Replay({ controls = true, showMetrics = true }: { controls?: boolean; showMetrics?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setFrame((value) => (value + 1) % primaryProjectileExperiment.samples.length);
    }, 700);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className="panel">
      <p className="eyebrow">Physics replay</p>
      <h2>Your throw</h2>
      <Trajectory compact frameIndex={frame} />
      {controls ? (
        <div className="actions">
          <button className="button primary small" type="button" onClick={() => setPlaying((value) => !value)}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? "Pause" : "Replay"}
          </button>
          <button className="button ghost small" type="button" onClick={() => setPlaying(false)} disabled={!playing}>
            <Pause size={14} /> Pause
          </button>
          <button className="button ghost small" type="button" onClick={() => { setFrame(0); setPlaying(false); }}>
            <RotateCcw size={14} />
            Reset
          </button>
          <span className="mono" style={{ marginLeft: "auto", alignSelf: "center" }}>
            {primaryProjectileExperiment.samples[frame]?.time.toFixed(2)}s
          </span>
        </div>
      ) : null}
      {showMetrics ? <MetricStrip metrics={primaryProjectileExperiment.metrics.slice(0, 3)} /> : null}
    </div>
  );
}
