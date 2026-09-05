"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 680;
const CANVAS_HEIGHT = 240;
const SURFACE_TOP = 160;
const SURFACE_BOTTOM = 220;
const REST_Y = 130;
const MAX_DEPTH = 46;
const DEPTH_SCALE = 3.6;

type Shape = "block" | "pin";
const SHAPES: Record<Shape, { label: string; area: number; halfWidth: number; color: string }> = {
  block: { label: "Flat block", area: 9, halfWidth: 46, color: "#3c82f6" },
  pin: { label: "Pin", area: 1, halfWidth: 4, color: "#f59a3d" },
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Phase = "idle" | "pressing" | "done";

export function ForceAndPressureSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shapeRef = useRef<Shape>("block");
  const forceRef = useRef(5);
  const phaseRef = useRef<Phase>("idle");
  const pressStartRef = useRef(0);
  const currentDepthRef = useRef(0);
  const targetDepthRef = useRef(0);
  const ghostsRef = useRef<{ depth: number; halfWidth: number; color: string }[]>([]);

  const [shape, setShape] = useState<Shape>("block");
  const [force, setForce] = useState(5);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { shapeRef.current = shape; }, [shape]);
  useEffect(() => { forceRef.current = force; }, [force]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const cx = CANVAS_WIDTH / 2;

      if (phaseRef.current === "pressing") {
        const elapsed = t - pressStartRef.current;
        const progress = Math.min(1, elapsed / 700);
        currentDepthRef.current = targetDepthRef.current * easeOutCubic(progress);
        if (progress >= 1) {
          phaseRef.current = "done";
          setPhase("done");
          const s = SHAPES[shapeRef.current];
          const pressure = forceRef.current / s.area;
          setLog((prev) => [
            ...prev,
            `Pressure = Force ÷ Area = ${forceRef.current} ÷ ${s.area} = ${pressure.toFixed(2)}.`,
            `It sank ${targetDepthRef.current.toFixed(0)} px into the surface. ${
              shapeRef.current === "pin"
                ? "Concentrating the same force onto a tiny area produces much more pressure — that's why a pin sinks in easily."
                : "Spreading the same force over a larger area produces much less pressure — that's why a flat block barely dents."
            }`,
          ]);
        }
      }

      // Cushion surface with indentation carved around current object position
      const s = SHAPES[shapeRef.current];
      const depth = currentDepthRef.current;
      ctx.fillStyle = "#eaf6ea";
      ctx.beginPath();
      ctx.moveTo(40, SURFACE_TOP);
      ctx.lineTo(cx - s.halfWidth - 14, SURFACE_TOP);
      ctx.quadraticCurveTo(cx, SURFACE_TOP + depth * 1.3, cx + s.halfWidth + 14, SURFACE_TOP);
      ctx.lineTo(CANVAS_WIDTH - 40, SURFACE_TOP);
      ctx.lineTo(CANVAS_WIDTH - 40, SURFACE_BOTTOM);
      ctx.lineTo(40, SURFACE_BOTTOM);
      ctx.closePath();
      ctx.fillStyle = "#dff0d8";
      ctx.fill();
      ctx.strokeStyle = "#b7d7a8";
      ctx.stroke();

      // Ghost indentations from previous runs
      ghostsRef.current.forEach((g) => {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = g.color;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx - g.halfWidth - 14, SURFACE_TOP);
        ctx.quadraticCurveTo(cx, SURFACE_TOP + g.depth * 1.3, cx + g.halfWidth + 14, SURFACE_TOP);
        ctx.stroke();
        ctx.restore();
      });

      // Object
      const objY = REST_Y + depth;
      ctx.fillStyle = s.color;
      ctx.strokeStyle = "#17202a";
      ctx.lineWidth = 1.5;
      if (shapeRef.current === "block") {
        ctx.beginPath();
        ctx.roundRect(cx - s.halfWidth, objY - 22, s.halfWidth * 2, 22, 4);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(cx - s.halfWidth, objY - 30);
        ctx.lineTo(cx + s.halfWidth, objY - 30);
        ctx.lineTo(cx, objY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.textAlign = "left";
      ctx.fillStyle = "#17202a";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillText(`Force: ${forceRef.current}   Area: ${s.area}   Pressure: ${(forceRef.current / s.area).toFixed(2)}`, 44, 24);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const press = () => {
    if (phaseRef.current === "pressing") return;
    if (phaseRef.current === "done") {
      ghostsRef.current = [
        { depth: currentDepthRef.current, halfWidth: SHAPES[shapeRef.current].halfWidth, color: SHAPES[shapeRef.current].color },
        ...ghostsRef.current,
      ].slice(0, 3);
      currentDepthRef.current = 0;
    }
    const s = SHAPES[shapeRef.current];
    const pressure = forceRef.current / s.area;
    targetDepthRef.current = Math.min(MAX_DEPTH, pressure * DEPTH_SCALE);
    pressStartRef.current = performance.now();
    phaseRef.current = "pressing";
    setPhase("pressing");
    setLog((prev) => [...prev, `Pressing a ${s.label.toLowerCase()} down with ${forceRef.current} units of force.`]);
  };

  const reset = () => {
    currentDepthRef.current = 0;
    targetDepthRef.current = 0;
    ghostsRef.current = [];
    phaseRef.current = "idle";
    setPhase("idle");
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Shape</label>
          <div className="kx-sandbox-chip-row">
            {(Object.keys(SHAPES) as Shape[]).map((id) => (
              <button key={id} type="button" className="kx-sandbox-chip" data-active={shape === id} disabled={phase === "pressing"} onClick={() => setShape(id)}>
                {SHAPES[id].label}
              </button>
            ))}
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="force-slider">Force <span className="mono">{force}/10</span></label>
          <input id="force-slider" type="range" min={1} max={10} value={force} disabled={phase === "pressing"} onChange={(e) => setForce(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={press} disabled={phase === "pressing"}>
          {phase === "done" ? "Press Again" : "Apply Force"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
