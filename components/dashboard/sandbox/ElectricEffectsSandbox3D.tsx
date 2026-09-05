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
const MAX_DEFLECTION = (80 * Math.PI) / 180;

function EffectsScene({ current }: { current: number }) {
  const coilRef = useRef<THREE.Mesh>(null);
  const needleRef = useRef<THREE.Group>(null);
  const bulbRef = useRef<THREE.Mesh>(null);
  const frac = current / MAX_CURRENT;

  useFrame(() => {
    if (coilRef.current) {
      const mat = coilRef.current.material as THREE.MeshStandardMaterial;
      mat.color.setRGB(0.47 + frac * 0.45, 0.51 - frac * 0.24, 0.55 - frac * 0.4);
    }
    if (needleRef.current) needleRef.current.rotation.y = frac * MAX_DEFLECTION;
    if (bulbRef.current) {
      (bulbRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1 + frac * 0.9;
    }
  });

  return (
    <>
      <Ground width={9} depth={5} />
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[7.5, 0.04, 0.06]} />
        <meshStandardMaterial color="#8b96a3" />
      </mesh>

      {/* Heating coil */}
      <group position={[-2.4, 0, 0]}>
        <mesh ref={coilRef} castShadow>
          <torusGeometry args={[0.35, 0.06, 12, 24]} />
          <meshStandardMaterial color="#78838d" roughness={0.4} metalness={0.3} />
        </mesh>
        <Text position={[0, -0.55, 0]} fontSize={0.13} color="#56616d" anchorX="center">Heating effect</Text>
      </group>

      {/* Compass */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshStandardMaterial color="#c8d0ca" side={THREE.DoubleSide} />
        </mesh>
        <group ref={needleRef}>
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.06, 0.02, 0.5]} />
            <meshStandardMaterial color="#3c82f6" />
          </mesh>
        </group>
        <Text position={[0, -0.55, 0]} fontSize={0.13} color="#56616d" anchorX="center">Magnetic effect</Text>
      </group>

      {/* Bulb */}
      <group position={[2.4, 0, 0]}>
        <mesh ref={bulbRef} position={[0, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial color="#f5c83c" emissive="#f5c83c" emissiveIntensity={0.1} roughness={0.4} />
        </mesh>
        <Text position={[0, -0.55, 0]} fontSize={0.13} color="#56616d" anchorX="center">Lighting effect</Text>
      </group>
    </>
  );
}

export function ElectricEffectsSandbox3D() {
  const [current, setCurrent] = useState(0);
  const [prediction, setPrediction] = useState(30);
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const reveal = () => {
    const actual = Math.round((current / MAX_CURRENT) * 80);
    const diff = Math.abs(actual - prediction);
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `At ${current.toFixed(1)} A, the compass deflects about ${actual}°.`,
      "The same current is simultaneously heating the coil, deflecting the compass, and lighting the bulb — three different effects, one cause.",
      diff <= 6 ? "Your predicted deflection was close!" : `Your predicted deflection (${prediction}°) was off by ${diff}°.`,
    ]);
  };

  const reset = () => {
    setCurrent(0);
    setRevealed(false);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="current-slider-3d">Current <span className="mono">{current.toFixed(1)} A</span></label>
          <input id="current-slider-3d" type="range" min={0} max={MAX_CURRENT} step={0.5} value={current} onChange={(e) => { setCurrent(Number(e.target.value)); setRevealed(false); }} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="prediction-slider-ee3d">Predict the compass deflection <span className="mono">{prediction}°</span></label>
          <input id="prediction-slider-ee3d" type="range" min={0} max={80} value={prediction} onChange={(e) => setPrediction(Number(e.target.value))} />
        </div>
      </div>

      <Scene3DShell cameraPosition={[1.2, 2.4, 4.8]} target={[0, 0, 0]} minDistance={3} maxDistance={12}>
        <EffectsScene current={current} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal}>
          {revealed ? "Check Again" : "Reveal"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
