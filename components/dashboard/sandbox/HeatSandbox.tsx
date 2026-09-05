"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 280;
const BOX = { left: 40, top: 30, right: 600, bottom: 260 };
const COLS = 6;
const ROWS = 4;
const RADIUS = 8;

interface Particle {
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function stateFor(temp: number) {
  if (temp < 33) return "Solid";
  if (temp < 66) return "Liquid";
  return "Gas";
}

export function HeatSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const tempRef = useRef(10);
  const lastStateRef = useRef("Solid");
  const lastFrameRef = useRef(0);

  const [temp, setTemp] = useState(10);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { tempRef.current = temp; }, [temp]);

  useEffect(() => {
    const particles: Particle[] = [];
    const spacingX = (BOX.right - BOX.left) / (COLS + 1);
    const spacingY = (BOX.bottom - BOX.top) / (ROWS + 1);
    for (let r = 1; r <= ROWS; r++) {
      for (let c = 1; c <= COLS; c++) {
        const x = BOX.left + c * spacingX;
        const y = BOX.top + r * spacingY;
        particles.push({ anchorX: x, anchorY: y, x, y, vx: 0, vy: 0 });
      }
    }
    particlesRef.current = particles;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = (t: number) => {
      const dt = lastFrameRef.current ? Math.min((t - lastFrameRef.current) / 1000, 0.05) : 0;
      lastFrameRef.current = t;

      const temp01 = tempRef.current / 100;
      const springK = 90 * Math.pow(1 - temp01, 2);
      const jitter = 40 * temp01;
      const damping = 0.98;

      particlesRef.current.forEach((p) => {
        p.vx += (Math.random() - 0.5) * jitter * dt * 60;
        p.vy += (Math.random() - 0.5) * jitter * dt * 60;
        p.vx += (p.anchorX - p.x) * springK * dt;
        p.vy += (p.anchorY - p.y) * springK * dt;
        p.vx *= damping;
        p.vy *= damping;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (p.x < BOX.left + RADIUS) { p.x = BOX.left + RADIUS; p.vx *= -0.7; }
        if (p.x > BOX.right - RADIUS) { p.x = BOX.right - RADIUS; p.vx *= -0.7; }
        if (p.y < BOX.top + RADIUS) { p.y = BOX.top + RADIUS; p.vy *= -0.7; }
        if (p.y > BOX.bottom - RADIUS) { p.y = BOX.bottom - RADIUS; p.vy *= -0.7; }
      });

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.strokeStyle = "#8b96a3";
      ctx.lineWidth = 2;
      ctx.strokeRect(BOX.left, BOX.top, BOX.right - BOX.left, BOX.bottom - BOX.top);

      const color = temp01 < 0.33 ? "#3c82f6" : temp01 < 0.66 ? "#3baa70" : "#e35d5d";
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Temperature: ${tempRef.current}°   State: ${stateFor(tempRef.current)}`, BOX.left, 20);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const state = stateFor(temp);
    if (state !== lastStateRef.current) {
      lastStateRef.current = state;
      setLog((prev) => [
        ...prev,
        state === "Liquid"
          ? "Now behaving like a liquid — particles have enough energy to slide past each other, no longer locked in place."
          : state === "Gas"
            ? "Now behaving like a gas — particles have broken free entirely and move fast enough to fill the whole container."
            : "Cooled back into a solid — particles vibrate in place but stay locked in their positions.",
      ]);
    }
  }, [temp]);

  const reset = () => {
    setTemp(10);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="temp-slider">Temperature <span className="mono">{temp}°</span></label>
        <input id="temp-slider" type="range" min={0} max={100} value={temp} onChange={(e) => setTemp(Number(e.target.value))} />
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
