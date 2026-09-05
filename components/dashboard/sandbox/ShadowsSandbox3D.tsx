"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Ground } from "../sandbox3d/primitives";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const OBJ_HEIGHT = 1;

function ShadowScene({ lightHeight, lightDist }: { lightHeight: number; lightDist: number }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const bulbRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const pos: [number, number, number] = [-lightDist, lightHeight, 0];
    if (lightRef.current) {
      lightRef.current.position.set(...pos);
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();
    }
    if (bulbRef.current) bulbRef.current.position.set(...pos);
  });

  return (
    <>
      <Ground width={9} depth={6} />
      <directionalLight ref={lightRef} intensity={1.6} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <mesh ref={bulbRef}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#f5c83c" emissive="#f5c83c" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, OBJ_HEIGHT / 2, 0]} castShadow>
        <boxGeometry args={[0.3, OBJ_HEIGHT, 0.3]} />
        <meshStandardMaterial color="#3baa70" roughness={0.6} />
      </mesh>
    </>
  );
}

type Guess = "longer" | "shorter";

export function ShadowsSandbox3D() {
  const [lightHeight, setLightHeight] = useState(1.5);
  const [lightDist, setLightDist] = useState(2.5);
  const [guess, setGuess] = useState<Guess>("longer");
  const [log, setLog] = useState<string[]>(["Ready — move the light and watch the shadow."]);

  const raiseAndCheck = () => {
    const before = lightHeight;
    const after = Math.min(5, lightHeight + 1.5);
    setLightHeight(after);
    const actual: Guess = "shorter";
    setLog((prev) => [
      ...prev,
      `Raised the light from height ${before.toFixed(1)} to ${after.toFixed(1)}.`,
      "Raising the light source makes the rays fall more steeply, so the shadow shrinks — a light directly overhead casts almost no shadow at all.",
      guess === actual ? "Your prediction was correct!" : "Your prediction didn't match — try it again and watch the shadow shrink as the light rises.",
    ]);
  };

  const reset = () => {
    setLightHeight(1.5);
    setLightDist(2.5);
    setLog(["Ready — move the light and watch the shadow."]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="height-slider-3d">Light height <span className="mono">{lightHeight.toFixed(1)}</span></label>
          <input id="height-slider-3d" type="range" min={0.5} max={5} step={0.1} value={lightHeight} onChange={(e) => setLightHeight(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="dist-slider-3d">Light distance from object <span className="mono">{lightDist.toFixed(1)}</span></label>
          <input id="dist-slider-3d" type="range" min={1} max={4} step={0.1} value={lightDist} onChange={(e) => setLightDist(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>If the light is raised, will the shadow get longer or shorter?</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={guess === "longer"} onClick={() => setGuess("longer")}>Longer</button>
          <button type="button" className="kx-sandbox-chip" data-active={guess === "shorter"} onClick={() => setGuess("shorter")}>Shorter</button>
        </div>
      </div>

      <Scene3DShell cameraPosition={[2.6, 2.4, 4]} target={[0.5, 0.3, 0]} minDistance={2.8} maxDistance={10}>
        <ShadowScene lightHeight={lightHeight} lightDist={lightDist} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={raiseAndCheck}>Raise the Light &amp; Check</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
