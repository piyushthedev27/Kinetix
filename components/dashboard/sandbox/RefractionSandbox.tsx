"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 280;
const BOUNDARY_Y = 150;
const POINT_X = 320;
const RAY_LENGTH = 130;

type Medium = "water" | "glass";
const MEDIA: Record<Medium, { label: string; n: number; color: string }> = {
  water: { label: "Water", n: 1.33, color: "rgba(60,130,246,0.12)" },
  glass: { label: "Glass", n: 1.5, color: "rgba(139,150,163,0.18)" },
};

type Guess = "toward" | "away";

export function RefractionSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef(45);
  const mediumRef = useRef<Medium>("water");
  const revealedRef = useRef(false);

  const [angle, setAngle] = useState(45);
  const [medium, setMedium] = useState<Medium>("water");
  const [guess, setGuess] = useState<Guess>("toward");
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { angleRef.current = angle; }, [angle]);
  useEffect(() => { mediumRef.current = medium; }, [medium]);
  useEffect(() => { revealedRef.current = revealed; }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const med = MEDIA[mediumRef.current];

      // Medium fill (below boundary)
      ctx.fillStyle = med.color;
      ctx.fillRect(40, BOUNDARY_Y, CANVAS_WIDTH - 80, CANVAS_HEIGHT - BOUNDARY_Y - 20);

      // Boundary line
      ctx.strokeStyle = "#8b96a3";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, BOUNDARY_Y);
      ctx.lineTo(CANVAS_WIDTH - 40, BOUNDARY_Y);
      ctx.stroke();
      ctx.fillStyle = "#56616d";
      ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Air", 46, BOUNDARY_Y - 10);
      ctx.fillText(med.label, 46, BOUNDARY_Y + 20);

      // Normal
      ctx.strokeStyle = "#c8d0ca";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(POINT_X, BOUNDARY_Y - RAY_LENGTH);
      ctx.lineTo(POINT_X, BOUNDARY_Y + RAY_LENGTH * 0.8);
      ctx.stroke();
      ctx.setLineDash([]);

      const t1 = (angleRef.current * Math.PI) / 180;

      // Incident ray
      const inX = POINT_X - RAY_LENGTH * Math.sin(t1);
      const inY = BOUNDARY_Y - RAY_LENGTH * Math.cos(t1);
      ctx.strokeStyle = "#f59a3d";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(inX, inY);
      ctx.lineTo(POINT_X, BOUNDARY_Y);
      ctx.stroke();
      ctx.fillStyle = "#f59a3d";
      ctx.textAlign = "center";
      ctx.fillText("incident ray", inX, inY - 8);

      if (revealedRef.current) {
        const sinT2 = Math.sin(t1) / med.n;
        const t2 = Math.asin(Math.min(1, sinT2));
        const outX = POINT_X + RAY_LENGTH * 0.8 * Math.sin(t2);
        const outY = BOUNDARY_Y + RAY_LENGTH * 0.8 * Math.cos(t2);
        ctx.strokeStyle = "#3c82f6";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(POINT_X, BOUNDARY_Y);
        ctx.lineTo(outX, outY);
        ctx.stroke();
        ctx.fillStyle = "#3c82f6";
        ctx.fillText("refracted ray", outX, outY + 16);
      } else {
        // Faint straight-through guide (undeviated) so the bend is visible once revealed
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "#8b96a3";
        ctx.beginPath();
        ctx.moveTo(POINT_X, BOUNDARY_Y);
        ctx.lineTo(POINT_X + RAY_LENGTH * 0.8 * Math.sin(t1), BOUNDARY_Y + RAY_LENGTH * 0.8 * Math.cos(t1));
        ctx.stroke();
        ctx.restore();
      }

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Angle of incidence: ${angleRef.current}° into ${med.label} (n = ${med.n})`, 40, 26);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reveal = () => {
    const med = MEDIA[mediumRef.current];
    const t1 = (angleRef.current * Math.PI) / 180;
    const t2Deg = (Math.asin(Math.sin(t1) / med.n) * 180) / Math.PI;
    setRevealed(true);
    const actualBend: Guess = t2Deg < angleRef.current ? "toward" : "away";
    setLog((prev) => [
      ...prev,
      `Refraction angle = ${t2Deg.toFixed(1)}° (incidence was ${angleRef.current}°) — light bends toward the normal when entering a denser medium like ${med.label.toLowerCase()}.`,
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
          <label htmlFor="angle-slider">Angle of incidence <span className="mono">{angle}°</span></label>
          <input id="angle-slider" type="range" min={5} max={80} value={angle} onChange={(e) => { setAngle(Number(e.target.value)); setRevealed(false); }} />
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

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

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
