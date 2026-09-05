"use client";

import { useRef, useState, type MutableRefObject } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Ground } from "../sandbox3d/primitives";

const Scene3DShell = dynamic(() => import("../sandbox3d/Scene3DShell").then((m) => m.Scene3DShell), {
  ssr: false,
  loading: () => <div className="kx-sandbox3d-wrap"><div className="kx-sandbox3d-loading">Loading 3D view…</div></div>,
});

const SLOPE = 0.45;
const X_RANGE = 2.4;
const ACCEL = 3.4;
const FRICTION_LOSS = 0.16;

type Phase = "idle" | "running" | "done";

function heightAt(s: number) {
  return Math.min(X_RANGE, Math.abs(s)) * SLOPE;
}

interface SwingState { phase: Phase; s: number; v: number; startHeight: number; peaks: number[]; lastSign: number }

interface SceneProps {
  stateRef: MutableRefObject<SwingState>;
  friction: boolean;
  onDone: (startH: number, finalPeak: number) => void;
}

function ValleyScene({ stateRef, friction, onDone }: SceneProps) {
  const ballRef = useRef<THREE.Mesh>(null);
  const peBarRef = useRef<THREE.Mesh>(null);
  const keBarRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.03);
    const st = stateRef.current;
    if (st.phase === "running") {
      const s = st.s;
      const vPrev = st.v;
      const dir = s === 0 ? st.lastSign : Math.sign(s);
      st.v += -dir * ACCEL * dt;
      const newS = s + st.v * dt;

      if (Math.sign(newS) !== Math.sign(s) && s !== 0) {
        if (friction) st.v *= 1 - FRICTION_LOSS;
        st.lastSign = Math.sign(newS) || st.lastSign;
      }
      st.s = Math.max(-X_RANGE, Math.min(X_RANGE, newS));

      if (Math.sign(vPrev) !== Math.sign(st.v) && Math.sign(s) === st.lastSign && s !== 0) {
        st.peaks = [...st.peaks, heightAt(s)];
      }
      if (st.peaks.length >= 3) {
        st.phase = "done";
        onDone(st.startHeight, st.peaks[st.peaks.length - 1]);
      }
    }

    const h = heightAt(st.s);
    if (ballRef.current) ballRef.current.position.set(st.s, h + 0.18, 0);

    const maxH = X_RANGE * SLOPE;
    const pe = h / maxH;
    const ke = Math.max(0, 1 - pe);
    if (peBarRef.current) { peBarRef.current.scale.y = Math.max(0.001, pe); peBarRef.current.position.y = (pe * 1.4) / 2; }
    if (keBarRef.current) { keBarRef.current.scale.y = Math.max(0.001, ke); keBarRef.current.position.y = (ke * 1.4) / 2; }
  });

  return (
    <>
      <Ground width={9} depth={5} />
      {/* Valley track as two angled ramps */}
      <mesh position={[-X_RANGE / 2, (X_RANGE * SLOPE) / 2, 0]} rotation={[0, 0, Math.atan2(X_RANGE * SLOPE, X_RANGE)]} receiveShadow castShadow>
        <boxGeometry args={[Math.hypot(X_RANGE, X_RANGE * SLOPE), 0.06, 0.6]} />
        <meshStandardMaterial color="#8b96a3" roughness={0.6} />
      </mesh>
      <mesh position={[X_RANGE / 2, (X_RANGE * SLOPE) / 2, 0]} rotation={[0, 0, -Math.atan2(X_RANGE * SLOPE, X_RANGE)]} receiveShadow castShadow>
        <boxGeometry args={[Math.hypot(X_RANGE, X_RANGE * SLOPE), 0.06, 0.6]} />
        <meshStandardMaterial color="#8b96a3" roughness={0.6} />
      </mesh>

      <mesh ref={ballRef} position={[0, 0.18, 0]} castShadow>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#b7e33a" roughness={0.4} />
      </mesh>

      {/* PE / KE bars */}
      <mesh ref={peBarRef} position={[-3.4, 0, -1.2]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#3c82f6" />
      </mesh>
      <mesh ref={keBarRef} position={[-2.8, 0, -1.2]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#f59a3d" />
      </mesh>
    </>
  );
}

export function WorkAndEnergySandbox3D() {
  const stateRef = useRef<SwingState>({ phase: "idle", s: 0, v: 0, startHeight: 0, peaks: [], lastSign: -1 });

  const [heightUnits, setHeightUnits] = useState(6);
  const [friction, setFriction] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  const handleDone = (startH: number, finalPeak: number) => {
    setPhase("done");
    setLog((prev) => [
      ...prev,
      friction
        ? `It started at a height worth ${(startH / SLOPE).toFixed(1)} u and, losing a little energy to friction on every pass, is now only reaching about ${(finalPeak / SLOPE).toFixed(1)} u — the energy didn't vanish, it converted to heat and sound.`
        : `With no friction, it keeps returning to almost the same height each time (${(finalPeak / SLOPE).toFixed(1)} u vs the ${(startH / SLOPE).toFixed(1)} u it started from) — potential energy converts fully to kinetic and back, over and over. Total mechanical energy stays constant.`,
    ]);
  };

  const release = () => {
    if (stateRef.current.phase === "running") return;
    const h0 = (heightUnits / 10) * X_RANGE * SLOPE;
    const s0 = -Math.min(X_RANGE, h0 / SLOPE);
    stateRef.current = { phase: "running", s: s0, v: 0, startHeight: heightAt(s0), peaks: [], lastSign: -1 };
    setPhase("running");
    setLog((prev) => [...prev, `Released from height ${heightUnits} u, friction ${friction ? "on" : "off"}.`]);
  };

  const reset = () => {
    stateRef.current = { phase: "idle", s: 0, v: 0, startHeight: 0, peaks: [], lastSign: -1 };
    setPhase("idle");
    setLog(["Ready"]);
  };

  const busy = phase === "running";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="height-slider-we3d">Release height <span className="mono">{heightUnits} u</span></label>
          <input id="height-slider-we3d" type="range" min={2} max={10} value={heightUnits} disabled={busy} onChange={(e) => setHeightUnits(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label>Friction</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={!friction} disabled={busy} onClick={() => setFriction(false)}>Off</button>
            <button type="button" className="kx-sandbox-chip" data-active={friction} disabled={busy} onClick={() => setFriction(true)}>On</button>
          </div>
        </div>
      </div>

      <Scene3DShell cameraPosition={[1.6, 1.8, 4.6]} target={[0, 0.4, 0]} minDistance={2.8} maxDistance={11}>
        <ValleyScene stateRef={stateRef} friction={friction} onDone={handleDone} />
      </Scene3DShell>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={release} disabled={busy}>
          {phase === "done" ? "Release Again" : "Release Ball"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
