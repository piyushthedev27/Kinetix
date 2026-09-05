"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Ground, Ruler3D, RoundedBlock } from "../sandbox3d/primitives";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const TRACK_UNITS = 12;
const UNIT_SIZE = 0.6;
const BLOCK_SIZE = 0.45;
const TRACK_LENGTH = TRACK_UNITS * UNIT_SIZE;
const TRACK_START_X = -TRACK_LENGTH / 2;
const DRAG_K = 0.85; // u/s decay rate
const INITIAL_SPEED_PER_FORCE = 0.9;
const STOP_SPEED_THRESHOLD = 0.05;

type Phase = "idle" | "running" | "done";

function unitToWorldX(u: number) {
  return TRACK_START_X + u * UNIT_SIZE;
}

interface PhysicsState {
  phase: Phase;
  position: number;
  velocity: number;
  peakSpeed: number;
}

interface SceneProps {
  physicsRef: MutableRefObject<PhysicsState>;
  ghosts: number[];
  onStop: (finalUnit: number) => void;
}

function MotionScene({ physicsRef, ghosts, onStop }: SceneProps) {
  const blockRef = useRef<THREE.Group>(null);
  const arrowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = physicsRef.current;

    if (state.phase === "running") {
      state.velocity -= DRAG_K * state.velocity * dt;
      state.position += state.velocity * dt;
      state.peakSpeed = Math.max(state.peakSpeed, state.velocity);

      if (state.position >= TRACK_UNITS) {
        state.position = TRACK_UNITS;
        state.velocity = 0;
        state.phase = "done";
        onStop(state.position);
      } else if (state.velocity < STOP_SPEED_THRESHOLD) {
        state.velocity = 0;
        state.phase = "done";
        onStop(state.position);
      }
    }

    const worldX = unitToWorldX(state.position) + BLOCK_SIZE / 2;
    if (blockRef.current) blockRef.current.position.x = worldX;
    if (arrowRef.current) {
      const scale = state.phase === "running" ? 0.3 + 0.7 * (state.velocity / Math.max(state.peakSpeed, 0.01)) : 0;
      arrowRef.current.scale.set(scale, 1, 1);
      arrowRef.current.visible = scale > 0.05;
      arrowRef.current.position.x = worldX;
    }
  });

  return (
    <>
      <Ground width={10} depth={6} />
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[TRACK_LENGTH + 1, 0.04, 1.2]} />
        <meshStandardMaterial color="#dfe4dc" roughness={0.85} />
      </mesh>
      <Ruler3D unitSize={UNIT_SIZE} count={TRACK_UNITS} origin={[TRACK_START_X, 0.04, 0.75]} />

      {ghosts.map((g, i) => (
        <mesh key={i} position={[unitToWorldX(g) + BLOCK_SIZE / 2, BLOCK_SIZE / 2 + 0.04, 0]}>
          <sphereGeometry args={[BLOCK_SIZE * 0.55, 16, 16]} />
          <meshStandardMaterial color="#b7e33a" transparent opacity={0.25} />
        </mesh>
      ))}

      <group ref={blockRef} position={[BLOCK_SIZE / 2, BLOCK_SIZE / 2 + 0.04, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[BLOCK_SIZE * 0.55, 24, 24]} />
          <meshStandardMaterial color="#b7e33a" roughness={0.4} />
        </mesh>
        <mesh ref={arrowRef} position={[0.4, 0.15, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.3, 12]} />
          <meshStandardMaterial color="#f59a3d" />
        </mesh>
      </group>
    </>
  );
}

export function MotionMeasurementSandbox3D() {
  const physicsRef = useRef<PhysicsState>({ phase: "idle", position: 0, velocity: 0, peakSpeed: 0 });

  const [force, setForce] = useState(6);
  const [prediction, setPrediction] = useState(6);
  const [phase, setPhase] = useState<Phase>("idle");
  const [ghosts, setGhosts] = useState<number[]>([]);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const handleStop = (finalUnitRaw: number) => {
    const actual = Math.round(finalUnitRaw * 2) / 2;
    const diff = Math.abs(actual - prediction);
    setPhase("done");
    setLog((prev) => [
      ...prev,
      "Motion detected: the object's position changed over time — this is Motion.",
      `It came to rest at the ${actual} mark. Reading 0 → ${actual} on the ruler is the Measurement of Distance.`,
      diff <= 0.5 ? "Spot on! Your prediction matched the ruler almost exactly." : diff <= 1.5 ? "Close — a small gap between your prediction and the reading." : "Not quite. Try a different force and see how the stopping point shifts.",
    ]);
  };

  const launch = () => {
    if (physicsRef.current.phase === "running") return;
    if (physicsRef.current.phase === "done") {
      setGhosts((prev) => [physicsRef.current.position, ...prev].slice(0, 3));
    }
    physicsRef.current = { phase: "running", position: 0, velocity: force * INITIAL_SPEED_PER_FORCE, peakSpeed: 0 };
    setPhase("running");
    setLog((prev) => [...prev, `Force Applied — level ${force}.`]);
  };

  const reset = () => {
    physicsRef.current = { phase: "idle", position: 0, velocity: 0, peakSpeed: 0 };
    setPhase("idle");
    setGhosts([]);
    setLog(["Ready"]);
  };

  const busy = phase === "running";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="force-slider-md3d">Force <span className="mono">{force}/10</span></label>
          <input id="force-slider-md3d" type="range" min={1} max={10} value={force} disabled={busy} onChange={(e) => setForce(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="prediction-slider-md3d">Your prediction — where will it stop? <span className="mono">{prediction} u</span></label>
          <input id="prediction-slider-md3d" type="range" min={0} max={TRACK_UNITS} step={0.5} value={prediction} disabled={busy} onChange={(e) => setPrediction(Number(e.target.value))} />
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.6, 2.5, 4.3]} target={[0, 0.15, 0]} minDistance={2.8} maxDistance={11}>
        <MotionScene physicsRef={physicsRef} ghosts={ghosts} onStop={handleStop} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={launch} disabled={busy}>
          {phase === "done" ? "Run Again" : "Start Experiment"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
