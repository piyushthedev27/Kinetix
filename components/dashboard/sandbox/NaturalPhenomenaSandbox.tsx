"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 280;
const WAVE_SPEED = 120; // px/s
const STATION_X = 540;
const STATION_Y = 240;

type ViewMode = "lightning" | "earthquake";

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  arrived: boolean;
}

export function NaturalPhenomenaSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef<ViewMode>("lightning");
  const chargeRef = useRef(0);
  const boltRef = useRef(0); // 0 = none, >0 = flash timer
  const ripplesRef = useRef<Ripple[]>([]);
  const seismographRef = useRef<number[]>([]);
  const lastFrameRef = useRef(0);

  const [mode, setMode] = useState<ViewMode>("lightning");
  const [charge, setCharge] = useState(0);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { chargeRef.current = charge; }, [charge]);

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

      if (modeRef.current === "lightning") {
        // Cloud
        ctx.fillStyle = "#8b96a3";
        ctx.beginPath();
        ctx.ellipse(320, 60, 90, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Charge glow scales with charge level
        const glow = chargeRef.current / 100;
        ctx.fillStyle = `rgba(245, 200, 60, ${glow * 0.6})`;
        ctx.beginPath();
        ctx.ellipse(320, 90, 60 + glow * 30, 20 + glow * 15, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#56616d";
        ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ground", 320, 260);
        ctx.strokeStyle = "#8b96a3";
        ctx.beginPath();
        ctx.moveTo(120, 250);
        ctx.lineTo(520, 250);
        ctx.stroke();

        if (boltRef.current > 0) {
          boltRef.current -= dt;
          ctx.strokeStyle = "#f5c83c";
          ctx.lineWidth = 3;
          ctx.beginPath();
          let x = 320, y = 90;
          ctx.moveTo(x, y);
          while (y < 245) {
            x += (Math.random() - 0.5) * 30;
            y += 25;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        ctx.fillStyle = "#17202a";
        ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
        ctx.textAlign = "left";
        ctx.fillText(`Charge: ${Math.round(chargeRef.current)}%`, 20, 24);
      } else {
        // Earthquake view
        ctx.strokeStyle = "#8b96a3";
        ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#56616d";
        ctx.beginPath();
        ctx.arc(STATION_X, STATION_Y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#3c82f6";
        ctx.fill();
        ctx.fillText("seismograph station", STATION_X, STATION_Y + 20);

        ripplesRef.current.forEach((r) => {
          const elapsed = Math.max(0, (t - r.startTime) / 1000);
          const radius = Math.max(0, elapsed * WAVE_SPEED);
          ctx.beginPath();
          ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(60, 130, 246, ${Math.max(0, 0.6 - elapsed * 0.15)})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          const distToStation = Math.hypot(STATION_X - r.x, STATION_Y - r.y);
          if (!r.arrived && radius >= distToStation) {
            r.arrived = true;
            seismographRef.current.push(t);
          }
          ctx.beginPath();
          ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#e35d5d";
          ctx.fill();
        });

        // Seismograph trace at the bottom
        const traceY = 250;
        ctx.strokeStyle = "#17202a";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 20; x <= 600; x += 2) {
          const timeAt = t - (600 - x) * 4;
          const nearArrival = seismographRef.current.some((at) => Math.abs(at - timeAt) < 120);
          const y = traceY + (nearArrival ? (Math.random() - 0.5) * 20 : 0);
          if (x === 20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = "#17202a";
        ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
        ctx.textAlign = "left";
        ctx.fillText("Click anywhere to set the epicenter", 20, 24);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const chargeUp = () => {
    const next = Math.min(100, chargeRef.current + 20);
    setCharge(next);
    if (next >= 100) {
      boltRef.current = 0.4;
      setLog((prev) => [
        ...prev,
        "Discharged! Static charge built up on the cloud until it suddenly jumped to the ground as a lightning bolt.",
      ]);
      setTimeout(() => setCharge(0), 500);
    } else {
      setLog((prev) => [...prev, `Charge building: ${next}%.`]);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (modeRef.current !== "earthquake") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    ripplesRef.current = [{ x, y, startTime: performance.now(), arrived: false }];
    setLog((prev) => [...prev, "Epicenter set — seismic waves ripple outward until they reach the monitoring station."]);
  };

  const reset = () => {
    setCharge(0);
    boltRef.current = 0;
    ripplesRef.current = [];
    seismographRef.current = [];
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>Phenomenon</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={mode === "lightning"} onClick={() => { setMode("lightning"); reset(); }}>Lightning</button>
          <button type="button" className="kx-sandbox-chip" data-active={mode === "earthquake"} onClick={() => { setMode("earthquake"); reset(); }}>Earthquake</button>
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" onClick={handleCanvasClick} />
      </div>

      <div className="kx-sandbox-actions">
        {mode === "lightning" && (
          <button type="button" className="kx-btn kx-btn-primary" onClick={chargeUp}>Build Static Charge</button>
        )}
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
