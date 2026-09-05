"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Line, Text } from "@react-three/drei";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const RAY_LENGTH = 2;

type Medium = "water" | "glass";
const MEDIA: Record<Medium, { label: string; n: number; color: string }> = {
  water: { label: "Water", n: 1.33, color: "#7fb8f0" },
  glass: { label: "Glass", n: 1.5, color: "#c3cad1" },
};

function RefractionScene({ angle, medium, revealed }: { angle: number; medium: Medium; revealed: boolean }) {
  const med = MEDIA[medium];
  const t1 = (angle * Math.PI) / 180;
  const inX = -RAY_LENGTH * Math.sin(t1);
  const inY = RAY_LENGTH * Math.cos(t1);

  const sinT2 = Math.sin(t1) / med.n;
  const t2 = Math.asin(Math.min(1, sinT2));
  const outX = RAY_LENGTH * 0.8 * Math.sin(t2);
  const outY = -RAY_LENGTH * 0.8 * Math.cos(t2);
  const straightX = RAY_LENGTH * 0.8 * Math.sin(t1);
  const straightY = -RAY_LENGTH * 0.8 * Math.cos(t1);

  return (
    <>
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[5, 1.2, 3]} />
        <meshPhysicalMaterial color={med.color} roughness={0.05} transmission={0.6} thickness={1} transparent opacity={0.55} />
      </mesh>

      <Line points={[[0, 1.6, 0], [0, -1.2, 0]]} color="#c8d0ca" dashed dashSize={0.08} gapSize={0.06} />
      <Line points={[[inX, inY, 0], [0, 0, 0]]} color="#f59a3d" lineWidth={2.5} />
      <Text position={[inX, inY + 0.2, 0]} fontSize={0.13} color="#f59a3d" anchorX="center">incident ray</Text>

      {revealed ? (
        <>
          <Line points={[[0, 0, 0], [outX, outY, 0]]} color="#3c82f6" lineWidth={2.5} />
          <Text position={[outX, outY - 0.2, 0]} fontSize={0.13} color="#3c82f6" anchorX="center">refracted ray</Text>
        </>
      ) : (
        <Line points={[[0, 0, 0], [straightX, straightY, 0]]} color="#8b96a3" dashed dashSize={0.06} gapSize={0.05} transparent opacity={0.4} />
      )}

      <Text position={[-2, 0.6, 0]} fontSize={0.14} color="#56616d" anchorX="left">Air</Text>
      <Text position={[-2, -0.9, 0]} fontSize={0.14} color="#56616d" anchorX="left">{med.label}</Text>
    </>
  );
}

export function RefractionSandbox3D() {
  const [angle, setAngle] = useState(45);
  const [medium, setMedium] = useState<Medium>("water");
  const [guess, setGuess] = useState<"toward" | "away">("toward");
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const reveal = () => {
    const med = MEDIA[medium];
    const t1 = (angle * Math.PI) / 180;
    const t2Deg = (Math.asin(Math.sin(t1) / med.n) * 180) / Math.PI;
    setRevealed(true);
    const actualBend = t2Deg < angle ? "toward" : "away";
    setLog((prev) => [
      ...prev,
      `Refraction angle = ${t2Deg.toFixed(1)}° (incidence was ${angle}°) — light bends toward the normal when entering a denser medium like ${med.label.toLowerCase()}.`,
      guess === actualBend ? "Your prediction was correct!" : "Your prediction didn't match — going into a denser medium always bends the ray toward the normal.",
    ]);
  };

  const reset = () => {
    setAngle(45);
    setMedium("water");
    setGuess("toward");
    setRevealed(false);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="angle-slider-rf3d">Angle of incidence <span className="mono">{angle}°</span></label>
          <input id="angle-slider-rf3d" type="range" min={5} max={80} value={angle} onChange={(e) => { setAngle(Number(e.target.value)); setRevealed(false); }} />
        </div>
        <div className="kx-sandbox-field">
          <label>Medium</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={medium === "water"} onClick={() => { setMedium("water"); setRevealed(false); }}>Water</button>
            <button type="button" className="kx-sandbox-chip" data-active={medium === "glass"} onClick={() => { setMedium("glass"); setRevealed(false); }}>Glass</button>
          </div>
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>Predict: does it bend toward or away from the normal?</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={guess === "toward"} disabled={revealed} onClick={() => setGuess("toward")}>Toward normal</button>
          <button type="button" className="kx-sandbox-chip" data-active={guess === "away"} disabled={revealed} onClick={() => setGuess("away")}>Away from normal</button>
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.8, 1.2, 3.8]} target={[0, 0, 0]} minDistance={2.5} maxDistance={9} groundY={-1.2}>
        <RefractionScene angle={angle} medium={medium} revealed={revealed} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal} disabled={revealed}>Reveal Refracted Ray</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
