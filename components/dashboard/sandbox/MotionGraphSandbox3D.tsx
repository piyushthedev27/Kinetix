"use client";

import { useRef, useState, type MutableRefObject } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Ground } from "../sandbox3d/primitives";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const TRACK_LEN = 6;
const FRICTION = 0.7;
const MAX_TIME = 8;

type Phase = "idle" | "running" | "done";

interface MotionState { phase: Phase; x: number; v: number; elapsed: number }

interface SceneProps {
  stateRef: MutableRefObject<MotionState>;
  onDone: (dist: number, time: number) => void;
}

function TrackScene({ stateRef, onDone }: SceneProps) {
  const ballRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = stateRef.current;
    if (s.phase === "running") {
      s.v *= 1 - FRICTION * dt;
      s.x = Math.min(TRACK_LEN, s.x + s.v * dt);
      s.elapsed += dt;
      if (s.v < 0.05 || s.elapsed >= MAX_TIME || s.x >= TRACK_LEN) {
        s.phase = "done";
        onDone(s.x, s.elapsed);
      }
    }
    if (ballRef.current) ballRef.current.position.x = -TRACK_LEN / 2 + s.x;
  });

  return (
    <>
      <Ground width={9} depth={4} />
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[TRACK_LEN + 0.6, 0.04, 0.5]} />
        <meshStandardMaterial color="#dfe4dc" roughness={0.85} />
      </mesh>
      <mesh ref={ballRef} position={[-TRACK_LEN / 2, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial color="#b7e33a" roughness={0.4} />
      </mesh>
    </>
  );
}

export function MotionGraphSandbox3D() {
  const stateRef = useRef<MotionState>({ phase: "idle", x: 0, v: 0, elapsed: 0 });
  const [speed, setSpeed] = useState(6);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  const handleDone = (dist: number, time: number) => {
    setPhase("done");
    setLog((prev) => [
      ...prev,
      `It travelled ${dist.toFixed(1)} units in ${time.toFixed(1)} s before friction brought it to rest.`,
      "In the 2D view you can watch the distance-time and speed-time graphs draw themselves as it slows — a straight line would mean constant speed, but this one bends because the speed itself is changing.",
    ]);
  };

  const launch = () => {
    if (stateRef.current.phase === "running") return;
    stateRef.current = { phase: "running", x: 0, v: speed, elapsed: 0 };
    setPhase("running");
    setLog((prev) => [...prev, `Launched at ${speed} u/s.`]);
  };

  const reset = () => {
    stateRef.current = { phase: "idle", x: 0, v: 0, elapsed: 0 };
    setPhase("idle");
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="speed-slider-3d">Launch speed <span className="mono">{speed} u/s</span></label>
        <input id="speed-slider-3d" type="range" min={2} max={10} value={speed} disabled={phase === "running"} onChange={(e) => setSpeed(Number(e.target.value))} />
      </div>

      <Scene3DShell cameraPosition={[1.6, 2, 4.5]} target={[0, 0.1, 0]} minDistance={2.5} maxDistance={11}>
        <TrackScene stateRef={stateRef} onDone={handleDone} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={launch} disabled={phase === "running"}>
          {phase === "done" ? "Run Again" : "Launch"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
