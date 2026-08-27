"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button, LoadingMark, MetricStrip } from "./ui";
import { Replay, Trajectory } from "./physics";
import { experimentMetrics } from "@/lib/mock-data";
import { primaryProjectileExperiment } from "@/lib/physics/projectile-data";
import { CameraCapture } from "@/components/experiment/CameraCapture";
import { useState } from "react";
import { createDevelopmentExplanation, toExplanationRequest } from "@/lib/ai/explanation";

export type Stage = "setup" | "calibrate" | "capture" | "processing" | "replay" | "compare" | "explain";

const stageLabels: Record<Stage, string> = {
  setup: "Setup",
  calibrate: "Calibrate",
  capture: "Capture",
  processing: "Processing",
  replay: "Replay",
  compare: "Compare",
  explain: "Explain",
};

const stageProgress: Record<Stage, number> = {
  setup: 1,
  calibrate: 1,
  capture: 2,
  processing: 2,
  replay: 3,
  compare: 4,
  explain: 4,
};

const nextRoute: Record<Stage, string> = {
  setup: "/experiment/projectile-motion/calibrate",
  calibrate: "/experiment/projectile-motion/capture",
  capture: "/experiment/projectile-motion/processing",
  processing: "/experiment/projectile-motion/replay",
  replay: "/experiment/projectile-motion/compare",
  compare: "/experiment/projectile-motion/explain",
  explain: "/experiment/projectile-motion/setup",
};

function Progress({ stage }: { stage: Stage }) {
  return (
    <div className="progress" aria-label={`Experiment progress: ${stageLabels[stage]}`}>
      {["Do it", "Track it", "See it", "Understand it"].map((label, index) => (
        <span className={index + 1 === stageProgress[stage] ? "current" : ""} key={label}>
          {label}
          {index < 3 ? <i /> : null}
        </span>
      ))}
    </div>
  );
}

export function Workflow({ stage }: { stage: Stage }) {
  const [captureComplete, setCaptureComplete] = useState(false);
  const explanation = createDevelopmentExplanation(toExplanationRequest(primaryProjectileExperiment, 5.1));
  const cta =
    stage === "explain"
      ? "Try again"
      : stage === "capture"
        ? "See your physics"
        : stage === "processing"
          ? "View replay"
          : stage === "replay"
            ? "Compare with theory"
            : stage === "compare"
              ? "Understand why"
              : stage === "calibrate"
                ? "Start experiment"
                : "Continue";

  return (
    <main className="workflow">
      <div className="flow-top">
        <Link className="button ghost small" href="/app/experiments/projectile-motion">
          <ArrowLeft size={15} />
          Back
        </Link>
        <span className="mono">Projectile Motion · 1 / 1</span>
      </div>

      <Progress stage={stage} />

      {stage === "setup" ? (
        <section className="flow-card">
          <p className="eyebrow">Before we start</p>
          <h1>Set up your experiment.</h1>
          <p>Prepare a safe, visible space so Kinetix can observe your throw.</p>
          <div className="check-list">
            <div>
              <span>
                <Check />
              </span>
              Find a ball
            </div>
            <div>
              <span>
                <Check />
              </span>
              Place your phone securely
            </div>
            <div>
              <span>
                <Check />
              </span>
              Make sure the ball stays visible
            </div>
          </div>
          <Button href={nextRoute[stage]}>{cta}</Button>
        </section>
      ) : null}

      {stage === "calibrate" ? (
        <section className="flow-card">
          <p className="eyebrow">Camera calibration</p>
          <h1>Calibrate your view.</h1>
          <p>Keep the camera still and place the ball in view so Kinetix can estimate distance.</p>
          <div className="calibration-box">
            <div>
              <i />
              <strong>Reference distance</strong>
              <br />
              <span className="mono">1.0 m</span>
            </div>
          </div>
          <span className="tag live">Object detected · tracking looks good</span>
          <div className="actions">
            <Button href={nextRoute[stage]}>{cta}</Button>
          </div>
        </section>
      ) : null}

      {stage === "capture" ? (
        <section className="flow-card">
          <p className="eyebrow">Live capture</p>
          <h1>Throw the ball.</h1>
          <p>Keep the ball in frame. The camera is the primary interface.</p>
          <CameraCapture onCaptured={() => setCaptureComplete(true)} />
          <div className="actions">
            {captureComplete ? <Button href={nextRoute[stage]}>{cta}</Button> : <button type="button" className="button primary" disabled>Capture to continue</button>}
          </div>
        </section>
      ) : null}

      {stage === "processing" ? (
        <section className="flow-card">
          <p className="eyebrow">Experiment captured</p>
          <h1>Building your physics replay...</h1>
          <p>The capture is processed into motion, measurement, and a replay you can compare.</p>
          <LoadingMark label="Processing motion data" />
          <div className="process-list">
            <div className="done">
              <i>✓</i>
              Motion captured
            </div>
            <div className="done">
              <i>✓</i>
              Trajectory detected
            </div>
            <div className="done">
              <i>✓</i>
              Calculating physics
            </div>
            <div>
              <i>○</i>
              Comparing with theory
            </div>
          </div>
          <Button href={nextRoute[stage]}>{cta}</Button>
        </section>
      ) : null}

      {stage === "replay" ? (
        <section className="flow-card">
          <p className="eyebrow">Your physics</p>
          <h1>Replay your throw.</h1>
          <p>Watch the measured path, key points, and velocity emerge from the capture.</p>
          <div style={{ margin: "25px 0" }}>
            <Replay />
          </div>
          <Button href={nextRoute[stage]}>{cta}</Button>
        </section>
      ) : null}

      {stage === "compare" ? (
        <section className="flow-card">
          <p className="eyebrow">Theory vs reality</p>
          <h1>What changed the result?</h1>
          <p>The difference should be clear before we explain the physics.</p>
          <div className="comparison">
            <div>
              <small>THEORY</small>
              <strong>45°</strong>
              <span>6.0 m range</span>
            </div>
            <span aria-hidden="true">→</span>
            <div>
              <small>YOUR THROW</small>
              <strong>{formatAngle(primaryProjectileExperiment.angle)}</strong>
              <span>{primaryProjectileExperiment.range.toFixed(1)} m range</span>
            </div>
          </div>
          <div style={{ margin: "24px 0" }}>
            <Trajectory compact />
          </div>
          <p>
            <strong>0.9 m difference.</strong> Your measured path is shorter than the theoretical example.
          </p>
          <div className="actions">
            <Button href={nextRoute[stage]}>{cta}</Button>
          </div>
        </section>
      ) : null}

      {stage === "explain" ? (
        <section className="flow-card explanation">
          <p className="eyebrow">What happened?</p>
          <h1>{explanation.headline}.</h1>
          <p>{explanation.body}</p>
          <MetricStrip metrics={experimentMetrics.slice(0, 3)} />
          <p className="explanation-insight">{explanation.insight}</p>
          <div className="actions">
            <Button href={nextRoute[stage]}>Try again around {Math.round(primaryProjectileExperiment.targetAngle)}°</Button>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function formatAngle(angle: number) {
  return `${Math.round(angle)}°`;
}
