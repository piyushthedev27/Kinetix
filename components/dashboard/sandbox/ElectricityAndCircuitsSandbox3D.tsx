"use client";

import { useMemo, useRef, useState } from "react";
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
const BASE_SPEED = 0.9;

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

function CircuitScene({ switchClosed, wireConnected, cells }: { switchClosed: boolean; wireConnected: boolean; cells: number }) {
  const uRef = useRef(0);
  const dotRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bulbRef = useRef<THREE.Mesh>(null);
  const lit = switchClosed && wireConnected;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (lit) uRef.current += BASE_SPEED * cells * dt;
    dotRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const [x, z] = posOnPath(uRef.current + (i * TOTAL_LENGTH) / DOT_COUNT);
      mesh.position.set(x, WIRE_Y, z);
      mesh.visible = lit;
    });
    if (bulbRef.current) {
      const glow = lit ? 0.5 + 0.15 * cells : 0.05;
      (bulbRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glow;
    }
  });

  const wireBreakGap = wireConnected ? null : 0.35;

  return (
    <>
      <Ground width={7} depth={5} />

      {/* Wire edges */}
      {SEGMENTS.map(([a, b], i) => {
        if (i === 2 && wireBreakGap !== null) {
          const midX = (a.x + b.x) / 2;
          return (
            <group key={i}>
              <mesh position={[(a.x + midX - wireBreakGap) / 2, WIRE_Y, a.y]}>
                <boxGeometry args={[Math.abs(midX - wireBreakGap - a.x), 0.04, 0.04]} />
                <meshStandardMaterial color="#c8d0ca" />
              </mesh>
              <mesh position={[(midX + wireBreakGap + b.x) / 2, WIRE_Y, a.y]}>
                <boxGeometry args={[Math.abs(b.x - (midX + wireBreakGap)), 0.04, 0.04]} />
                <meshStandardMaterial color="#c8d0ca" />
              </mesh>
            </group>
          );
        }
        const len = a.distanceTo(b);
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        return (
          <mesh key={i} position={[(a.x + b.x) / 2, WIRE_Y, (a.y + b.y) / 2]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[len, 0.05, 0.05]} />
            <meshStandardMaterial color="#56616d" />
          </mesh>
        );
      })}

      {/* Battery cells on the left edge */}
      {Array.from({ length: cells }).map((_, i) => (
        <mesh key={i} position={[LEFT, WIRE_Y + 0.02, (TOP_Z + BOTTOM_Z) / 2 - 0.25 + i * 0.25]} castShadow>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <meshStandardMaterial color="#17202a" />
        </mesh>
      ))}
      <Text position={[LEFT - 0.35, WIRE_Y, (TOP_Z + BOTTOM_Z) / 2]} fontSize={0.13} color="#56616d" anchorX="center" rotation={[-Math.PI / 2, 0, 0]}>
        {`${cells} cell${cells > 1 ? "s" : ""}`}
      </Text>

      {/* Switch label */}
      <Text position={[0, WIRE_Y, BOTTOM_Z + 0.25]} fontSize={0.13} color="#56616d" anchorX="center">
        {wireConnected ? (switchClosed ? "switch: closed" : "switch: open") : "wire: broken"}
      </Text>

      {/* Bulb */}
      <mesh ref={bulbRef} position={[RIGHT, WIRE_Y + 0.1, (TOP_Z + BOTTOM_Z) / 2]} castShadow>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#f5c83c" emissive="#f5c83c" emissiveIntensity={0.05} roughness={0.4} />
      </mesh>

      {/* Current dots */}
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <mesh key={i} ref={(el) => { dotRefs.current[i] = el; }}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#3c82f6" />
        </mesh>
      ))}
    </>
  );
}

type Guess = "lit" | "dark";

export function ElectricityAndCircuitsSandbox3D() {
  const [switchClosed, setSwitchClosed] = useState(true);
  const [wireConnected, setWireConnected] = useState(true);
  const [cells, setCells] = useState(1);
  const [guess, setGuess] = useState<Guess>("lit");
  const [log, setLog] = useState<string[]>(["Ready"]);

  const check = () => {
    const lit = switchClosed && wireConnected;
    const actual: Guess = lit ? "lit" : "dark";
    let reason: string;
    if (!wireConnected) reason = "the wire is broken, so there's no complete path for current to flow, no matter the switch.";
    else if (!switchClosed) reason = "the switch is open, breaking the loop — current needs an unbroken path all the way around.";
    else reason = `the loop is complete and the switch is closed, so current flows and the bulb lights up${cells > 1 ? ` (brighter with ${cells} cells)` : ""}.`;

    setLog((prev) => [
      ...prev,
      `Checked: the bulb is ${actual === "lit" ? "lit" : "dark"} because ${reason}`,
      guess === actual ? "Your prediction was correct!" : `Your prediction (${guess}) didn't match.`,
    ]);
  };

  const reset = () => {
    setSwitchClosed(true);
    setWireConnected(true);
    setCells(1);
    setLog(["Ready"]);
  };

  const scene = useMemo(() => <CircuitScene switchClosed={switchClosed} wireConnected={wireConnected} cells={cells} />, [switchClosed, wireConnected, cells]);

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Switch</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={switchClosed} onClick={() => setSwitchClosed(true)}>Closed</button>
            <button type="button" className="kx-sandbox-chip" data-active={!switchClosed} onClick={() => setSwitchClosed(false)}>Open</button>
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label>Wire</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={wireConnected} onClick={() => setWireConnected(true)}>Connected</button>
            <button type="button" className="kx-sandbox-chip" data-active={!wireConnected} onClick={() => setWireConnected(false)}>Broken</button>
          </div>
        </div>
      </div>

      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="cells-slider-3d">Battery cells <span className="mono">{cells}</span></label>
          <input id="cells-slider-3d" type="range" min={1} max={3} value={cells} onChange={(e) => setCells(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label>Predict the bulb</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={guess === "lit"} onClick={() => setGuess("lit")}>Will light</button>
            <button type="button" className="kx-sandbox-chip" data-active={guess === "dark"} onClick={() => setGuess("dark")}>Stays dark</button>
          </div>
        </div>
      </div>

      <Scene3DShell cameraPosition={[1.4, 2.6, 3.6]} target={[0, 0, 0]} minDistance={2.5} maxDistance={9}>
        {scene}
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={check}>Check Prediction</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
