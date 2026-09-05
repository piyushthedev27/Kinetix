"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 240;
const LEFT = 120;
const RIGHT = 520;
const TOP = 60;
const BOTTOM = 180;
const DOT_COUNT = 10;
const BASE_SPEED = 55; // px/s per cell

// Perimeter path: top edge, right edge (bulb), bottom edge (switch), left edge (battery)
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

type Guess = "lit" | "dark";

export function ElectricityAndCircuitsSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uRef = useRef(0);
  const lastFrameRef = useRef(0);
  const switchClosedRef = useRef(true);
  const wireConnectedRef = useRef(true);
  const cellsRef = useRef(1);

  const [switchClosed, setSwitchClosed] = useState(true);
  const [wireConnected, setWireConnected] = useState(true);
  const [cells, setCells] = useState(1);
  const [guess, setGuess] = useState<Guess>("lit");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { switchClosedRef.current = switchClosed; }, [switchClosed]);
  useEffect(() => { wireConnectedRef.current = wireConnected; }, [wireConnected]);
  useEffect(() => { cellsRef.current = cells; }, [cells]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = (t: number) => {
      const dt = lastFrameRef.current ? Math.min((t - lastFrameRef.current) / 1000, 0.05) : 0;
      lastFrameRef.current = t;

      const lit = switchClosedRef.current && wireConnectedRef.current;
      if (lit) uRef.current += BASE_SPEED * cellsRef.current * dt;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Wire (dim if broken)
      ctx.strokeStyle = wireConnectedRef.current ? "#56616d" : "#dde2de";
      ctx.lineWidth = 3;
      const breakGap = 18;
      SEGMENTS.forEach((s, i) => {
        if (i === 2 && !wireConnectedRef.current) {
          // draw the bottom (switch) edge with a visible break in the middle-left third
          const midX = (s.x1 + s.x2) / 2 + 40;
          ctx.beginPath();
          ctx.moveTo(s.x1, s.y1);
          ctx.lineTo(midX + breakGap, s.y2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(midX - breakGap, s.y2);
          ctx.lineTo(s.x2, s.y2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(s.x1, s.y1);
          ctx.lineTo(s.x2, s.y2);
          ctx.stroke();
        }
      });

      // Battery symbol (left edge)
      const battY = (TOP + BOTTOM) / 2;
      ctx.fillStyle = "#17202a";
      ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${cellsRef.current} cell${cellsRef.current > 1 ? "s" : ""}`, LEFT - 34, battY);
      for (let i = 0; i < cellsRef.current; i++) {
        const y = battY - 14 + i * 14;
        ctx.fillRect(LEFT - 8, y, 16, 4);
      }

      // Switch label (bottom edge)
      ctx.fillText(switchClosedRef.current ? "switch: closed" : "switch: open", (LEFT + RIGHT) / 2, BOTTOM + 22);
      if (!switchClosedRef.current) {
        const midX = (LEFT + RIGHT) / 2;
        ctx.strokeStyle = "#17202a";
        ctx.beginPath();
        ctx.moveTo(midX - 20, BOTTOM);
        ctx.lineTo(midX + 15, BOTTOM - 16);
        ctx.stroke();
      }

      // Bulb (right edge)
      const bulbY = (TOP + BOTTOM) / 2;
      const glow = lit ? 0.4 + 0.2 * cellsRef.current : 0;
      ctx.beginPath();
      ctx.arc(RIGHT, bulbY, 16 + glow * 6, 0, Math.PI * 2);
      ctx.fillStyle = lit ? `rgba(245, 200, 60, ${Math.min(1, glow)})` : "rgba(200,200,200,0.25)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(RIGHT, bulbY, 12, 0, Math.PI * 2);
      ctx.strokeStyle = "#17202a";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Current dots
      if (lit) {
        for (let i = 0; i < DOT_COUNT; i++) {
          const p = posOnPath(uRef.current + (i * TOTAL_LENGTH) / DOT_COUNT);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#3c82f6";
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const check = () => {
    const lit = switchClosedRef.current && wireConnectedRef.current;
    const actual: Guess = lit ? "lit" : "dark";
    let reason: string;
    if (!wireConnectedRef.current) reason = "the wire is broken, so there's no complete path for current to flow, no matter the switch.";
    else if (!switchClosedRef.current) reason = "the switch is open, breaking the loop — current needs an unbroken path all the way around.";
    else reason = `the loop is complete and the switch is closed, so current flows and the bulb lights up${cellsRef.current > 1 ? ` (brighter with ${cellsRef.current} cells)` : ""}.`;

    setLog((prev) => [
      ...prev,
      `Checked: the bulb is ${actual === "lit" ? "lit" : "dark"} because ${reason}`,
      guess === actual ? "Your prediction was correct!" : `Your prediction (${guess}) didn't match.`,
    ]);
  };

  const reset = () => {
    setSwitchClosed(true);
    setWireConnected(true);
    setCells(1);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Switch</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={switchClosed} onClick={() => setSwitchClosed(true)}>Closed</button>
            <button type="button" className="kx-sandbox-chip" data-active={!switchClosed} onClick={() => setSwitchClosed(false)}>Open</button>
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label>Wire</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={wireConnected} onClick={() => setWireConnected(true)}>Connected</button>
            <button type="button" className="kx-sandbox-chip" data-active={!wireConnected} onClick={() => setWireConnected(false)}>Broken</button>
          </div>
        </div>
      </div>

      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="cells-slider">Battery cells <span className="mono">{cells}</span></label>
          <input id="cells-slider" type="range" min={1} max={3} value={cells} onChange={(e) => setCells(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label>Predict the bulb</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={guess === "lit"} onClick={() => setGuess("lit")}>Will light</button>
            <button type="button" className="kx-sandbox-chip" data-active={guess === "dark"} onClick={() => setGuess("dark")}>Stays dark</button>
          </div>
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={check}>Check Prediction</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
