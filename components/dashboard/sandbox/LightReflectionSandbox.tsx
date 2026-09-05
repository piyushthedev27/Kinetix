"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 260;
const MIRROR_Y = 200;
const POINT_X = 320;
const RAY_LENGTH = 170;

export function LightReflectionSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef(40);
  const predictionRef = useRef(40);
  const revealedRef = useRef(false);

  const [angle, setAngle] = useState(40);
  const [prediction, setPrediction] = useState(40);
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { angleRef.current = angle; }, [angle]);
  useEffect(() => { predictionRef.current = prediction; }, [prediction]);
  useEffect(() => { revealedRef.current = revealed; }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Mirror
      ctx.strokeStyle = "#17202a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(60, MIRROR_Y);
      ctx.lineTo(580, MIRROR_Y);
      ctx.stroke();
      ctx.strokeStyle = "#8b96a3";
      ctx.lineWidth = 1;
      for (let x = 60; x < 580; x += 14) {
        ctx.beginPath();
        ctx.moveTo(x, MIRROR_Y);
        ctx.lineTo(x - 8, MIRROR_Y + 10);
        ctx.stroke();
      }

      // Normal (dashed vertical)
      ctx.strokeStyle = "#c8d0ca";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(POINT_X, MIRROR_Y - RAY_LENGTH);
      ctx.lineTo(POINT_X, MIRROR_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      const incidenceRad = (angleRef.current * Math.PI) / 180;

      // Incident ray (from upper-left)
      const inX = POINT_X - RAY_LENGTH * Math.sin(incidenceRad);
      const inY = MIRROR_Y - RAY_LENGTH * Math.cos(incidenceRad);
      ctx.strokeStyle = "#f59a3d";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(inX, inY);
      ctx.lineTo(POINT_X, MIRROR_Y);
      ctx.stroke();
      ctx.fillStyle = "#f59a3d";
      ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("incident ray", inX, inY - 8);

      // Reflected ray — only shown once revealed, using the true law of reflection
      if (revealedRef.current) {
        const reflAngle = incidenceRad; // law of reflection
        const outX = POINT_X + RAY_LENGTH * Math.sin(reflAngle);
        const outY = MIRROR_Y - RAY_LENGTH * Math.cos(reflAngle);
        ctx.strokeStyle = "#3c82f6";
        ctx.beginPath();
        ctx.moveTo(POINT_X, MIRROR_Y);
        ctx.lineTo(outX, outY);
        ctx.stroke();
        ctx.fillStyle = "#3c82f6";
        ctx.fillText("reflected ray", outX, outY - 8);
      } else {
        // Show the learner's predicted ray as a faint guess line
        const predRad = (predictionRef.current * Math.PI) / 180;
        const px = POINT_X + RAY_LENGTH * Math.sin(predRad);
        const py = MIRROR_Y - RAY_LENGTH * Math.cos(predRad);
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = "#3c82f6";
        ctx.beginPath();
        ctx.moveTo(POINT_X, MIRROR_Y);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "#3c82f6";
        ctx.globalAlpha = 0.7;
        ctx.fillText("your guess", px, py - 8);
        ctx.globalAlpha = 1;
      }

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Angle of incidence: ${angleRef.current}°`, 60, 28);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reveal = () => {
    const actual = angleRef.current; // angle of reflection == angle of incidence
    const diff = Math.abs(actual - predictionRef.current);
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `The angle of reflection is ${actual}° — exactly equal to the angle of incidence. That's the Law of Reflection.`,
      diff <= 4 ? "Your predicted angle was right on!" : `Your predicted angle (${predictionRef.current}°) was off by ${diff}°.`,
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
          <label htmlFor="angle-slider">Angle of incidence <span className="mono">{angle}°</span></label>
          <input id="angle-slider" type="range" min={5} max={80} value={angle} onChange={(e) => { setAngle(Number(e.target.value)); setRevealed(false); }} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="prediction-slider">Predict the reflected angle <span className="mono">{prediction}°</span></label>
          <input id="prediction-slider" type="range" min={5} max={80} value={prediction} disabled={revealed} onChange={(e) => setPrediction(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

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
