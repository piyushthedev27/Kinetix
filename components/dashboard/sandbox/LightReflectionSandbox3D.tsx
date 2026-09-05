"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Line, Text } from "@react-three/drei";
import { DoubleSide } from "three";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const RAY_LENGTH = 2.2;

function MirrorScene({ angle, prediction, revealed }: { angle: number; prediction: number; revealed: boolean }) {
  const incRad = (angle * Math.PI) / 180;
  const inX = -RAY_LENGTH * Math.sin(incRad);
  const inY = RAY_LENGTH * Math.cos(incRad);

  const showRad = (revealed ? angle : prediction) * (Math.PI / 180);
  const outX = RAY_LENGTH * Math.sin(showRad);
  const outY = RAY_LENGTH * Math.cos(showRad);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#b9c2c9" roughness={0.15} metalness={0.6} side={DoubleSide} />
      </mesh>

      <Line points={[[0, 0.01, 0], [0, 2.2, 0]]} color="#c8d0ca" dashed dashSize={0.08} gapSize={0.06} />
      <Line points={[[inX, inY, 0], [0, 0.01, 0]]} color="#f59a3d" lineWidth={2.5} />
      <Text position={[inX, inY + 0.2, 0]} fontSize={0.14} color="#f59a3d" anchorX="center">incident ray</Text>

      {revealed ? (
        <>
          <Line points={[[0, 0.01, 0], [outX, outY, 0]]} color="#3c82f6" lineWidth={2.5} />
          <Text position={[outX, outY + 0.2, 0]} fontSize={0.14} color="#3c82f6" anchorX="center">reflected ray</Text>
        </>
      ) : (
        <>
          <Line points={[[0, 0.01, 0], [outX, outY, 0]]} color="#3c82f6" dashed dashSize={0.06} gapSize={0.05} opacity={0.6} transparent />
          <Text position={[outX, outY + 0.2, 0]} fontSize={0.14} color="#3c82f6" anchorX="center">your guess</Text>
        </>
      )}
    </>
  );
}

export function LightReflectionSandbox3D() {
  const [angle, setAngle] = useState(40);
  const [prediction, setPrediction] = useState(40);
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const reveal = () => {
    const diff = Math.abs(angle - prediction);
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `The angle of reflection is ${angle}° — exactly equal to the angle of incidence. That's the Law of Reflection.`,
      diff <= 4 ? "Your predicted angle was right on!" : `Your predicted angle (${prediction}°) was off by ${diff}°.`,
    ]);
  };

  const reset = () => {
    setAngle(40);
    setPrediction(40);
    setRevealed(false);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="angle-slider-3d">Angle of incidence <span className="mono">{angle}°</span></label>
          <input id="angle-slider-3d" type="range" min={5} max={80} value={angle} onChange={(e) => { setAngle(Number(e.target.value)); setRevealed(false); }} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="prediction-slider-lr3d">Predict the reflected angle <span className="mono">{prediction}°</span></label>
          <input id="prediction-slider-lr3d" type="range" min={5} max={80} value={prediction} disabled={revealed} onChange={(e) => setPrediction(Number(e.target.value))} />
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.6, 2.2, 3.6]} target={[0, 1, 0]} minDistance={2.5} maxDistance={9} groundY={0}>
        <MirrorScene angle={angle} prediction={prediction} revealed={revealed} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal} disabled={revealed}>Reveal Reflected Ray</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
