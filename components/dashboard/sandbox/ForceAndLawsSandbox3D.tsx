"use client";

import { useRef, useState, type MutableRefObject } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Ground, Ruler3D, RoundedBlock } from "../sandbox3d/primitives";
import { Text } from "@react-three/drei";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const TRACK_UNITS = 12;
const UNIT_SIZE = 0.6;
const TRACK_LENGTH = TRACK_UNITS * UNIT_SIZE;
const TRACK_START_X = -TRACK_LENGTH / 2;
const PUSH_MS = 900;
const ACCEL_SCALE = 1.1;

type Phase = "idle" | "pushing" | "coasting" | "done";

function unitToWorldX(u: number) {
  return TRACK_START_X + u * UNIT_SIZE;
}
function sizeForMass(mass: number) {
  return 0.32 + mass * 0.028;
}

interface PhysicsState {
  phase: Phase;
  position: number;
  velocity: number;
  pushStart: number;
}

interface SceneProps {
  physicsRef: MutableRefObject<PhysicsState>;
  force: number;
  mass: number;
  ghosts: number[];
  onCoast: (v: number) => void;
  onDone: (topSpeed: number) => void;
}

function ForceScene({ physicsRef, force, mass, ghosts, onCoast, onDone }: SceneProps) {
  const blockRef = useRef<THREE.Group>(null);
  const size = sizeForMass(mass);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = physicsRef.current;

    if (state.phase === "pushing") {
      const accel = (force / mass) * ACCEL_SCALE;
      state.velocity += accel * dt;
      state.position += state.velocity * dt;
      if (performance.now() - state.pushStart >= PUSH_MS) {
        state.phase = "coasting";
        onCoast(state.velocity);
      }
    } else if (state.phase === "coasting") {
      state.position += state.velocity * dt;
      if (state.position >= TRACK_UNITS) {
        const topSpeed = state.velocity;
        state.position = TRACK_UNITS;
        state.velocity = 0;
        state.phase = "done";
        onDone(topSpeed);
      }
    }

    if (blockRef.current) blockRef.current.position.x = unitToWorldX(Math.min(state.position, TRACK_UNITS)) + size / 2;
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
        <mesh key={i} position={[unitToWorldX(g), 0.06, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#3c82f6" transparent opacity={0.5} />
        </mesh>
      ))}

      <group ref={blockRef} position={[size / 2, size / 2 + 0.04, 0]}>
        <RoundedBlock size={[size, size, size]} color="#f59a3d" />
        <Text position={[0, 0, size / 2 + 0.01]} fontSize={0.14} color="#17202a" anchorX="center">{`${mass}kg`}</Text>
      </group>
    </>
  );
}

export function ForceAndLawsSandbox3D() {
  const physicsRef = useRef<PhysicsState>({ phase: "idle", position: 0, velocity: 0, pushStart: 0 });

  const [force, setForce] = useState(6);
  const [mass, setMass] = useState(4);
  const [prediction, setPrediction] = useState(4);
  const [phase, setPhase] = useState<Phase>("idle");
  const [ghosts, setGhosts] = useState<number[]>([]);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const handleCoast = (v: number) => {
    setPhase("coasting");
    setLog((prev) => [...prev, `Push ended. It reached ${v.toFixed(1)} u/s — acceleration = Force ÷ Mass = ${force} ÷ ${mass} = ${(force / mass).toFixed(2)} (in force units per kg).`]);
  };

  const handleDone = (topSpeed: number) => {
    setPhase("done");
    const diff = Math.abs(topSpeed - prediction);
    setLog((prev) => [
      ...prev,
      "It ran off the end of the track at a constant speed — with no friction acting on it, it never slowed down on its own. A moving object keeps its velocity unless a force acts on it (Newton's First Law); the track ending, not a force, is what stopped it here.",
      diff <= 0.7 ? `Your predicted top speed of ${prediction} u/s was close!` : `Your predicted top speed of ${prediction} u/s was off — the actual top speed was ${topSpeed.toFixed(1)} u/s.`,
    ]);
  };

  const launch = () => {
    if (physicsRef.current.phase === "pushing" || physicsRef.current.phase === "coasting") return;
    if (physicsRef.current.phase === "done") {
      setGhosts((prev) => [physicsRef.current.position, ...prev].slice(0, 4));
    }
    physicsRef.current = { phase: "pushing", position: 0, velocity: 0, pushStart: performance.now() };
    setPhase("pushing");
    setLog((prev) => [...prev, `Pushing with ${force} force units against a ${mass} kg mass.`]);
  };

  const reset = () => {
    physicsRef.current = { phase: "idle", position: 0, velocity: 0, pushStart: 0 };
    setPhase("idle");
    setGhosts([]);
    setLog(["Ready"]);
  };

  const busy = phase === "pushing" || phase === "coasting";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="mass-slider-3d">Mass <span className="mono">{mass} kg</span></label>
          <input id="mass-slider-3d" type="range" min={1} max={10} value={mass} disabled={busy} onChange={(e) => setMass(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="force-slider-fl3d">Force <span className="mono">{force}/10</span></label>
          <input id="force-slider-fl3d" type="range" min={1} max={10} value={force} disabled={busy} onChange={(e) => setForce(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="prediction-slider-fl3d">Predict the top speed it reaches <span className="mono">{prediction} u/s</span></label>
        <input id="prediction-slider-fl3d" type="range" min={0} max={12} step={0.5} value={prediction} disabled={busy} onChange={(e) => setPrediction(Number(e.target.value))} />
      </div>

      <Scene3DShell cameraPosition={[2.6, 2.5, 4.3]} target={[0, 0.15, 0]} minDistance={2.8} maxDistance={11}>
        <ForceScene physicsRef={physicsRef} force={force} mass={mass} ghosts={ghosts} onCoast={handleCoast} onDone={handleDone} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={launch} disabled={busy}>
          {phase === "done" ? "Push Again" : "Apply Force"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
