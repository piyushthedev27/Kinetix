"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Signal } from "lucide-react";
import { primaryProjectileExperiment } from "@/lib/physics/projectile-data";
import type { ProjectileExperiment, ProjectileSample } from "@/lib/physics/projectile-model";
import { MotionTimeline } from "./MotionTimeline";
import { PhysicsGrid } from "./PhysicsGrid";
import { PhysicsMetric } from "./PhysicsMetric";
import { Projectile } from "./Projectile";
import { ReplayControls } from "./ReplayControls";
import { Trajectory } from "./Trajectory";
import { VelocityVector } from "./VelocityVector";

type ProjectileSceneMode = "hero" | "preview" | "live" | "replay";

type ProjectileSceneProps = {
  mode?: ProjectileSceneMode;
  data?: ProjectileExperiment;
  compact?: boolean;
  className?: string;
};

function usePlayback(mode: ProjectileSceneMode, sampleCount: number) {
  const reduce = useReducedMotion();
  const shouldAutoplay = mode === "hero" || mode === "live";
  const [playing, setPlaying] = useState(shouldAutoplay);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setPlaying(shouldAutoplay);
    setFrame(0);
  }, [mode, shouldAutoplay]);

  useEffect(() => {
    if (reduce || !playing || sampleCount < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setFrame((value) => (value + 1) % sampleCount);
    }, mode === "hero" ? 1200 : 950);

    return () => window.clearInterval(timer);
  }, [mode, playing, reduce, sampleCount]);

  return { frame, playing, setPlaying, setFrame };
}

function formatAngle(angle: number) {
  return `${Math.round(angle)}°`;
}

function SceneStage({
  sample,
  experiment,
  mode,
  animated,
}: {
  sample: ProjectileSample;
  experiment: ProjectileExperiment;
  mode: ProjectileSceneMode;
  animated: boolean;
}) {
  const showLabel = mode !== "live";

  return (
    <div className={mode === "live" ? "live-viz" : "kinetix-scene__viz"}>
      {mode === "live" ? (
        <div className="live-viz__labels">
          <span>ACTUAL PATH</span>
          <span>THEORY · 45°</span>
        </div>
      ) : (
        <div className="hero-caption">
          <i />
          Tracking motion
          <span>{sample.time.toFixed(2)} s</span>
        </div>
      )}
      <svg
        className={mode === "live" ? "" : "physics-motion"}
        viewBox="0 0 720 320"
        role="img"
        aria-label="Projectile trajectory visualization"
      >
        <PhysicsGrid className={mode === "live" ? "live-grid" : "grid"} />
        <Trajectory
          className={mode === "live" ? "live-theory" : "physics-theory"}
          d={experiment.theoryPath}
          progress={1}
          show={animated}
        />
        <motion.path
          className={mode === "live" ? "live-actual" : "physics-actual"}
          d={experiment.actualPath}
          initial={animated ? { pathLength: 0 } : false}
          animate={{ pathLength: sample.progress / 100 }}
          transition={{ duration: animated ? 0.75 : 0, ease: "easeOut" }}
        />
        <Projectile className={mode === "live" ? "live-ball" : "physics-ball"} point={sample.point} />
        <VelocityVector
          className={mode === "live" ? "live-vector" : "physics-vector"}
          point={sample.point}
          tone={mode === "live" ? "live" : "hero"}
        />
        {showLabel ? (
          <motion.g
            initial={animated ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animated ? 0.3 : 0 }}
          >
            <rect x="242" y="40" width="126" height="31" rx="7" className="physics-readout" />
            <text x="255" y="60" className="physics-text">
              ANGLE {formatAngle(experiment.angle)}
            </text>
          </motion.g>
        ) : null}
      </svg>
      {mode !== "live" ? (
        <div className="hero-notes" aria-hidden="true">
          <span>v₀ = {experiment.velocity.toFixed(1)} m/s</span>
          <span>θ = {formatAngle(experiment.angle)}</span>
        </div>
      ) : null}
      {mode === "live" ? <MotionTimeline progress={sample.progress} /> : null}
    </div>
  );
}

export function ProjectileScene({
  mode = "hero",
  data = primaryProjectileExperiment,
  compact = false,
  className = "",
}: ProjectileSceneProps) {
  const reduce = useReducedMotion();
  const { frame, playing, setPlaying, setFrame } = usePlayback(mode, data.samples.length);
  const sample = mode === "preview" ? data.samples[data.samples.length - 1] : data.samples[frame] ?? data.samples[0];
  const metrics = useMemo(() => {
    return mode === "live"
      ? [
          { label: "Speed", value: `${data.velocity.toFixed(1)} m/s` },
          { label: "Angle", value: formatAngle(data.angle) },
          { label: "Height", value: `${data.launchHeight.toFixed(2)} m` },
          { label: "Range", value: `${data.range.toFixed(1)} m` },
          { label: "Flight time", value: `${data.flightTime.toFixed(2)} s` },
        ]
      : data.metrics;
  }, [data.angle, data.flightTime, data.launchHeight, data.metrics, data.range, data.velocity, mode]);

  if (mode === "live" || mode === "replay") {
    return (
      <section className={`live-lab ${compact ? "live-lab--compact" : ""} ${className}`.trim()} aria-label="Projectile motion lab">
        <header className="live-lab__header">
          <div>
            <p className="eyebrow">Physics lab</p>
            <h2>{data.title}</h2>
          </div>
          <span className="live-status">
            <Signal size={14} />
            {mode === "live" ? "Live data" : "Playback"}
          </span>
        </header>
        <div className="live-lab__body">
          <SceneStage sample={sample} experiment={data} mode={mode} animated={!reduce} />
          <aside className="live-metrics" aria-label="Experiment metrics">
            {metrics.map((metric) => (
              <PhysicsMetric key={metric.label} label={metric.label} value={metric.value} mode="live" active />
            ))}
          </aside>
        </div>
        {!compact ? (
          <ReplayControls
            playing={playing}
            onToggle={() => setPlaying((value) => !value)}
            onReset={() => {
              setFrame(0);
              setPlaying(true);
            }}
            caption={mode === "live" ? "Values come from the shared projectile model" : "Playback uses the same projectile model"}
          />
        ) : null}
      </section>
    );
  }

  return (
    <div className={`projectile-scene projectile-scene--${mode} ${className}`.trim()}>
      <SceneStage sample={sample} experiment={data} mode={mode} animated={!reduce} />
      <div className="metric-strip">
        {metrics.slice(0, 4).map((metric) => (
          <PhysicsMetric key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>
    </div>
  );
}
