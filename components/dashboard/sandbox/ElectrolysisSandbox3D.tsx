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

const MAX_BUBBLES = 40;
const LIQUID_TOP_Y = 1.2;
const LIQUID_BOTTOM_Y = 0.05;

interface Bubble { x: number; z: number; y: number; vy: number; r: number; active: boolean }

function ElectrolysisScene({ voltage }: { voltage: number }) {
  const bubbles = useRef<Bubble[]>(
    Array.from({ length: MAX_BUBBLES }, () => ({ x: 0, z: 0, y: 0, vy: 0, r: 0.02, active: false }))
  );
  const spawnAccum = useRef(0);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    spawnAccum.current += voltage * dt * 1.5;
    while (spawnAccum.current >= 1) {
      spawnAccum.current -= 1;
      const slot = bubbles.current.find((b) => !b.active);
      if (slot) {
        const electrodeX = Math.random() < 0.5 ? -0.35 : 0.35;
        slot.active = true;
        slot.x = electrodeX + (Math.random() - 0.5) * 0.08;
        slot.z = (Math.random() - 0.5) * 0.08;
        slot.y = LIQUID_BOTTOM_Y;
        slot.vy = 0.35 + Math.random() * 0.2;
        slot.r = 0.02 + Math.random() * 0.015;
      }
    }
    bubbles.current.forEach((b, i) => {
      if (b.active) {
        b.y += b.vy * dt;
        if (b.y >= LIQUID_TOP_Y) b.active = false;
      }
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.visible = b.active;
        mesh.position.set(b.x, b.y, b.z);
        mesh.scale.setScalar(b.r * 20);
      }
    });
  });

  return (
    <>
      <Ground width={6} depth={5} />
      {/* Beaker walls */}
      <mesh position={[0, 0.65, -0.5]}>
        <boxGeometry args={[1.6, 1.3, 0.03]} />
        <meshPhysicalMaterial color="#c8d0ca" transmission={0.7} transparent opacity={0.25} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.65, 0.5]}>
        <boxGeometry args={[1.6, 1.3, 0.03]} />
        <meshPhysicalMaterial color="#c8d0ca" transmission={0.7} transparent opacity={0.25} roughness={0.1} />
      </mesh>
      <mesh position={[-0.8, 0.65, 0]}>
        <boxGeometry args={[0.03, 1.3, 1]} />
        <meshPhysicalMaterial color="#c8d0ca" transmission={0.7} transparent opacity={0.25} roughness={0.1} />
      </mesh>
      <mesh position={[0.8, 0.65, 0]}>
        <boxGeometry args={[0.03, 1.3, 1]} />
        <meshPhysicalMaterial color="#c8d0ca" transmission={0.7} transparent opacity={0.25} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.5, LIQUID_TOP_Y - LIQUID_BOTTOM_Y, 0.9]} />
        <meshPhysicalMaterial color="#3c82f6" transmission={0.5} transparent opacity={0.2} roughness={0.05} />
      </mesh>

      {[-0.35, 0.35].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.6, 10]} />
            <meshStandardMaterial color="#56616d" metalness={0.4} roughness={0.5} />
          </mesh>
          <Text position={[x, 1.9, 0]} fontSize={0.12} color="#56616d" anchorX="center">{i === 0 ? "Electrode A" : "Electrode B"}</Text>
        </group>
      ))}

      {bubbles.current.map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#bcd8ff" transparent opacity={0.7} />
        </mesh>
      ))}
    </>
  );
}

export function ElectrolysisSandbox3D() {
  const [voltage, setVoltage] = useState(4);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const explain = () => {
    setLog((prev) => [
      ...prev,
      `At ${voltage} V, gas bubbles form steadily at both electrodes — passing an electric current through a solution drives a chemical reaction at each electrode. This is electrolysis.`,
      voltage >= 7
        ? "At high voltage, bubbles form fast and thick — more current means a faster chemical reaction."
        : voltage <= 2
          ? "At low voltage, bubbles form slowly, and below a certain threshold there isn't enough current to drive the reaction at all."
          : "At moderate voltage, bubbles form at a steady, moderate rate.",
    ]);
  };

  const reset = () => {
    setVoltage(4);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="voltage-slider-el3d">Voltage <span className="mono">{voltage} V</span></label>
        <input id="voltage-slider-el3d" type="range" min={0} max={10} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
      </div>

      <Scene3DShell cameraPosition={[1.6, 2, 3.4]} target={[0, 0.7, 0]} minDistance={2.4} maxDistance={9}>
        <ElectrolysisScene voltage={voltage} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={explain}>Explain What&apos;s Happening</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
