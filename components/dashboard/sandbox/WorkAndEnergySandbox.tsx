"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 260;
const MID_X = CANVAS_WIDTH / 2;
const TROUGH_Y = 220;
const SLOPE = 0.42; // px of height per px of horizontal distance from trough
const X_RANGE = 260; // max horizontal distance from trough (px)
const ACCEL = 260; // px/s^2 directed toward the trough
const FRICTION_LOSS = 0.16; // fraction of speed lost each time it crosses the trough

type Phase = "idle" | "running" | "done";

function heightAt(s: number) {
  return Math.min(X_RANGE, Math.abs(s)) * SLOPE;
}

export function WorkAndEnergySandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sRef = useRef(0); // signed horizontal distance from trough, px
  const vRef = useRef(0); // signed velocity, px/s
  const startHeightRef = useRef(0);
  const peaksRef = useRef<number[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const heightUnitsRef = useRef(6);
  const frictionRef = useRef(false);
  const lastFrameRef = useRef(0);
  const lastSignRef = useRef(1);

  const [heightUnits, setHeightUnits] = useState(6);
  const [friction, setFriction] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { heightUnitsRef.current = heightUnits; }, [heightUnits]);
  useEffect(() => { frictionRef.current = friction; }, [friction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = (t: number) => {
      const dt = lastFrameRef.current ? Math.min((t - lastFrameRef.current) / 1000, 0.05) : 0;
      lastFrameRef.current = t;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Valley track
      ctx.strokeStyle = "#8b96a3";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(MID_X - X_RANGE, TROUGH_Y - X_RANGE * SLOPE);
      ctx.lineTo(MID_X, TROUGH_Y);
      ctx.lineTo(MID_X + X_RANGE, TROUGH_Y - X_RANGE * SLOPE);
      ctx.stroke();

      if (phaseRef.current === "running") {
        const s = sRef.current;
        const vPrev = vRef.current;
        const dir = s === 0 ? lastSignRef.current : Math.sign(s);
        vRef.current += -dir * ACCEL * dt;
        const newS = s + vRef.current * dt;

        if (Math.sign(newS) !== Math.sign(s) && s !== 0) {
          // crossed the trough
          if (frictionRef.current) vRef.current *= 1 - FRICTION_LOSS;
          lastSignRef.current = Math.sign(newS) || lastSignRef.current;
        }
        sRef.current = Math.max(-X_RANGE, Math.min(X_RANGE, newS));

        // A turning point: velocity changed sign away from the trough (a swing peak)
        if (Math.sign(vPrev) !== Math.sign(vRef.current) && Math.sign(s) === lastSignRef.current && s !== 0) {
          peaksRef.current = [...peaksRef.current, heightAt(s)];
        }

        if (peaksRef.current.length >= 3) {
          phaseRef.current = "done";
          setPhase("done");
          const startH = startHeightRef.current;
          const finalPeak = peaksRef.current[peaksRef.current.length - 1];
          setLog((prev) => [
            ...prev,
            frictionRef.current
              ? `It started at a height worth ${(startH / SLOPE / 10).toFixed(1)} u and, losing a little energy to friction on every pass, is now only reaching about ${(finalPeak / SLOPE / 10).toFixed(1)} u — the energy didn't vanish, it converted to heat and sound.`
              : `With no friction, it keeps returning to almost the same height each time (${(finalPeak / SLOPE / 10).toFixed(1)} u vs the ${(startH / SLOPE / 10).toFixed(1)} u it started from) — potential energy converts fully to kinetic and back, over and over. Total mechanical energy stays constant.`,
          ]);
        }
      }

      const s = sRef.current;
      const h = heightAt(s);
      const ballX = MID_X + s;
      const ballY = TROUGH_Y - h;

      ctx.beginPath();
      ctx.arc(ballX, ballY - 10, 11, 0, Math.PI * 2);
      ctx.fillStyle = "#b7e33a";
      ctx.fill();
      ctx.strokeStyle = "#17202a";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // KE / PE bars
      const maxH = X_RANGE * SLOPE;
      const pe = h / maxH;
      const ke = Math.max(0, 1 - pe);
      const barX = 30;
      const barW = 26;
      const barBase = 200;
      ctx.fillStyle = "#3c82f6";
      ctx.fillRect(barX, barBase - pe * 140, barW, pe * 140);
      ctx.fillStyle = "#f59a3d";
      ctx.fillRect(barX + 40, barBase - ke * 140, barW, ke * 140);
      ctx.fillStyle = "#56616d";
      ctx.font = "10px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PE", barX + barW / 2, barBase + 14);
      ctx.fillText("KE", barX + 40 + barW / 2, barBase + 14);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const release = () => {
    if (phaseRef.current === "running") return;
    const h0 = (heightUnitsRef.current / 10) * X_RANGE * SLOPE;
    const s0 = -Math.min(X_RANGE, h0 / SLOPE);
    sRef.current = s0;
    vRef.current = 0;
    lastSignRef.current = -1;
    startHeightRef.current = heightAt(s0);
    peaksRef.current = [];
    lastFrameRef.current = performance.now();
    phaseRef.current = "running";
    setPhase("running");
    setLog((prev) => [...prev, `Released from height ${heightUnitsRef.current} u, friction ${frictionRef.current ? "on" : "off"}.`]);
  };

  const reset = () => {
    sRef.current = 0;
    vRef.current = 0;
    peaksRef.current = [];
    phaseRef.current = "idle";
    setPhase("idle");
    setLog(["Ready"]);
  };

  const busy = phase === "running";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="height-slider">Release height <span className="mono">{heightUnits} u</span></label>
          <input id="height-slider" type="range" min={2} max={10} value={heightUnits} disabled={busy} onChange={(e) => setHeightUnits(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label>Friction</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={!friction} disabled={busy} onClick={() => setFriction(false)}>Off</button>
            <button type="button" className="kx-sandbox-chip" data-active={friction} disabled={busy} onClick={() => setFriction(true)}>On</button>
          </div>
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

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
