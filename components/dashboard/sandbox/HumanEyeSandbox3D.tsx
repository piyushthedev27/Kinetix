"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Line, Text } from "@react-three/drei";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const EYE_LENGTH = 2.2;
const K = 0.15 * EYE_LENGTH;
const SPECTRUM = ["#e35d5d", "#f59a3d", "#e8d24a", "#3baa70", "#3c82f6", "#8b5cf6"];

type Defect = "myopia" | "hyperopia";

function naturalFocus(defect: Defect) {
  return defect === "myopia" ? 0.7 * EYE_LENGTH : 1.3 * EYE_LENGTH;
}

function EyeScene({ defect, power }: { defect: Defect; power: number }) {
  const focusDist = naturalFocus(defect) - K * power;
  const heights = [-0.5, -0.25, 0.25, 0.5];

  return (
    <>
      <mesh position={[EYE_LENGTH / 2, 0, 0]} scale={[EYE_LENGTH / 2 / 0.62, 1, 1]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial color="#eef1ec" roughness={0.6} transparent opacity={0.3} />
      </mesh>
      {/* Lens */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <sphereGeometry args={[0.55, 24, 24, 0, Math.PI * 2, Math.PI / 2 - 0.4, 0.8]} />
        <meshStandardMaterial color="#3c82f6" roughness={0.1} metalness={0.2} transparent opacity={0.7} />
      </mesh>
      <Text position={[0, -0.85, 0]} fontSize={0.13} color="#56616d" anchorX="center">Lens</Text>

      {/* Retina */}
      <mesh position={[EYE_LENGTH, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[0.62, 24, 24, 0, Math.PI * 2, Math.PI / 2 - 0.5, 1]} />
        <meshStandardMaterial color="#e35d5d" roughness={0.5} wireframe />
      </mesh>
      <Text position={[EYE_LENGTH + 0.15, -0.85, 0]} fontSize={0.13} color="#56616d" anchorX="center">Retina</Text>

      {heights.map((h, i) => (
        <group key={i}>
          <Line points={[[-1.4, h, 0], [0, h, 0]]} color="#f59a3d" lineWidth={1.5} />
          <Line points={[[0, h, 0], [EYE_LENGTH + 0.4, h * (1 - (EYE_LENGTH + 0.4) / focusDist), 0]]} color="#f59a3d" lineWidth={1.5} />
        </group>
      ))}

      <mesh position={[focusDist, 0, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#17202a" />
      </mesh>
    </>
  );
}

function PrismScene({ prismAngle }: { prismAngle: number }) {
  const spread = (prismAngle / 24) * 0.55;
  const originX = -0.3;

  return (
    <>
      <mesh position={[0.4, 0, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.9, 1.8, 3]} />
        <meshPhysicalMaterial color="#dfe6ea" roughness={0.05} transmission={0.7} transparent opacity={0.6} />
      </mesh>
      <Line points={[[-2, -0.3, 0], [originX, -0.15, 0]]} color="#8b96a3" lineWidth={3} />
      {SPECTRUM.map((color, i) => {
        const angle = ((i - (SPECTRUM.length - 1) / 2) * spread) / SPECTRUM.length + 0.2;
        const x = originX + 2.6 * Math.cos(angle);
        const y = -0.15 - 2.6 * Math.sin(angle);
        return <Line key={color} points={[[originX, -0.15, 0], [x, y, 0]]} color={color} lineWidth={2} />;
      })}
    </>
  );
}

export function HumanEyeSandbox3D() {
  const [mode, setMode] = useState<"eye" | "prism">("eye");
  const [defect, setDefect] = useState<Defect>("myopia");
  const [power, setPower] = useState(0);
  const [prismAngle, setPrismAngle] = useState(24);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const check = () => {
    const focus = naturalFocus(defect) - K * power;
    const diff = Math.abs(focus - EYE_LENGTH);
    const status = diff <= 0.15 ? "forms exactly on the retina — a clear, sharp image." : focus < EYE_LENGTH ? "forms in front of the retina — still blurry, this is myopia (near-sightedness)." : "forms behind the retina — still blurry, this is hyperopia (far-sightedness).";
    setLog((prev) => [
      ...prev,
      `With a ${defect} eye and a ${power > 0 ? "+" : ""}${power.toFixed(1)} D lens, the image ${status}`,
      diff <= 0.15 ? "Correct! That's exactly how spectacles fix these defects — a diverging lens for myopia, a converging lens for hyperopia." : "Try adjusting the lens power until the focus point marker lines up with the retina.",
    ]);
  };

  const reset = () => {
    setDefect("myopia");
    setPower(0);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>View</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={mode === "eye"} onClick={() => setMode("eye")}>Eye defects</button>
          <button type="button" className="kx-sandbox-chip" data-active={mode === "prism"} onClick={() => setMode("prism")}>Prism dispersion</button>
        </div>
      </div>

      {mode === "eye" ? (
        <div className="kx-sandbox-setup">
          <div className="kx-sandbox-field">
            <label>Eye condition</label>
            <div className="kx-sandbox-chip-row">
              <button type="button" className="kx-sandbox-chip" data-active={defect === "myopia"} onClick={() => { setDefect("myopia"); setPower(0); }}>Myopia</button>
              <button type="button" className="kx-sandbox-chip" data-active={defect === "hyperopia"} onClick={() => { setDefect("hyperopia"); setPower(0); }}>Hyperopia</button>
            </div>
          </div>
          <div className="kx-sandbox-field">
            <label htmlFor="power-slider-3d">Corrective lens power <span className="mono">{power > 0 ? "+" : ""}{power.toFixed(1)} D</span></label>
            <input id="power-slider-3d" type="range" min={-5} max={5} step={0.5} value={power} onChange={(e) => setPower(Number(e.target.value))} />
          </div>
        </div>
      ) : (
        <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
          <label htmlFor="prism-slider-3d">Prism apex angle <span className="mono">{prismAngle}°</span></label>
          <input id="prism-slider-3d" type="range" min={10} max={40} value={prismAngle} onChange={(e) => setPrismAngle(Number(e.target.value))} />
        </div>
      )}

      <Scene3DShell cameraPosition={[2.4, 1.6, 4]} target={[0.8, 0, 0]} minDistance={2.5} maxDistance={10} groundY={-1.2}>
        {mode === "eye" ? <EyeScene defect={defect} power={power} /> : <PrismScene prismAngle={prismAngle} />}
      </Scene3DShell>

      {mode === "eye" && (
        <div className="kx-sandbox-actions">
          <button type="button" className="kx-btn kx-btn-primary" onClick={check}>Check Focus</button>
          <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
        </div>
      )}

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
