"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 240;
const LEFT = 120;
const RIGHT = 520;
const TOP = 60;
const BOTTOM = 180;
const DOT_COUNT = 10;

const SEGMENTS = [
  { x1: LEFT, y1: TOP, x2: RIGHT, y2: TOP },
  { x1: RIGHT, y1: TOP, x2: RIGHT, y2: BOTTOM },
  { x1: RIGHT, y1: BOTTOM, x2: LEFT, y2: BOTTOM },
  { x1: LEFT, y1: BOTTOM, x2: LEFT, y2: TOP },
];
const SEG_LENGTHS = SEGMENTS.map((s) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1));
const TOTAL_LENGTH = SEG_LENGTHS.reduce((a, b) => a + b, 0);

function posOnPath(u: number) {
  let d = ((u % TOTAL_LENGTH) + TOTAL_LENGTH) % TOTAL_LENGTH;
  for (let i = 0; i < SEGMENTS.length; i++) {
    if (d <= SEG_LENGTHS[i]) {
      const s = SEGMENTS[i];
      const t = SEG_LENGTHS[i] === 0 ? 0 : d / SEG_LENGTHS[i];
      return { x: s.x1 + (s.x2 - s.x1) * t, y: s.y1 + (s.y2 - s.y1) * t };
    }
    d -= SEG_LENGTHS[i];
  }
  return { x: SEGMENTS[0].x1, y: SEGMENTS[0].y1 };
}

export function ElectricityQuantitativeSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uRef = useRef(0);
  const lastFrameRef = useRef(0);
  const voltageRef = useRef(6);
  const resistanceRef = useRef(3);
  const predictionRef = useRef(2);

  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(3);
  const [prediction, setPrediction] = useState(2);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { voltageRef.current = voltage; }, [voltage]);
  useEffect(() => { resistanceRef.current = resistance; }, [resistance]);
  useEffect(() => { predictionRef.current = prediction; }, [prediction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = (t: number) => {
      const dt = lastFrameRef.current ? Math.min((t - lastFrameRef.current) / 1000, 0.05) : 0;
      lastFrameRef.current = t;

      const current = voltageRef.current / resistanceRef.current;
      uRef.current += current * 26 * dt;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.strokeStyle = "#56616d";
      ctx.lineWidth = 3;
      SEGMENTS.forEach((s) => {
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
        ctx.stroke();
      });

      // Battery
      const battY = (TOP + BOTTOM) / 2;
      ctx.fillStyle = "#17202a";
      ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${voltageRef.current} V`, LEFT - 34, battY);
      ctx.fillRect(LEFT - 10, battY - 12, 20, 5);
      ctx.fillRect(LEFT - 6, battY + 8, 12, 3);

      // Resistor (zigzag) on bottom edge
      const midX = (LEFT + RIGHT) / 2;
      ctx.strokeStyle = "#f59a3d";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(midX - 40, BOTTOM);
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(midX - 40 + (i + 0.5) * (80 / 6), BOTTOM + (i % 2 === 0 ? -10 : 10));
      }
      ctx.lineTo(midX + 40, BOTTOM);
      ctx.stroke();
      ctx.fillStyle = "#56616d";
      ctx.fillText(`R = ${resistanceRef.current} Ω`, midX, BOTTOM + 26);

      // Bulb showing brightness proportional to current
      const bulbY = (TOP + BOTTOM) / 2;
      const glow = Math.min(1, current / 4);
      ctx.beginPath();
      ctx.arc(RIGHT, bulbY, 14 + glow * 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 200, 60, ${0.15 + glow * 0.85})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(RIGHT, bulbY, 12, 0, Math.PI * 2);
      ctx.strokeStyle = "#17202a";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Current dots (speed scales with current)
      for (let i = 0; i < DOT_COUNT; i++) {
        const p = posOnPath(uRef.current + (i * TOTAL_LENGTH) / DOT_COUNT);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#3c82f6";
        ctx.fill();
      }

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`I = V ÷ R = ${voltageRef.current} ÷ ${resistanceRef.current} = ${current.toFixed(2)} A`, 60, 30);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reveal = () => {
    const actual = voltageRef.current / resistanceRef.current;
    const diff = Math.abs(actual - predictionRef.current);
    setLog((prev) => [
      ...prev,
      `Current = Voltage ÷ Resistance = ${voltageRef.current} ÷ ${resistanceRef.current} = ${actual.toFixed(2)} A (Ohm's Law).`,
      diff <= 0.3
        ? "Your predicted current was close!"
        : `Your predicted current (${predictionRef.current} A) was off — try raising resistance and see current drop, or raising voltage and see it rise.`,
    ]);
  };

  const reset = () => {
    setVoltage(6);
    setResistance(3);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="voltage-slider">Voltage <span className="mono">{voltage} V</span></label>
          <input id="voltage-slider" type="range" min={1} max={12} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="resistance-slider">Resistance <span className="mono">{resistance} Ω</span></label>
          <input id="resistance-slider" type="range" min={1} max={12} value={resistance} onChange={(e) => setResistance(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="prediction-slider">Predict the current <span className="mono">{prediction} A</span></label>
        <input id="prediction-slider" type="range" min={0} max={10} step={0.5} value={prediction} onChange={(e) => setPrediction(Number(e.target.value))} />
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal}>Check Prediction</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
