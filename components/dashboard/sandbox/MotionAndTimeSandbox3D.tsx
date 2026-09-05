"use client";

import { useRef, useState, type MutableRefObject } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Ground } from "../sandbox3d/primitives";
import { Text } from "@react-three/drei";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const FINISH_UNITS = 10;
const UNIT_SIZE = 0.55;
const TRACK_LENGTH = FINISH_UNITS * UNIT_SIZE;
const START_X = -TRACK_LENGTH / 2;
const LANE_A_Z = -0.7;
const LANE_B_Z = 0.7;

type Phase = "idle" | "running" | "done";
type Racer = "A" | "B";

interface RaceState {
  phase: Phase;
  posA: number;
  posB: number;
  finishedA: boolean;
  finishedB: boolean;
  startTime: number;
  timeA: number;
  timeB: number;
}

interface SceneProps {
  stateRef: MutableRefObject<RaceState>;
  speedA: number;
  speedB: number;
  onFinish: (tA: number, tB: number) => void;
}

function RaceScene({ stateRef, speedA, speedB, onFinish }: SceneProps) {
  const ballARef = useRef<THREE.Mesh>(null);
  const ballBRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = stateRef.current;
    if (s.phase === "running") {
      const now = performance.now();
      if (!s.finishedA) {
        s.posA = Math.min(FINISH_UNITS, s.posA + speedA * dt);
        if (s.posA >= FINISH_UNITS) { s.finishedA = true; s.timeA = (now - s.startTime) / 1000; }
      }
      if (!s.finishedB) {
        s.posB = Math.min(FINISH_UNITS, s.posB + speedB * dt);
        if (s.posB >= FINISH_UNITS) { s.finishedB = true; s.timeB = (now - s.startTime) / 1000; }
      }
      if (s.finishedA && s.finishedB) {
        s.phase = "done";
        onFinish(s.timeA, s.timeB);
      }
    }
    if (ballARef.current) ballARef.current.position.x = START_X + s.posA * UNIT_SIZE;
    if (ballBRef.current) ballBRef.current.position.x = START_X + s.posB * UNIT_SIZE;
  });

  return (
    <>
      <Ground width={9} depth={5} />
      {[LANE_A_Z, LANE_B_Z].map((z, i) => (
        <mesh key={i} position={[0, 0.02, z]} receiveShadow>
          <boxGeometry args={[TRACK_LENGTH + 0.6, 0.04, 0.5]} />
          <meshStandardMaterial color="#e4e8e2" roughness={0.9} />
        </mesh>
      ))}

      <mesh position={[START_X + TRACK_LENGTH, 0.3, 0]}>
        <boxGeometry args={[0.03, 0.6, 2]} />
        <meshStandardMaterial color="#3c82f6" transparent opacity={0.5} />
      </mesh>
      <Text position={[START_X + TRACK_LENGTH, 0.75, 0]} fontSize={0.16} color="#3c82f6" anchorX="center">finish</Text>

      <mesh ref={ballARef} position={[START_X, 0.18, LANE_A_Z]} castShadow>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#b7e33a" roughness={0.4} />
      </mesh>
      <mesh ref={ballBRef} position={[START_X, 0.18, LANE_B_Z]} castShadow>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#3c82f6" roughness={0.4} />
      </mesh>
    </>
  );
}

export function MotionAndTimeSandbox3D() {
  const stateRef = useRef<RaceState>({ phase: "idle", posA: 0, posB: 0, finishedA: false, finishedB: false, startTime: 0, timeA: 0, timeB: 0 });

  const [speedA, setSpeedA] = useState(4);
  const [speedB, setSpeedB] = useState(6);
  const [guess, setGuess] = useState<Racer>("A");
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  const handleFinish = (tA: number, tB: number) => {
    setPhase("done");
    const winner: Racer = tA < tB ? "A" : tB < tA ? "B" : "A";
    const gap = Math.abs(tA - tB);
    setLog((prev) => [
      ...prev,
      `A crossed the finish line in ${tA.toFixed(1)} s. B crossed in ${tB.toFixed(1)} s.`,
      tA === tB
        ? "Both covered the same distance in exactly the same time — a dead heat."
        : `${winner} covered the same distance (${FINISH_UNITS} units) in less time — that's a greater speed. Speed is distance covered per unit of time.`,
      gap === 0 ? "" : guess === winner ? `Your prediction (${guess}) was correct — ${winner} won by ${gap.toFixed(1)} s.` : `Your prediction (${guess}) didn't win this time — ${winner} finished first by ${gap.toFixed(1)} s.`,
    ].filter(Boolean));
  };

  const launch = () => {
    if (stateRef.current.phase === "running") return;
    stateRef.current = { phase: "running", posA: 0, posB: 0, finishedA: false, finishedB: false, startTime: performance.now(), timeA: 0, timeB: 0 };
    setPhase("running");
    setLog((prev) => [...prev, `Both released — A at ${speedA} u/s, B at ${speedB} u/s.`]);
  };

  const reset = () => {
    stateRef.current = { phase: "idle", posA: 0, posB: 0, finishedA: false, finishedB: false, startTime: 0, timeA: 0, timeB: 0 };
    setPhase("idle");
    setLog(["Ready"]);
  };

  const busy = phase === "running";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="speed-a-3d">Speed A (lime) <span className="mono">{speedA} u/s</span></label>
          <input id="speed-a-3d" type="range" min={1} max={10} value={speedA} disabled={busy} onChange={(e) => setSpeedA(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="speed-b-3d">Speed B (blue) <span className="mono">{speedB} u/s</span></label>
          <input id="speed-b-3d" type="range" min={1} max={10} value={speedB} disabled={busy} onChange={(e) => setSpeedB(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>Who do you predict finishes first?</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={guess === "A"} disabled={busy} onClick={() => setGuess("A")}>A</button>
          <button type="button" className="kx-sandbox-chip" data-active={guess === "B"} disabled={busy} onClick={() => setGuess("B")}>B</button>
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.2, 2.6, 4]} target={[0, 0.1, 0]} minDistance={2.6} maxDistance={10}>
        <RaceScene stateRef={stateRef} speedA={speedA} speedB={speedB} onFinish={handleFinish} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={launch} disabled={busy}>
          {phase === "done" ? "Run Again" : "Start Race"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
