"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 320;
const AMPLITUDE = 30;
const CYCLES = 5;

type Guess = "louder" | "quieter";

export function SoundInterferenceSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseOffsetRef = useRef(0); // degrees
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);

  const [phaseOffset, setPhaseOffset] = useState(0);
  const [guess, setGuess] = useState<Guess>("louder");
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { phaseOffsetRef.current = phaseOffset; }, [phaseOffset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = (t: number) => {
      const dt = lastFrameRef.current ? Math.min((t - lastFrameRef.current) / 1000, 0.05) : 0;
      lastFrameRef.current = t;
      timeRef.current += dt * 3;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const phiRad = (phaseOffsetRef.current * Math.PI) / 180;

      const rows: { label: string; y: number; color: string; fn: (theta: number) => number }[] = [
        { label: "Source A", y: 60, color: "#3c82f6", fn: (theta) => AMPLITUDE * Math.sin(theta) },
        { label: "Source B", y: 160, color: "#f59a3d", fn: (theta) => AMPLITUDE * Math.sin(theta + phiRad) },
        {
          label: "Combined",
          y: 260,
          color: "#b7e33a",
          fn: (theta) => AMPLITUDE * Math.sin(theta) + AMPLITUDE * Math.sin(theta + phiRad),
        },
      ];

      rows.forEach(({ label, y, color, fn }) => {
        ctx.strokeStyle = "#dde2de";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(CANVAS_WIDTH - 20, y);
        ctx.stroke();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x <= CANVAS_WIDTH - 40; x += 4) {
          const theta = (x / (CANVAS_WIDTH - 40)) * CYCLES * Math.PI * 2 + timeRef.current;
          const v = y - fn(theta);
          if (x === 0) ctx.moveTo(20 + x, v);
          else ctx.lineTo(20 + x, v);
        }
        ctx.stroke();

        ctx.fillStyle = "#56616d";
        ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(label, 20, y - 45);
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reveal = () => {
    const phiRad = (phaseOffsetRef.current * Math.PI) / 180;
    const combinedAmp = 2 * AMPLITUDE * Math.abs(Math.cos(phiRad / 2));
    const actual: Guess | "about the same" = combinedAmp > AMPLITUDE * 1.2 ? "louder" : combinedAmp < AMPLITUDE * 0.5 ? "quieter" : "about the same";
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `At a ${phaseOffsetRef.current}° phase difference, the combined wave's amplitude is ${combinedAmp.toFixed(0)} (each source alone is ${AMPLITUDE}).`,
      phaseOffsetRef.current === 0
        ? "In phase (0°): the waves line up crest-to-crest — constructive interference makes it louder."
        : phaseOffsetRef.current === 180
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
        <label htmlFor="phase-slider">Phase difference between the two sources <span className="mono">{phaseOffset}°</span></label>
        <input id="phase-slider" type="range" min={0} max={180} step={15} value={phaseOffset} onChange={(e) => { setPhaseOffset(Number(e.target.value)); setRevealed(false); }} />
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>Predict the combined sound</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={guess === "louder"} disabled={revealed} onClick={() => setGuess("louder")}>Louder</button>
          <button type="button" className="kx-sandbox-chip" data-active={guess === "quieter"} disabled={revealed} onClick={() => setGuess("quieter")}>Quieter</button>
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

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
