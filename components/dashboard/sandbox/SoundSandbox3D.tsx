"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const POINTS = 80;
const WIDTH = 4.5;

function Waveform({ freq, amp, color }: { freq: number; amp: number; color: string }) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const phaseRef = useRef(0);
  const posArray = useMemo(() => new Float32Array(POINTS * 3), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    phaseRef.current += dt * (2 + freq);
    for (let i = 0; i < POINTS; i++) {
      const t = i / (POINTS - 1);
      const x = t * WIDTH - WIDTH / 2;
      const y = amp * Math.sin(t * freq * Math.PI * 2 + phaseRef.current);
      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = 0;
    }
    if (geomRef.current) {
      const attr = geomRef.current.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }
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

function MembraneScene({ freq, amp }: { freq: number; amp: number }) {
  const membraneRef = useRef<THREE.Mesh>(null);
  const phaseRef = useRef(0);

  useFrame((_, delta) => {
    phaseRef.current += delta * (2 + freq) * 2;
    if (membraneRef.current) {
      membraneRef.current.position.x = -WIDTH / 2 - 0.4 + amp * 0.006 * Math.sin(phaseRef.current);
    }
  });

  return (
    <>
      <mesh ref={membraneRef} position={[-WIDTH / 2 - 0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 1.4, 0.6]} />
        <meshStandardMaterial color="#f59a3d" roughness={0.5} />
      </mesh>
      <Waveform freq={freq} amp={amp * 0.02} color="#3c82f6" />
    </>
  );
}

export function SoundSandbox3D() {
  const [freq, setFreq] = useState(4);
  const [amp, setAmp] = useState(40);
  const [playing, setPlaying] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (oscRef.current) oscRef.current.frequency.value = 110 + freq * 60;
  }, [freq]);
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = Math.min(0.06, (amp / 60) * 0.06);
  }, [amp]);
  useEffect(() => () => { oscRef.current?.stop(); audioCtxRef.current?.close(); }, []);

  const togglePlay = () => {
    try {
      if (!playing) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = audioCtxRef.current ?? new AudioCtx();
        audioCtxRef.current = ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 110 + freq * 60;
        gain.gain.value = Math.min(0.06, (amp / 60) * 0.06);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
        setPlaying(true);
        setLog((prev) => [...prev, `Playing a ${(110 + freq * 60).toFixed(0)} Hz tone.`]);
      } else {
        oscRef.current?.stop();
        oscRef.current = null;
        gainRef.current = null;
        setPlaying(false);
        setLog((prev) => [...prev, "Stopped."]);
      }
    } catch {
      setLog((prev) => [...prev, "This browser blocked audio playback, but the waveform above still shows the same physics."]);
    }
  };

  const explain = () => {
    setLog((prev) => [
      ...prev,
      `Frequency controls pitch: ${(110 + freq * 60).toFixed(0)} Hz means ${(110 + freq * 60).toFixed(0)} vibrations per second — more vibrations per second sounds higher-pitched.`,
      `Amplitude controls loudness, not pitch: a bigger vibration (amplitude ${amp}) makes it louder, while the pitch stays set by frequency alone.`,
    ]);
  };

  const reset = () => {
    setFreq(4);
    setAmp(40);
    if (playing) togglePlay();
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="freq-slider-3d">Frequency (pitch) <span className="mono">{(110 + freq * 60).toFixed(0)} Hz</span></label>
          <input id="freq-slider-3d" type="range" min={1} max={10} step={0.5} value={freq} onChange={(e) => setFreq(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="amp-slider-3d">Amplitude (loudness) <span className="mono">{amp}</span></label>
          <input id="amp-slider-3d" type="range" min={10} max={70} value={amp} onChange={(e) => setAmp(Number(e.target.value))} />
        </div>
      </div>

      <Scene3DShell cameraPosition={[0.5, 1.2, 4]} target={[0.3, 0, 0]} minDistance={2.5} maxDistance={9} groundY={-1}>
        <MembraneScene freq={freq} amp={amp} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={togglePlay}>{playing ? "Stop Tone" : "Play Tone"}</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={explain}>Explain What Changed</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
