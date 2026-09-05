"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 260;
const LENS_X = 220;
const EYE_LENGTH = 140;
const RETINA_X = LENS_X + EYE_LENGTH;
const K = 0.15 * EYE_LENGTH;
const SPECTRUM = ["#e35d5d", "#f59a3d", "#e8d24a", "#3baa70", "#3c82f6", "#8b5cf6"];

type Defect = "normal" | "myopia" | "hyperopia";
type ViewMode = "eye" | "prism";

function naturalFocus(defect: Defect) {
  if (defect === "myopia") return 0.7 * EYE_LENGTH;
  if (defect === "hyperopia") return 1.3 * EYE_LENGTH;
  return EYE_LENGTH;
}

export function HumanEyeSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef<ViewMode>("eye");
  const defectRef = useRef<Defect>("myopia");
  const powerRef = useRef(0);
  const prismAngleRef = useRef(24);

  const [mode, setMode] = useState<ViewMode>("eye");
  const [defect, setDefect] = useState<Defect>("myopia");
  const [power, setPower] = useState(0);
  const [prismAngle, setPrismAngle] = useState(24);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { defectRef.current = defect; }, [defect]);
  useEffect(() => { powerRef.current = power; }, [power]);
  useEffect(() => { prismAngleRef.current = prismAngle; }, [prismAngle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const axisY = 130;

      if (modeRef.current === "eye") {
        const focusDistance = naturalFocus(defectRef.current) - K * powerRef.current;
        const focus = LENS_X + focusDistance; // absolute canvas x of the focus point

        // Eyeball outline
        ctx.strokeStyle = "#8b96a3";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse((LENS_X + RETINA_X) / 2, axisY, EYE_LENGTH / 2, 55, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Lens
        ctx.strokeStyle = "#3c82f6";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(LENS_X, axisY, 10, 50, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Retina
        ctx.strokeStyle = "#e35d5d";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(RETINA_X + 8, axisY, 55, Math.PI * 0.6, Math.PI * 1.4);
        ctx.stroke();

        // Rays converging to focus point
        const heights = [-40, -20, 20, 40];
        ctx.strokeStyle = "#f59a3d";
        ctx.lineWidth = 1.5;
        heights.forEach((h) => {
          ctx.beginPath();
          ctx.moveTo(40, axisY + h);
          ctx.lineTo(LENS_X, axisY + h);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(LENS_X, axisY + h);
          const extendX = Math.max(RETINA_X + 40, focus + 30);
          const t = (extendX - LENS_X) / (focus - LENS_X);
          ctx.lineTo(extendX, axisY + h * (1 - t));
          ctx.stroke();
        });

        // Focus point marker
        ctx.beginPath();
        ctx.arc(focus, axisY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#17202a";
        ctx.fill();

        ctx.textAlign = "left";
        ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
        ctx.fillStyle = "#17202a";
        ctx.fillText(`Lens power: ${powerRef.current > 0 ? "+" : ""}${powerRef.current.toFixed(1)} D`, 40, 24);
        ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = "#56616d";
        ctx.fillText("Retina", RETINA_X - 10, axisY + 80);
        ctx.fillText("Lens", LENS_X - 10, axisY + 80);
      } else {
        // Prism dispersion view
        const apexX = 300;
        const apexY = 60;
        const spread = (prismAngleRef.current / 24) * 26;
        ctx.strokeStyle = "#17202a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(apexX, apexY);
        ctx.lineTo(apexX - 70, apexY + 150);
        ctx.lineTo(apexX + 70, apexY + 150);
        ctx.closePath();
        ctx.stroke();

        // White incoming ray
        ctx.strokeStyle = "#8b96a3";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(60, apexY + 90);
        ctx.lineTo(apexX - 25, apexY + 110);
        ctx.stroke();

        // Dispersed rays
        const originX = apexX - 25;
        const originY = apexY + 110;
        SPECTRUM.forEach((color, i) => {
          const angle = ((i - (SPECTRUM.length - 1) / 2) * spread) / SPECTRUM.length + 12;
          const rad = (angle * Math.PI) / 180;
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(originX + 260 * Math.cos(rad), originY + 260 * Math.sin(rad));
          ctx.stroke();
        });

        ctx.textAlign = "left";
        ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
        ctx.fillStyle = "#17202a";
        ctx.fillText("White light in → spectrum out", 40, 24);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const check = () => {
    const focus = naturalFocus(defectRef.current) - K * powerRef.current;
    const diff = Math.abs(focus - EYE_LENGTH);
    const status = diff <= 4 ? "forms exactly on the retina — a clear, sharp image." : focus < EYE_LENGTH ? "forms in front of the retina — still blurry, this is myopia (near-sightedness)." : "forms behind the retina — still blurry, this is hyperopia (far-sightedness).";
    setLog((prev) => [
      ...prev,
      `With a ${defectRef.current} eye and a ${powerRef.current > 0 ? "+" : ""}${powerRef.current.toFixed(1)} D lens, the image ${status}`,
      diff <= 4 ? "Correct! That's exactly how spectacles fix these defects — a diverging lens for myopia, a converging lens for hyperopia." : "Try adjusting the lens power until the focus point marker lines up with the retina.",
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
            <label htmlFor="power-slider">Corrective lens power <span className="mono">{power > 0 ? "+" : ""}{power.toFixed(1)} D</span></label>
            <input id="power-slider" type="range" min={-5} max={5} step={0.5} value={power} onChange={(e) => setPower(Number(e.target.value))} />
          </div>
        </div>
      ) : (
        <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
          <label htmlFor="prism-slider">Prism apex angle <span className="mono">{prismAngle}°</span></label>
          <input id="prism-slider" type="range" min={10} max={40} value={prismAngle} onChange={(e) => setPrismAngle(Number(e.target.value))} />
        </div>
      )}

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

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
