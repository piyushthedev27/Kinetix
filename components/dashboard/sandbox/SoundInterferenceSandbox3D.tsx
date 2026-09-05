"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const POINTS = 80;
const WIDTH = 4.2;
const CYCLES = 4;
const AMPLITUDE = 0.25;

function Waveform({ z, color, phaseOffsetDeg, combine }: { z: number; color: string; phaseOffsetDeg: number; combine?: boolean }) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const timeRef = useRef(0);
  const posArray = useMemo(() => new Float32Array(POINTS * 3), []);
  const phiRad = (phaseOffsetDeg * Math.PI) / 180;

  useFrame((_, delta) => {
    timeRef.current += Math.min(delta, 0.05) * 3;
    for (let i = 0; i < POINTS; i++) {
      const t = i / (POINTS - 1);
      const x = t * WIDTH - WIDTH / 2;
      const theta = t * CYCLES * Math.PI * 2 + timeRef.current;
      const y = combine ? AMPLITUDE * Math.sin(theta) + AMPLITUDE * Math.sin(theta + phiRad) : AMPLITUDE * Math.sin(theta + phiRad);
      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
    }
    if (geomRef.current) (geomRef.current.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <line>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[posArray, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
}

function InterferenceScene({ phaseOffset }: { phaseOffset: number }) {
  return (
    <>
      <Waveform z={-0.9} color="#3c82f6" phaseOffsetDeg={0} />
      <Text position={[-WIDTH / 2, 0.35, -0.9]} fontSize={0.13} color="#3c82f6" anchorX="left">Source A</Text>

      <Waveform z={0} color="#f59a3d" phaseOffsetDeg={phaseOffset} />
      <Text position={[-WIDTH / 2, 0.35, 0]} fontSize={0.13} color="#f59a3d" anchorX="left">Source B</Text>

      <Waveform z={0.9} color="#b7e33a" phaseOffsetDeg={phaseOffset} combine />
      <Text position={[-WIDTH / 2, 0.35, 0.9]} fontSize={0.13} color="#7a9e1f" anchorX="left">Combined</Text>
    </>
  );
}

type Guess = "louder" | "quieter";

export function SoundInterferenceSandbox3D() {
  const [phaseOffset, setPhaseOffset] = useState(0);
  const [guess, setGuess] = useState<Guess>("louder");
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  const reveal = () => {
    const phiRad = (phaseOffset * Math.PI) / 180;
    const combinedAmp = 2 * Math.abs(Math.cos(phiRad / 2));
    const actual: Guess | "about the same" = combinedAmp > 1.2 ? "louder" : combinedAmp < 0.5 ? "quieter" : "about the same";
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `At a ${phaseOffset}° phase difference, the combined wave's amplitude is ${combinedAmp.toFixed(2)}× a single source.`,
      phaseOffset === 0
        ? "In phase (0°): the waves line up crest-to-crest — constructive interference makes it louder."
        : phaseOffset === 180
          ? "Out of phase (180°): one wave's crest meets the other's trough — destructive interference nearly cancels the sound."
          : "Partway between in-phase and out-of-phase gives a partial boost or partial cancellation.",
      guess === actual ? "Your prediction matched!" : `Your prediction (${guess}) didn't quite match — the actual result was ${actual}.`,
    ]);
  };

  const reset = () => {
    setPhaseOffset(0);
    setRevealed(false);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="phase-slider-3d">Phase difference between the two sources <span className="mono">{phaseOffset}°</span></label>
        <input id="phase-slider-3d" type="range" min={0} max={180} step={15} value={phaseOffset} onChange={(e) => { setPhaseOffset(Number(e.target.value)); setRevealed(false); }} />
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>Predict the combined sound</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={guess === "louder"} disabled={revealed} onClick={() => setGuess("louder")}>Louder</button>
          <button type="button" className="kx-sandbox-chip" data-active={guess === "quieter"} disabled={revealed} onClick={() => setGuess("quieter")}>Quieter</button>
        </div>
      </div>

      <Scene3DShell cameraPosition={[1.2, 1.6, 4.2]} target={[0, 0.2, 0]} minDistance={2.8} maxDistance={10} groundY={-0.6}>
        <InterferenceScene phaseOffset={phaseOffset} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal} disabled={revealed}>Reveal</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
