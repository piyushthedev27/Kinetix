"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 280;
const LIQUID_TOP = 60;
const LIQUID_BOTTOM = 250;
const ELECTRODE_A_X = 260;
const ELECTRODE_B_X = 380;

interface Bubble {
  x: number;
  y: number;
  vy: number;
  r: number;
}

export function ElectrolysisSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const voltageRef = useRef(4);
  const bubblesRef = useRef<{ a: Bubble[]; b: Bubble[] }>({ a: [], b: [] });
  const spawnAccumRef = useRef(0);
  const lastFrameRef = useRef(0);
  const bubbleCountRef = useRef(0);

  const [voltage, setVoltage] = useState(4);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { voltageRef.current = voltage; }, [voltage]);

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

      // Beaker
      ctx.strokeStyle = "#8b96a3";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(120, 20);
      ctx.lineTo(120, LIQUID_BOTTOM);
      ctx.lineTo(520, LIQUID_BOTTOM);
      ctx.lineTo(520, 20);
      ctx.stroke();

      // Liquid
      ctx.fillStyle = "rgba(60,130,246,0.12)";
      ctx.fillRect(122, LIQUID_TOP, 396, LIQUID_BOTTOM - LIQUID_TOP);

      // Electrodes
      [ELECTRODE_A_X, ELECTRODE_B_X].forEach((x, i) => {
        ctx.strokeStyle = "#56616d";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, LIQUID_TOP + 130);
        ctx.stroke();
        ctx.fillStyle = "#56616d";
        ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(i === 0 ? "Electrode A" : "Electrode B", x, 12);
      });

      // Spawn bubbles proportional to voltage
      spawnAccumRef.current += voltageRef.current * dt * 3;
      while (spawnAccumRef.current >= 1) {
        spawnAccumRef.current -= 1;
        bubblesRef.current.a.push({ x: ELECTRODE_A_X + (Math.random() - 0.5) * 10, y: LIQUID_TOP + 130, vy: -30 - Math.random() * 20, r: 3 + Math.random() * 2 });
        bubblesRef.current.b.push({ x: ELECTRODE_B_X + (Math.random() - 0.5) * 10, y: LIQUID_TOP + 130, vy: -30 - Math.random() * 20, r: 3 + Math.random() * 2 });
        bubbleCountRef.current += 2;
      }

      [bubblesRef.current.a, bubblesRef.current.b].forEach((list) => {
        for (let i = list.length - 1; i >= 0; i--) {
          const b = list[i];
          b.y += b.vy * dt;
          if (b.y <= LIQUID_TOP) {
            list.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(60,130,246,0.6)";
          ctx.stroke();
        }
      });

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Voltage: ${voltageRef.current} V`, 20, 24);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const explain = () => {
    setLog((prev) => [
      ...prev,
      `At ${voltageRef.current} V, gas bubbles form steadily at both electrodes — passing an electric current through a solution drives a chemical reaction at each electrode. This is electrolysis.`,
      voltageRef.current >= 7
        ? "At high voltage, bubbles form fast and thick — more current means a faster chemical reaction."
        : voltageRef.current <= 2
          ? "At low voltage, bubbles form slowly, and below a certain threshold there isn't enough current to drive the reaction at all."
          : "At moderate voltage, bubbles form at a steady, moderate rate.",
    ]);
  };

  const reset = () => {
    setVoltage(4);
    bubblesRef.current = { a: [], b: [] };
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="voltage-slider">Voltage <span className="mono">{voltage} V</span></label>
        <input id="voltage-slider" type="range" min={0} max={10} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={explain}>Explain What&apos;s Happening</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
