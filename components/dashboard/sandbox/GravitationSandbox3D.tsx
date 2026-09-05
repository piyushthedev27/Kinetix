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

const TOP_Y = 3;
const FLOOR_Y = 0.2;
const GRAVITY = 3.4;
const FEATHER_DRAG = 3.2;
const BALL_X = -0.7;
const FEATHER_X = 0.7;

type Guess = "together" | "ball-first";
type Phase = "idle" | "falling" | "done";

interface DropState {
  phase: Phase;
  ballY: number;
  featherY: number;
  ballVy: number;
  featherVy: number;
  ballLanded: number | null;
  featherLanded: number | null;
  startTime: number;
}

interface SceneProps {
  stateRef: MutableRefObject<DropState>;
  airResistance: boolean;
  onDone: (tBall: number, tFeather: number) => void;
}

function DropScene({ stateRef, airResistance, onDone }: SceneProps) {
  const ballRef = useRef<THREE.Mesh>(null);
  const featherRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = stateRef.current;
    if (s.phase === "falling") {
      const now = performance.now();
      if (s.ballLanded === null) {
        s.ballVy += GRAVITY * dt;
        s.ballY = Math.max(FLOOR_Y, s.ballY - s.ballVy * dt);
        if (s.ballY <= FLOOR_Y) s.ballLanded = now;
      }
      if (s.featherLanded === null) {
        const drag = airResistance ? FEATHER_DRAG * s.featherVy * dt : 0;
        s.featherVy += GRAVITY * dt - drag;
        s.featherY = Math.max(FLOOR_Y, s.featherY - s.featherVy * dt);
        if (s.featherY <= FLOOR_Y) s.featherLanded = now;
      }
      if (s.ballLanded !== null && s.featherLanded !== null) {
        s.phase = "done";
        onDone((s.ballLanded - s.startTime) / 1000, (s.featherLanded - s.startTime) / 1000);
      }
    }
    if (ballRef.current) ballRef.current.position.y = s.ballY;
    if (featherRef.current) featherRef.current.position.y = s.featherY;
  });

  return (
    <>
      <Ground width={6} depth={6} />
      {[BALL_X, FEATHER_X].map((x, i) => (
        <mesh key={i} position={[x, (TOP_Y + FLOOR_Y) / 2, 0]}>
          <cylinderGeometry args={[0.005, 0.005, TOP_Y - FLOOR_Y, 6]} />
          <meshStandardMaterial color="#c8d0ca" transparent opacity={0.5} />
        </mesh>
      ))}
      <mesh ref={ballRef} position={[BALL_X, TOP_Y, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#3c82f6" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh ref={featherRef} position={[FEATHER_X, TOP_Y, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 20]} />
        <meshStandardMaterial color="#f59a3d" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

export function GravitationSandbox3D() {
  const stateRef = useRef<DropState>({ phase: "idle", ballY: TOP_Y, featherY: TOP_Y, ballVy: 0, featherVy: 0, ballLanded: null, featherLanded: null, startTime: 0 });

  const [airResistance, setAirResistance] = useState(false);
  const [guess, setGuess] = useState<Guess>("together");
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  const handleDone = (tBall: number, tFeather: number) => {
    const gap = Math.abs(tBall - tFeather);
    const landedTogether = gap < 0.08;
    setPhase("done");
    setLog((prev) => [
      ...prev,
      `Ball landed in ${tBall.toFixed(2)} s. Feather landed in ${tFeather.toFixed(2)} s.`,
      airResistance
        ? "With air resistance on, the feather's larger surface drags against the air and it falls slower — this is what you see with real feathers and paper."
        : "With air resistance off, gravity accelerates every mass equally — heavier does not mean faster. That's Galileo's famous result.",
      landedTogether === (guess === "together") ? "Your prediction was correct!" : "Your prediction didn't match — look at the two landing times above.",
    ]);
  };

  const drop = () => {
    if (stateRef.current.phase === "falling") return;
    stateRef.current = { phase: "falling", ballY: TOP_Y, featherY: TOP_Y, ballVy: 0, featherVy: 0, ballLanded: null, featherLanded: null, startTime: performance.now() };
    setPhase("falling");
    setLog((prev) => [...prev, `Dropped together — air resistance is ${airResistance ? "on" : "off"}.`]);
  };

  const reset = () => {
    stateRef.current = { phase: "idle", ballY: TOP_Y, featherY: TOP_Y, ballVy: 0, featherVy: 0, ballLanded: null, featherLanded: null, startTime: 0 };
    setPhase("idle");
    setLog(["Ready"]);
  };

  const busy = phase === "falling";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Air resistance</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={!airResistance} disabled={busy} onClick={() => setAirResistance(false)}>Off</button>
            <button type="button" className="kx-sandbox-chip" data-active={airResistance} disabled={busy} onClick={() => setAirResistance(true)}>On</button>
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label>Your prediction</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={guess === "together"} disabled={busy} onClick={() => setGuess("together")}>Land together</button>
            <button type="button" className="kx-sandbox-chip" data-active={guess === "ball-first"} disabled={busy} onClick={() => setGuess("ball-first")}>Heavier ball first</button>
          </div>
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.4, 2, 4]} target={[0, 1.4, 0]} minDistance={2.5} maxDistance={9}>
        <DropScene stateRef={stateRef} airResistance={airResistance} onDone={handleDone} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={drop} disabled={busy}>
          {phase === "done" ? "Drop Again" : "Drop Both"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
