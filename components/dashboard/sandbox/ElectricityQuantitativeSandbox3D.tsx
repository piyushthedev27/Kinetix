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

const LEFT = -1.4, RIGHT = 1.4, TOP_Z = -0.8, BOTTOM_Z = 0.8, WIRE_Y = 0.05;
const DOT_COUNT = 10;

const SEGMENTS: [THREE.Vector2, THREE.Vector2][] = [
  [new THREE.Vector2(LEFT, TOP_Z), new THREE.Vector2(RIGHT, TOP_Z)],
  [new THREE.Vector2(RIGHT, TOP_Z), new THREE.Vector2(RIGHT, BOTTOM_Z)],
  [new THREE.Vector2(RIGHT, BOTTOM_Z), new THREE.Vector2(LEFT, BOTTOM_Z)],
  [new THREE.Vector2(LEFT, BOTTOM_Z), new THREE.Vector2(LEFT, TOP_Z)],
];
const SEG_LENGTHS = SEGMENTS.map(([a, b]) => a.distanceTo(b));
const TOTAL_LENGTH = SEG_LENGTHS.reduce((a, b) => a + b, 0);

function posOnPath(u: number): [number, number] {
  let d = ((u % TOTAL_LENGTH) + TOTAL_LENGTH) % TOTAL_LENGTH;
  for (let i = 0; i < SEGMENTS.length; i++) {
    if (d <= SEG_LENGTHS[i]) {
      const [a, b] = SEGMENTS[i];
      const t = SEG_LENGTHS[i] === 0 ? 0 : d / SEG_LENGTHS[i];
      return [a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t];
    }
    d -= SEG_LENGTHS[i];
  }
  return [SEGMENTS[0][0].x, SEGMENTS[0][0].y];
}

function CircuitScene({ voltage, resistance }: { voltage: number; resistance: number }) {
  const uRef = useRef(0);
  const dotRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bulbRef = useRef<THREE.Mesh>(null);
  const current = voltage / resistance;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    uRef.current += current * 0.35 * dt;
    dotRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const [x, z] = posOnPath(uRef.current + (i * TOTAL_LENGTH) / DOT_COUNT);
      mesh.position.set(x, WIRE_Y, z);
    });
    if (bulbRef.current) {
      (bulbRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = Math.min(1, 0.15 + current / 4);
    }
  });

  return (
    <>
      <Ground width={7} depth={5} />
      {SEGMENTS.map(([a, b], i) => {
        const len = a.distanceTo(b);
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        return (
          <mesh key={i} position={[(a.x + b.x) / 2, WIRE_Y, (a.y + b.y) / 2]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[len, 0.05, 0.05]} />
            <meshStandardMaterial color="#56616d" />
          </mesh>
        );
      })}

      <mesh position={[LEFT, WIRE_Y + 0.02, (TOP_Z + BOTTOM_Z) / 2]} castShadow>
        <boxGeometry args={[0.16, 0.2, 0.3]} />
        <meshStandardMaterial color="#17202a" />
      </mesh>
      <Text position={[LEFT - 0.35, WIRE_Y, (TOP_Z + BOTTOM_Z) / 2]} fontSize={0.13} color="#56616d" anchorX="center" rotation={[-Math.PI / 2, 0, 0]}>{`${voltage} V`}</Text>

      {/* Resistor zigzag on bottom edge */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-0.35 + (i + 0.5) * (0.7 / 6), WIRE_Y + (i % 2 === 0 ? 0.05 : -0.05), BOTTOM_Z]} rotation={[0, 0, i % 2 === 0 ? 0.5 : -0.5]}>
          <boxGeometry args={[0.14, 0.02, 0.02]} />
          <meshStandardMaterial color="#f59a3d" />
        </mesh>
      ))}
      <Text position={[0, WIRE_Y, BOTTOM_Z + 0.3]} fontSize={0.13} color="#56616d" anchorX="center">{`R = ${resistance} Ω`}</Text>

      <mesh ref={bulbRef} position={[RIGHT, WIRE_Y + 0.15, (TOP_Z + BOTTOM_Z) / 2]} castShadow>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color="#f5c83c" emissive="#f5c83c" emissiveIntensity={0.15} roughness={0.4} />
      </mesh>

      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <mesh key={i} ref={(el) => { dotRefs.current[i] = el; }}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#3c82f6" />
        </mesh>
      ))}
    </>
  );
}

export function ElectricityQuantitativeSandbox3D() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(3);
  const [prediction, setPrediction] = useState(2);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const reveal = () => {
    const actual = voltage / resistance;
    const diff = Math.abs(actual - prediction);
    setLog((prev) => [
      ...prev,
      `Current = Voltage ÷ Resistance = ${voltage} ÷ ${resistance} = ${actual.toFixed(2)} A (Ohm's Law).`,
      diff <= 0.3 ? "Your predicted current was close!" : `Your predicted current (${prediction} A) was off — try raising resistance and see current drop, or raising voltage and see it rise.`,
    ]);
  };

  const reset = () => {
    setVoltage(6);
    setResistance(3);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="voltage-slider-3d">Voltage <span className="mono">{voltage} V</span></label>
          <input id="voltage-slider-3d" type="range" min={1} max={12} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="resistance-slider-3d">Resistance <span className="mono">{resistance} Ω</span></label>
          <input id="resistance-slider-3d" type="range" min={1} max={12} value={resistance} onChange={(e) => setResistance(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="prediction-slider-eq3d">Predict the current <span className="mono">{prediction} A</span></label>
        <input id="prediction-slider-eq3d" type="range" min={0} max={10} step={0.5} value={prediction} onChange={(e) => setPrediction(Number(e.target.value))} />
      </div>

      <Scene3DShell cameraPosition={[1.4, 2.6, 3.6]} target={[0, 0, 0]} minDistance={2.5} maxDistance={9}>
        <CircuitScene voltage={voltage} resistance={resistance} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal}>Check Prediction</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
