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

type Shape = "block" | "pin";
const SHAPES: Record<Shape, { label: string; area: number; halfWidth: number; color: string }> = {
  block: { label: "Flat block", area: 9, halfWidth: 0.45, color: "#3c82f6" },
  pin: { label: "Pin", area: 1, halfWidth: 0.06, color: "#f59a3d" },
};
const MAX_DEPTH = 0.4;
const DEPTH_SCALE = 0.032;
const REST_Y = 1.1;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Phase = "idle" | "pressing" | "done";

interface PressState {
  phase: Phase;
  depth: number;
  targetDepth: number;
  pressStart: number;
}

interface SceneProps {
  stateRef: MutableRefObject<PressState>;
  shape: Shape;
  onDone: () => void;
}

function PressScene({ stateRef, shape, onDone }: SceneProps) {
  const objRef = useRef<THREE.Group>(null);
  const cushionRef = useRef<THREE.Mesh>(null);
  const s = SHAPES[shape];

  useFrame(() => {
    const state = stateRef.current;
    if (state.phase === "pressing") {
      const elapsed = performance.now() - state.pressStart;
      const progress = Math.min(1, elapsed / 700);
      state.depth = state.targetDepth * easeOutCubic(progress);
      if (progress >= 1) {
        state.phase = "done";
        onDone();
      }
    }
    if (objRef.current) objRef.current.position.y = REST_Y - state.depth;
    if (cushionRef.current) cushionRef.current.position.y = 0.15 - state.depth * 0.4;
  });

  return (
    <>
      <Ground width={7} depth={5} color="#e4e8e2" />
      <mesh ref={cushionRef} position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.3, 1.6]} />
        <meshStandardMaterial color="#dff0d8" roughness={0.9} />
      </mesh>

      {shape === "block" ? (
        <group ref={objRef} position={[0, REST_Y, 0]}>
          <mesh castShadow>
            <boxGeometry args={[s.halfWidth * 2, 0.3, 0.7]} />
            <meshStandardMaterial color={s.color} roughness={0.5} />
          </mesh>
        </group>
      ) : (
        <group ref={objRef} position={[0, REST_Y, 0]}>
          <mesh castShadow rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[s.halfWidth * 4, 0.4, 24]} />
            <meshStandardMaterial color={s.color} roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      )}
    </>
  );
}

export function ForceAndPressureSandbox3D() {
  const stateRef = useRef<PressState>({ phase: "idle", depth: 0, targetDepth: 0, pressStart: 0 });

  const [shape, setShape] = useState<Shape>("block");
  const [force, setForce] = useState(5);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  const handleDone = () => {
    setPhase("done");
    const s = SHAPES[shape];
    const pressure = force / s.area;
    setLog((prev) => [
      ...prev,
      `Pressure = Force ÷ Area = ${force} ÷ ${s.area} = ${pressure.toFixed(2)}.`,
      shape === "pin"
        ? "Concentrating the same force onto a tiny area produces much more pressure — that's why a pin sinks in easily."
        : "Spreading the same force over a larger area produces much less pressure — that's why a flat block barely dents.",
    ]);
  };

  const press = () => {
    if (stateRef.current.phase === "pressing") return;
    const s = SHAPES[shape];
    const pressure = force / s.area;
    stateRef.current = { phase: "pressing", depth: 0, targetDepth: Math.min(MAX_DEPTH, pressure * DEPTH_SCALE), pressStart: performance.now() };
    setPhase("pressing");
    setLog((prev) => [...prev, `Pressing a ${s.label.toLowerCase()} down with ${force} units of force.`]);
  };

  const reset = () => {
    stateRef.current = { phase: "idle", depth: 0, targetDepth: 0, pressStart: 0 };
    setPhase("idle");
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Shape</label>
          <div className="kx-sandbox-chip-row">
            {(Object.keys(SHAPES) as Shape[]).map((id) => (
              <button key={id} type="button" className="kx-sandbox-chip" data-active={shape === id} disabled={phase === "pressing"} onClick={() => setShape(id)}>
                {SHAPES[id].label}
              </button>
            ))}
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="force-slider-fp3d">Force <span className="mono">{force}/10</span></label>
          <input id="force-slider-fp3d" type="range" min={1} max={10} value={force} disabled={phase === "pressing"} onChange={(e) => setForce(Number(e.target.value))} />
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.2, 2, 3.6]} target={[0, 0.6, 0]} minDistance={2.5} maxDistance={9}>
        <PressScene stateRef={stateRef} shape={shape} onDone={handleDone} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={press} disabled={phase === "pressing"}>
          {phase === "done" ? "Press Again" : "Apply Force"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
