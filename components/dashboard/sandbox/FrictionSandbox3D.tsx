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
const UNIT_SIZE = 0.6; // world units per ruler "u"
const BLOCK_SIZE = 0.5;
const BLOCK_Y = BLOCK_SIZE / 2;
const TRACK_Z = 0;
const INITIAL_SPEED_PER_FORCE = 0.9; // u/s per force level
const STOP_SPEED_THRESHOLD = 0.05; // u/s

type SurfaceId = "ice" | "wood" | "sandpaper";
type Phase = "idle" | "running" | "done";

const SURFACES: Record<SurfaceId, { label: string; drag: number; color: string; roughness: number; metalness: number }> = {
  ice: { label: "Ice", drag: 0.5, color: "#cfe4ff", roughness: 0.05, metalness: 0.1 },
  wood: { label: "Wood", drag: 1.0, color: "#c99a5b", roughness: 0.65, metalness: 0 },
  sandpaper: { label: "Sandpaper", drag: 2.0, color: "#b7a37c", roughness: 1, metalness: 0 },
};

const TRACK_LENGTH = TRACK_UNITS * UNIT_SIZE;
const TRACK_START_X = -TRACK_LENGTH / 2;

function unitToWorldX(u: number) {
  return TRACK_START_X + u * UNIT_SIZE;
}

interface PhysicsState {
  phase: Phase;
  position: number; // in units
  velocity: number; // u/s
}

interface FrictionSceneProps {
  physicsRef: MutableRefObject<PhysicsState>;
  surface: SurfaceId;
  onStop: (finalUnit: number) => void;
}

function FrictionScene({ physicsRef, surface, onStop }: FrictionSceneProps) {
  const blockRef = useRef<THREE.Group>(null);
  const surf = SURFACES[surface];

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = physicsRef.current;

    if (state.phase === "running") {
      const k = SURFACES[surface].drag;
      state.velocity -= k * state.velocity * dt;
      state.position += state.velocity * dt;

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

    if (blockRef.current) {
      blockRef.current.position.x = unitToWorldX(state.position) + BLOCK_SIZE / 2;
    }
  });

  return (
    <>
      <Ground width={10} depth={6} />

      {/* Surface strip */}
      <mesh position={[0, 0.03, TRACK_Z]} receiveShadow>
        <boxGeometry args={[TRACK_LENGTH + 1, 0.06, 1.6]} />
        <meshStandardMaterial color={surf.color} roughness={surf.roughness} metalness={surf.metalness} />
      </mesh>

      <Ruler3D unitSize={UNIT_SIZE} count={TRACK_UNITS} origin={[TRACK_START_X, 0.06, 0.85]} />

      <group ref={blockRef} position={[unitToWorldX(0) + BLOCK_SIZE / 2, BLOCK_Y + 0.06, TRACK_Z]}>
        <RoundedBlock size={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]} color="#b7e33a" />
      </group>
    </>
  );
}

export function FrictionSandbox3D() {
  const physicsRef = useRef<PhysicsState>({ phase: "idle", position: 0, velocity: 0 });
  const surfaceRef = useRef<SurfaceId>("wood");

  const [force, setForce] = useState(6);
  const [prediction, setPrediction] = useState(5);
  const [surface, setSurface] = useState<SurfaceId>("wood");
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { surfaceRef.current = surface; }, [surface]);

  const handleStop = (finalUnitRaw: number) => {
    const surf = SURFACES[surfaceRef.current];
    const actual = Math.round(finalUnitRaw * 2) / 2;
    const guess = prediction;
    const diff = Math.abs(actual - guess);
    setPhase("done");
    setLog((prev) => [
      ...prev,
      `It slid to a stop at the ${actual} mark on ${surf.label.toLowerCase()}.`,
      `${surf.label} resists sliding more than a smoother surface — that resistive force is Friction. Rougher surface → more friction → shorter distance for the same push.`,
      diff <= 0.5
        ? `Your guess of ${guess} was spot on!`
        : diff <= 1.5
          ? `Your guess of ${guess} was close.`
          : `Your guess of ${guess} was off — try comparing surfaces at the same force.`,
    ]);
  };

  const launch = () => {
    if (physicsRef.current.phase === "running") return;
    physicsRef.current = { phase: "running", position: 0, velocity: force * INITIAL_SPEED_PER_FORCE };
    setPhase("running");
    setLog((prev) => [...prev, `Force Applied — level ${force} on ${SURFACES[surface].label.toLowerCase()}.`]);
  };

  const reset = () => {
    physicsRef.current = { phase: "idle", position: 0, velocity: 0 };
    setPhase("idle");
    setLog(["Ready"]);
  };

  const busy = phase === "running";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Surface</label>
          <div className="kx-sandbox-chip-row">
            {(Object.keys(SURFACES) as SurfaceId[]).map((id) => (
              <button
                key={id}
                type="button"
                className="kx-sandbox-chip"
                data-active={surface === id}
                disabled={busy}
                onClick={() => setSurface(id)}
              >
                {SURFACES[id].label}
              </button>
            ))}
          </div>
        </div>

        <div className="kx-sandbox-field">
          <label htmlFor="force-slider-3d">
            Force <span className="mono">{force}/10</span>
          </label>
          <input
            id="force-slider-3d"
            type="range"
            min={1}
            max={10}
            value={force}
            disabled={busy}
            onChange={(e) => setForce(Number(e.target.value))}
          />
        </div>

        <div className="kx-sandbox-field">
          <label htmlFor="prediction-slider-3d">
            Predict the stopping point <span className="mono">{prediction} u</span>
          </label>
          <input
            id="prediction-slider-3d"
            type="range"
            min={0}
            max={TRACK_UNITS}
            step={0.5}
            value={prediction}
            disabled={busy}
            onChange={(e) => setPrediction(Number(e.target.value))}
          />
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.6, 2.5, 4.3]} target={[0, 0.15, 0]} minDistance={2.8} maxDistance={11}>
        <FrictionScene physicsRef={physicsRef} surface={surface} onStop={handleStop} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={launch} disabled={busy}>
          {phase === "done" ? "Run Again" : "Start Experiment"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => (
          <div key={i} className="kx-sandbox-log-line">{line}</div>
        ))}
      </div>
    </div>
  );
}
