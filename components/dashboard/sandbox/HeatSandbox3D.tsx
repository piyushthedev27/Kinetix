"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const COLS = 4, ROWS = 3, LAYERS = 3;
const SPACING = 0.32;
const BOX_SIZE = [COLS * SPACING, ROWS * SPACING, LAYERS * SPACING] as const;

interface Particle { anchor: THREE.Vector3; pos: THREE.Vector3; vel: THREE.Vector3 }

function stateFor(temp: number) {
  if (temp < 33) return "Solid";
  if (temp < 66) return "Liquid";
  return "Gas";
}

function ParticleBox({ temp }: { temp: number }) {
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        for (let z = 0; z < LAYERS; z++) {
          const anchor = new THREE.Vector3(
            (x - (COLS - 1) / 2) * SPACING,
            (y - (ROWS - 1) / 2) * SPACING,
            (z - (LAYERS - 1) / 2) * SPACING
          );
          list.push({ anchor: anchor.clone(), pos: anchor.clone(), vel: new THREE.Vector3() });
        }
      }
    }
    return list;
  }, []);

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const colorRef = useRef(new THREE.Color("#3c82f6"));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const t01 = temp / 100;
    const springK = 24 * Math.pow(1 - t01, 2);
    const jitter = 3.2 * t01;
    const damping = 0.96;
    const bound = BOX_SIZE[0] / 2 - 0.06;

    const color = t01 < 0.33 ? "#3c82f6" : t01 < 0.66 ? "#3baa70" : "#e35d5d";
    colorRef.current.set(color);

    particles.forEach((p, i) => {
      p.vel.x += (Math.random() - 0.5) * jitter * dt * 60;
      p.vel.y += (Math.random() - 0.5) * jitter * dt * 60;
      p.vel.z += (Math.random() - 0.5) * jitter * dt * 60;
      p.vel.x += (p.anchor.x - p.pos.x) * springK * dt;
      p.vel.y += (p.anchor.y - p.pos.y) * springK * dt;
      p.vel.z += (p.anchor.z - p.pos.z) * springK * dt;
      p.vel.multiplyScalar(damping);
      p.pos.addScaledVector(p.vel, dt);
      p.pos.x = THREE.MathUtils.clamp(p.pos.x, -bound, bound);
      p.pos.y = THREE.MathUtils.clamp(p.pos.y, -bound, bound);
      p.pos.z = THREE.MathUtils.clamp(p.pos.z, -bound, bound);

      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.copy(p.pos);
        (mesh.material as THREE.MeshStandardMaterial).color.copy(colorRef.current);
      }
    });
  });

  return (
    <>
      <mesh>
        <boxGeometry args={[BOX_SIZE[0], BOX_SIZE[1], BOX_SIZE[2]]} />
        <meshStandardMaterial color="#eef1ec" transparent opacity={0.08} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...BOX_SIZE)]} />
        <lineBasicMaterial color="#8b96a3" />
      </lineSegments>
      {particles.map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }} castShadow>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#3c82f6" roughness={0.4} />
        </mesh>
      ))}
    </>
  );
}

export function HeatSandbox3D() {
  const [temp, setTemp] = useState(10);
  const [log, setLog] = useState<string[]>(["Ready"]);
  const lastStateRef = useRef("Solid");

  const handleChange = (v: number) => {
    setTemp(v);
    const state = stateFor(v);
    if (state !== lastStateRef.current) {
      lastStateRef.current = state;
      setLog((prev) => [
        ...prev,
        state === "Liquid"
          ? "Now behaving like a liquid — particles have enough energy to slide past each other, no longer locked in place."
          : state === "Gas"
            ? "Now behaving like a gas — particles have broken free entirely and jostle rapidly."
            : "Cooled back into a solid — particles vibrate in place but stay locked in their positions.",
      ]);
    }
  };

  const reset = () => {
    setTemp(10);
    lastStateRef.current = "Solid";
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="temp-slider-3d">Temperature <span className="mono">{temp}° — {stateFor(temp)}</span></label>
        <input id="temp-slider-3d" type="range" min={0} max={100} value={temp} onChange={(e) => handleChange(Number(e.target.value))} />
      </div>

      <Scene3DShell cameraPosition={[1.4, 1.2, 2.2]} target={[0, 0, 0]} minDistance={1.5} maxDistance={6} groundY={-0.6}>
        <ParticleBox temp={temp} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
