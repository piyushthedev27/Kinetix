"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Ground } from "../sandbox3d/primitives";
import { Text } from "@react-three/drei";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const MAX_CURRENT = 10;
const MAX_DEFLECTION = (75 * Math.PI) / 180;

type Direction = "forward" | "reversed";
type Side = "left" | "right";

function WireScene({ current, direction }: { current: number; direction: Direction }) {
  const needleRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const frac = current / MAX_CURRENT;
  const sign = direction === "forward" ? 1 : -1;

  useFrame(() => {
    if (needleRef.current) needleRef.current.rotation.y = sign * frac * MAX_DEFLECTION;
    if (ringsRef.current) {
      ringsRef.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        (mesh.material as THREE.MeshStandardMaterial).opacity = 0.15 + frac * 0.5;
      });
    }
  });

  return (
    <>
      <Ground width={8} depth={5} />
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2, 12]} />
        <meshStandardMaterial color="#56616d" />
      </mesh>
      <mesh position={[0, sign > 0 ? 0.3 : 1.7, 0]} rotation={[sign > 0 ? Math.PI : 0, 0, 0]}>
        <coneGeometry args={[0.08, 0.16, 10]} />
        <meshStandardMaterial color="#56616d" />
      </mesh>

      <group ref={ringsRef}>
        {[0.5, 0.8, 1.1].map((r, i) => (
          <mesh key={i} position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r - 0.01, r, 32]} />
            <meshStandardMaterial color="#3c82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      <group position={[1.7, 1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.36, 32]} />
          <meshStandardMaterial color="#c8d0ca" side={THREE.DoubleSide} />
        </mesh>
        <group ref={needleRef}>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.5, 0.02, 0.06]} />
            <meshStandardMaterial color="#3c82f6" />
          </mesh>
        </group>
        <Text position={[0, -0.55, 0]} fontSize={0.13} color="#56616d" anchorX="center">compass</Text>
      </group>
    </>
  );
}

export function MagneticEffectsSandbox3D() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<Direction>("forward");
  const [guess, setGuess] = useState<Side>("right");
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const reveal = () => {
    const sign = direction === "forward" ? 1 : -1;
    const deflectedSide: Side = sign > 0 ? "right" : "left";
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `The compass needle deflects to the ${deflectedSide} — reversing the current direction reverses the magnetic field's direction around the wire.`,
      guess === deflectedSide ? "Your prediction was correct!" : "Your prediction didn't match — flip the direction toggle and watch the needle swing the other way.",
    ]);
  };

  const reset = () => {
    setCurrent(0);
    setDirection("forward");
    setRevealed(false);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="current-slider-me3d">Current <span className="mono">{current.toFixed(1)} A</span></label>
          <input id="current-slider-me3d" type="range" min={0} max={MAX_CURRENT} step={0.5} value={current} onChange={(e) => { setCurrent(Number(e.target.value)); setRevealed(false); }} />
        </div>
        <div className="kx-sandbox-field">
          <label>Current direction</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={direction === "forward"} onClick={() => { setDirection("forward"); setRevealed(false); }}>Downward</button>
            <button type="button" className="kx-sandbox-chip" data-active={direction === "reversed"} onClick={() => { setDirection("reversed"); setRevealed(false); }}>Upward</button>
          </div>
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>Predict which way the needle deflects</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={guess === "left"} disabled={revealed} onClick={() => setGuess("left")}>Left</button>
          <button type="button" className="kx-sandbox-chip" data-active={guess === "right"} disabled={revealed} onClick={() => setGuess("right")}>Right</button>
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.6, 2, 4.2]} target={[0.8, 0.8, 0]} minDistance={3} maxDistance={11}>
        <WireScene current={current} direction={direction} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal} disabled={revealed}>Reveal</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
