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

const MAGNET_W = 0.8;
const MAGNET_H = 0.28;
const MAGNET_D = 0.28;
const FIXED_X = -1.8;
const START_MOVABLE_X = 1.2;
const MIN_GAP = 0.22;
const TRACK_END_X = 2.6;
const K = 0.9;

type Orientation = "attract" | "repel";
type Phase = "idle" | "running" | "done";

interface MagnetState {
  phase: Phase;
  movableX: number;
  velocity: number;
}

function Magnet({ x, leftLabel, rightLabel }: { x: number; leftLabel: string; rightLabel: string }) {
  return (
    <group position={[x, MAGNET_H / 2 + 0.02, 0]}>
      <mesh position={[-MAGNET_W / 4, 0, 0]} castShadow>
        <boxGeometry args={[MAGNET_W / 2, MAGNET_H, MAGNET_D]} />
        <meshStandardMaterial color={leftLabel === "N" ? "#e35d5d" : "#3c82f6"} roughness={0.4} />
      </mesh>
      <mesh position={[MAGNET_W / 4, 0, 0]} castShadow>
        <boxGeometry args={[MAGNET_W / 2, MAGNET_H, MAGNET_D]} />
        <meshStandardMaterial color={rightLabel === "N" ? "#e35d5d" : "#3c82f6"} roughness={0.4} />
      </mesh>
      <Text position={[-MAGNET_W / 4, 0, MAGNET_D / 2 + 0.01]} fontSize={0.16} color="#fff">{leftLabel}</Text>
      <Text position={[MAGNET_W / 4, 0, MAGNET_D / 2 + 0.01]} fontSize={0.16} color="#fff">{rightLabel}</Text>
    </group>
  );
}

interface SceneProps {
  stateRef: MutableRefObject<MagnetState>;
  orientation: Orientation;
  onDone: () => void;
}

function MagnetScene({ stateRef, orientation, onDone }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.03);
    const s = stateRef.current;
    if (s.phase === "running") {
      const fixedRightEdge = FIXED_X + MAGNET_W / 2;
      const dist = Math.max(MIN_GAP, s.movableX - fixedRightEdge);
      const force = K / (dist * dist);
      const accel = (orientation === "repel" ? 1 : -1) * force;
      s.velocity += accel * dt;
      s.movableX += s.velocity * dt;

      if (orientation === "attract" && s.movableX - fixedRightEdge <= MIN_GAP) {
        s.movableX = fixedRightEdge + MIN_GAP;
        s.velocity = 0;
        s.phase = "done";
        onDone();
      } else if (orientation === "repel" && s.movableX >= TRACK_END_X) {
        s.movableX = TRACK_END_X;
        s.velocity = 0;
        s.phase = "done";
        onDone();
      }
    }
    if (groupRef.current) groupRef.current.position.x = s.movableX;
  });

  const movableLeftLabel = orientation === "attract" ? "S" : "N";

  return (
    <>
      <Ground width={8} depth={5} />
      <Magnet x={FIXED_X} leftLabel="N" rightLabel="S" />
      <group ref={groupRef} position={[START_MOVABLE_X, 0, 0]}>
        <Magnet x={0} leftLabel={movableLeftLabel} rightLabel={movableLeftLabel === "S" ? "N" : "S"} />
      </group>
    </>
  );
}

export function MagnetsSandbox3D() {
  const stateRef = useRef<MagnetState>({ phase: "idle", movableX: START_MOVABLE_X, velocity: 0 });

  const [orientation, setOrientation] = useState<Orientation>("attract");
  const [guess, setGuess] = useState<Orientation>("attract");
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  const handleDone = () => {
    setPhase("done");
    if (orientation === "attract") {
      setLog((prev) => [...prev, "Unlike poles (N and S) face each other — they pulled together and stuck. Unlike poles attract.", guess === "attract" ? "Your prediction was correct!" : "Your prediction didn't match — unlike poles always attract."]);
    } else {
      setLog((prev) => [...prev, "Like poles (N and N) face each other — they pushed apart. Like poles repel.", guess === "repel" ? "Your prediction was correct!" : "Your prediction didn't match — like poles always repel."]);
    }
  };

  const release = () => {
    if (stateRef.current.phase === "running") return;
    stateRef.current = { phase: "running", movableX: stateRef.current.phase === "done" ? START_MOVABLE_X : stateRef.current.movableX, velocity: 0 };
    setPhase("running");
    setLog((prev) => [...prev, `Released with ${orientation === "attract" ? "unlike (N–S)" : "like (N–N)"} poles facing each other.`]);
  };

  const reset = () => {
    stateRef.current = { phase: "idle", movableX: START_MOVABLE_X, velocity: 0 };
    setPhase("idle");
    setLog(["Ready"]);
  };

  const busy = phase === "running";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Facing poles</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={orientation === "attract"} disabled={busy} onClick={() => setOrientation("attract")}>N ↔ S</button>
            <button type="button" className="kx-sandbox-chip" data-active={orientation === "repel"} disabled={busy} onClick={() => setOrientation("repel")}>N ↔ N</button>
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label>Predict</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={guess === "attract"} disabled={busy} onClick={() => setGuess("attract")}>Attract</button>
            <button type="button" className="kx-sandbox-chip" data-active={guess === "repel"} disabled={busy} onClick={() => setGuess("repel")}>Repel</button>
          </div>
        </div>
      </div>

      <Scene3DShell cameraPosition={[1.5, 2.4, 5.4]} target={[-0.3, 0.1, 0]} minDistance={3} maxDistance={11}>
        <MagnetScene stateRef={stateRef} orientation={orientation} onDone={handleDone} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={release} disabled={busy}>
          {phase === "done" ? "Try Again" : "Release Magnet"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
