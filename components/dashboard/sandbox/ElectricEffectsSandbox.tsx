"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 260;
const MAX_CURRENT = 10;
const MAX_DEFLECTION = 80; // degrees

function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

export function ElectricEffectsSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRef = useRef(0);
  const predictionRef = useRef(30);
  const [current, setCurrent] = useState(0);
  const [prediction, setPrediction] = useState(30);
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { predictionRef.current = prediction; }, [prediction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const c = currentRef.current;
      const frac = c / MAX_CURRENT;

      // Circuit wire
      ctx.strokeStyle = "#8b96a3";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 200);
      ctx.lineTo(580, 200);
      ctx.stroke();

      // 1. Heating effect: coil that glows from gray to red-hot
      const coilX = 140;
      const coilColor = lerpColor([120, 130, 140], [235, 70, 40], frac);
      ctx.strokeStyle = coilColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.moveTo(coilX + i * 8, 190);
        ctx.lineTo(coilX + i * 8 + 6, 170);
      }
      ctx.stroke();
      ctx.fillStyle = "#56616d";
      ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Heating effect", coilX + 24, 220);

      // 2. Magnetic effect: compass needle deflects near the wire
      const compassX = 320;
      const compassY = 140;
      const deflection = (frac * MAX_DEFLECTION * Math.PI) / 180;
      ctx.beginPath();
      ctx.arc(compassX, compassY, 22, 0, Math.PI * 2);
      ctx.strokeStyle = "#c8d0ca";
      ctx.stroke();
      ctx.save();
      ctx.translate(compassX, compassY);
      ctx.rotate(-Math.PI / 2 + deflection);
      ctx.strokeStyle = "#3c82f6";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -18);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#56616d";
      ctx.fillText("Magnetic effect", compassX, 190);
      ctx.fillText(`${Math.round(frac * MAX_DEFLECTION)}°`, compassX, 220);

      // 3. Light/current effect: bulb brightness
      const bulbX = 500;
      const bulbY = 165;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 14 + frac * 8, 0, Math.PI * 2);
      ctx.fillStyle = frac > 0 ? `rgba(245, 200, 60, ${Math.min(1, 0.25 + frac * 0.75)})` : "rgba(200,200,200,0.2)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 12, 0, Math.PI * 2);
      ctx.strokeStyle = "#17202a";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#56616d";
      ctx.fillText("Lighting effect", bulbX, 220);

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Current: ${c.toFixed(1)} A`, 60, 30);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reveal = () => {
    const actual = Math.round((currentRef.current / MAX_CURRENT) * MAX_DEFLECTION);
    const diff = Math.abs(actual - predictionRef.current);
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `At ${currentRef.current.toFixed(1)} A, the compass deflects about ${actual}°.`,
      "The same current is simultaneously heating the coil, deflecting the compass, and lighting the bulb — three different effects, one cause.",
      diff <= 6 ? "Your predicted deflection was close!" : `Your predicted deflection (${predictionRef.current}°) was off by ${diff}°.`,
    ]);
  };

  const reset = () => {
    setCurrent(0);
    setRevealed(false);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="current-slider">Current <span className="mono">{current.toFixed(1)} A</span></label>
          <input id="current-slider" type="range" min={0} max={MAX_CURRENT} step={0.5} value={current} onChange={(e) => { setCurrent(Number(e.target.value)); setRevealed(false); }} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="prediction-slider">Predict the compass deflection <span className="mono">{prediction}°</span></label>
          <input id="prediction-slider" type="range" min={0} max={MAX_DEFLECTION} value={prediction} onChange={(e) => setPrediction(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal}>
          {revealed ? "Check Again" : "Reveal"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
