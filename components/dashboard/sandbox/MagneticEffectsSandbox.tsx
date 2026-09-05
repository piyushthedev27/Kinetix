"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 260;
const WIRE_X = 320;
const MAX_CURRENT = 10;
const MAX_DEFLECTION = 75; // degrees

type Direction = "forward" | "reversed";
type Side = "left" | "right";

export function MagneticEffectsSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRef = useRef(0);
  const directionRef = useRef<Direction>("forward");
  const revealedRef = useRef(false);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<Direction>("forward");
  const [guess, setGuess] = useState<Side>("right");
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { revealedRef.current = revealed; }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const frac = currentRef.current / MAX_CURRENT;
      const sign = directionRef.current === "forward" ? 1 : -1;

      // Wire, with an arrowhead showing current direction
      ctx.strokeStyle = "#56616d";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(WIRE_X, 20);
      ctx.lineTo(WIRE_X, CANVAS_HEIGHT - 20);
      ctx.stroke();
      const arrowY = sign > 0 ? CANVAS_HEIGHT - 30 : 30;
      ctx.beginPath();
      ctx.moveTo(WIRE_X, arrowY);
      ctx.lineTo(WIRE_X - 6, arrowY - sign * 10);
      ctx.lineTo(WIRE_X + 6, arrowY - sign * 10);
      ctx.closePath();
      ctx.fillStyle = "#56616d";
      ctx.fill();

      // Field-line rings (opacity scales with current)
      [40, 70, 100].forEach((r) => {
        ctx.beginPath();
        ctx.arc(WIRE_X, CANVAS_HEIGHT / 2, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(60, 130, 246, ${0.15 + frac * 0.5})`;
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Compass to the right of the wire
      const compassX = WIRE_X + 150;
      const compassY = CANVAS_HEIGHT / 2;
      ctx.beginPath();
      ctx.arc(compassX, compassY, 24, 0, Math.PI * 2);
      ctx.strokeStyle = "#c8d0ca";
      ctx.stroke();
      const deflection = (sign * frac * MAX_DEFLECTION * Math.PI) / 180;
      ctx.save();
      ctx.translate(compassX, compassY);
      ctx.rotate(deflection);
      ctx.strokeStyle = "#3c82f6";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#56616d";
      ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("compass", compassX, compassY + 44);

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Current: ${currentRef.current.toFixed(1)} A, ${directionRef.current}`, 20, 24);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reveal = () => {
    const sign = directionRef.current === "forward" ? 1 : -1;
    const deflectedSide: Side = sign > 0 ? "right" : "left";
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `The compass needle deflects to the ${deflectedSide} — reversing the current direction reverses the magnetic field's direction around the wire.`,
      guess === deflectedSide ? "Your prediction was correct!" : "Your prediction didn't match — flip the direction toggle and watch the needle swing the other way.",
    ]);
  };

  const reset = () => {
    setCurrent(0);
    setDirection("forward");
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
          <label>Current direction</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={direction === "forward"} onClick={() => { setDirection("forward"); setRevealed(false); }}>Downward</button>
            <button type="button" className="kx-sandbox-chip" data-active={direction === "reversed"} onClick={() => { setDirection("reversed"); setRevealed(false); }}>Upward</button>
          </div>
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>Predict which way the needle deflects</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={guess === "left"} disabled={revealed} onClick={() => setGuess("left")}>Left</button>
          <button type="button" className="kx-sandbox-chip" data-active={guess === "right"} disabled={revealed} onClick={() => setGuess("right")}>Right</button>
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal} disabled={revealed}>Reveal</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
