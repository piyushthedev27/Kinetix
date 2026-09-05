"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 320;
const TRACK_Y = 50;
const START_X = 40;
const TRACK_LEN = 500;
const FRICTION = 0.7; // fraction of speed lost per second
const MAX_TIME = 8; // seconds tracked for the graphs
const GRAPH_TOP = 90;
const GRAPH_H = 90;
const GRAPH_GAP = 30;

type Phase = "idle" | "running" | "done";

export function MotionGraphSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const speedRef = useRef(6);
  const phaseRef = useRef<Phase>("idle");
  const xRef = useRef(0);
  const vRef = useRef(0);
  const lastFrameRef = useRef(0);
  const elapsedRef = useRef(0);
  const samplesRef = useRef<{ t: number; x: number; v: number }[]>([]);

  const [speed, setSpeed] = useState(6);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { speedRef.current = speed; }, [speed]);

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

      if (phaseRef.current === "running") {
        vRef.current *= 1 - FRICTION * dt;
        xRef.current = Math.min(TRACK_LEN, xRef.current + vRef.current * dt * 40);
        elapsedRef.current += dt;
        samplesRef.current.push({ t: elapsedRef.current, x: xRef.current, v: vRef.current });

        if (vRef.current < 0.05 || elapsedRef.current >= MAX_TIME || xRef.current >= TRACK_LEN) {
          phaseRef.current = "done";
          setPhase("done");
          setLog((prev) => [
            ...prev,
            `It travelled ${(xRef.current / 40).toFixed(1)} units in ${elapsedRef.current.toFixed(1)} s before friction brought it to rest.`,
            "The distance–time graph curves and flattens as it slows — a straight line would mean constant speed, but this one bends because the speed itself is changing.",
          ]);
        }
      }

      // Track + object
      ctx.strokeStyle = "#dde2de";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(START_X, TRACK_Y);
      ctx.lineTo(START_X + TRACK_LEN, TRACK_Y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(START_X + xRef.current, TRACK_Y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#b7e33a";
      ctx.fill();
      ctx.strokeStyle = "#17202a";
      ctx.stroke();

      // Distance-time graph
      const distGraphY = GRAPH_TOP;
      const speedGraphY = GRAPH_TOP + GRAPH_H + GRAPH_GAP;
      [
        { y: distGraphY, label: "Distance vs Time", maxVal: TRACK_LEN / 40, key: "x" as const, scale: 1 / 40 },
        { y: speedGraphY, label: "Speed vs Time", maxVal: 10, key: "v" as const, scale: 1 },
      ].forEach(({ y, label, maxVal, key, scale }) => {
        ctx.strokeStyle = "#c8d0ca";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(START_X, y);
        ctx.lineTo(START_X, y + GRAPH_H);
        ctx.moveTo(START_X, y + GRAPH_H);
        ctx.lineTo(START_X + TRACK_LEN, y + GRAPH_H);
        ctx.stroke();
        ctx.fillStyle = "#56616d";
        ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(label, START_X, y - 6);

        ctx.strokeStyle = "#3c82f6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        samplesRef.current.forEach((s, i) => {
          const px = START_X + (s.t / MAX_TIME) * TRACK_LEN;
          const val = key === "x" ? s.x * scale : s.v * scale;
          const py = y + GRAPH_H - Math.min(1, val / maxVal) * GRAPH_H;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      });

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`t = ${elapsedRef.current.toFixed(1)} s   v = ${vRef.current.toFixed(1)} u/s`, START_X, 20);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const launch = () => {
    if (phaseRef.current === "running") return;
    xRef.current = 0;
    vRef.current = speedRef.current;
    elapsedRef.current = 0;
    samplesRef.current = [];
    lastFrameRef.current = performance.now();
    phaseRef.current = "running";
    setPhase("running");
    setLog((prev) => [...prev, `Launched at ${speedRef.current} u/s.`]);
  };

  const reset = () => {
    xRef.current = 0;
    vRef.current = 0;
    elapsedRef.current = 0;
    samplesRef.current = [];
    phaseRef.current = "idle";
    setPhase("idle");
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="speed-slider">Launch speed <span className="mono">{speed} u/s</span></label>
        <input id="speed-slider" type="range" min={2} max={10} value={speed} disabled={phase === "running"} onChange={(e) => setSpeed(Number(e.target.value))} />
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={launch} disabled={phase === "running"}>
          {phase === "done" ? "Run Again" : "Launch"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
