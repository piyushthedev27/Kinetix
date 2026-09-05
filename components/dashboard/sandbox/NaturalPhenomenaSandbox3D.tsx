"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Ground } from "../sandbox3d/primitives";
import { Line, Text } from "@react-three/drei";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

type ViewMode = "lightning" | "earthquake";
const WAVE_SPEED = 1.4;
const STATION = new THREE.Vector2(2.4, 1.6);

function boltPoints(): [number, number, number][] {
  const pts: [number, number, number][] = [[0, 2.4, 0]];
  let x = 0, y = 2.4;
  while (y > 0.05) {
    x += (Math.random() - 0.5) * 0.3;
    y -= 0.3;
    pts.push([x, Math.max(0.05, y), 0]);
  }
  return pts;
}

function LightningScene({ charge, flashKey }: { charge: number; flashKey: number }) {
  const glowRef = useRef<THREE.Mesh>(null);
  const bolt = useRef<[number, number, number][]>([]);
  const lastFlashKeyRef = useRef(0);

  if (flashKey > 0 && flashKey !== lastFlashKeyRef.current) {
    lastFlashKeyRef.current = flashKey;
    bolt.current = boltPoints();
  }

  useFrame(() => {
    if (glowRef.current) {
      const s = 0.5 + (charge / 100) * 0.5;
      glowRef.current.scale.setScalar(s);
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + (charge / 100) * 0.8;
    }
  });

  return (
    <>
      <Ground width={7} depth={5} />
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="#8b96a3" roughness={0.9} />
      </mesh>
      <mesh ref={glowRef} position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#f5c83c" emissive="#f5c83c" emissiveIntensity={0.3} transparent opacity={0.6} />
      </mesh>
      {flashKey > 0 && bolt.current.length > 1 && (
        <Line points={bolt.current} color="#f5c83c" lineWidth={3} />
      )}
    </>
  );
}

interface Ripple { pos: THREE.Vector2; startTime: number; arrived: boolean }

function EarthquakeScene({ ripples, onArrive }: { ripples: React.MutableRefObject<Ripple[]>; onArrive: () => void }) {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const now = performance.now() / 1000;
    ripples.current.forEach((r, i) => {
      const elapsed = now - r.startTime;
      const radius = Math.max(0.01, elapsed * WAVE_SPEED);
      const mesh = ringRefs.current[i];
      if (mesh) {
        mesh.scale.setScalar(radius);
        (mesh.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.6 - elapsed * 0.15);
      }
      const dist = r.pos.distanceTo(STATION);
      if (!r.arrived && radius >= dist) {
        r.arrived = true;
        onArrive();
      }
    });
  });

  return (
    <>
      <mesh position={[STATION.x, 0.02, STATION.y]}>
        <boxGeometry args={[0.12, 0.3, 0.12]} />
        <meshStandardMaterial color="#3c82f6" />
      </mesh>
      <Text position={[STATION.x, 0.55, STATION.y]} fontSize={0.12} color="#56616d" anchorX="center">station</Text>
      {ripples.current.map((r, i) => (
        <mesh key={i} ref={(el) => { ringRefs.current[i] = el; }} position={[r.pos.x, 0.02, r.pos.y]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.98, 1, 48]} />
          <meshStandardMaterial color="#e35d5d" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

export function NaturalPhenomenaSandbox3D() {
  const [mode, setMode] = useState<ViewMode>("lightning");
  const [charge, setCharge] = useState(0);
  const [flashKey, setFlashKey] = useState(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const [rippleTick, setRippleTick] = useState(0);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const chargeUp = () => {
    const next = Math.min(100, charge + 20);
    setCharge(next);
    if (next >= 100) {
      setFlashKey((k) => k + 1);
      setLog((prev) => [...prev, "Discharged! Static charge built up on the cloud until it suddenly jumped to the ground as a lightning bolt."]);
      setTimeout(() => setCharge(0), 500);
    } else {
      setLog((prev) => [...prev, `Charge building: ${next}%.`]);
    }
  };

  const handleGroundClick = (e: ThreeEvent<MouseEvent>) => {
    if (mode !== "earthquake") return;
    e.stopPropagation();
    ripplesRef.current = [{ pos: new THREE.Vector2(e.point.x, e.point.z), startTime: performance.now() / 1000, arrived: false }];
    setRippleTick((t) => t + 1);
    setLog((prev) => [...prev, "Epicenter set — seismic waves ripple outward until they reach the monitoring station."]);
  };

  const reset = () => {
    setCharge(0);
    setFlashKey(0);
    ripplesRef.current = [];
    setRippleTick((t) => t + 1);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>Phenomenon</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={mode === "lightning"} onClick={() => { setMode("lightning"); reset(); }}>Lightning</button>
          <button type="button" className="kx-sandbox-chip" data-active={mode === "earthquake"} onClick={() => { setMode("earthquake"); reset(); }}>Earthquake</button>
        </div>
      </div>

      <Scene3DShell cameraPosition={mode === "lightning" ? [3, 2.2, 4] : [2, 3.5, 4]} target={mode === "lightning" ? [0, 1.4, 0] : [0.5, 0, 0]} minDistance={2.5} maxDistance={11}>
        <group onClick={handleGroundClick}>
          {mode === "lightning" ? (
            <LightningScene charge={charge} flashKey={flashKey} />
          ) : (
            <>
              <Ground width={7} depth={5} />
              <EarthquakeScene ripples={ripplesRef} onArrive={() => setLog((prev) => [...prev, "Wave reached the station — seismographs record the shaking."])} key={rippleTick} />
            </>
          )}
        </group>
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        {mode === "lightning" && (
          <button type="button" className="kx-btn kx-btn-primary" onClick={chargeUp}>Build Static Charge</button>
        )}
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
