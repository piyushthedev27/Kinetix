"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 280;
const POLE_X = 400; // mirror pole (vertex), principal axis is the horizontal line through it
const AXIS_Y = 150;
const FOCAL_LENGTH = 90; // px
const PX_PER_UNIT = 6; // for display distances in "cm"-like units

type MirrorType = "concave" | "convex";

function lineIntersect(p1: [number, number], d1: [number, number], p2: [number, number], d2: [number, number]) {
  const denom = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(denom) < 1e-6) return null;
  const t1 = ((p2[0] - p1[0]) * d2[1] - (p2[1] - p1[1]) * d2[0]) / denom;
  return { x: p1[0] + d1[0] * t1, y: p1[1] + d1[1] * t1, t1 };
}

export function CurvedMirrorSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mirrorRef = useRef<MirrorType>("concave");
  const distanceRef = useRef(220);

  const [mirrorType, setMirrorType] = useState<MirrorType>("concave");
  const [distance, setDistance] = useState(220);
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { mirrorRef.current = mirrorType; }, [mirrorType]);
  useEffect(() => { distanceRef.current = distance; }, [distance]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const u = distanceRef.current;
      const isConcave = mirrorRef.current === "concave";
      const f = isConcave ? -FOCAL_LENGTH : FOCAL_LENGTH; // concave: focus in front (left, negative x offset from pole)

      // Principal axis
      ctx.strokeStyle = "#c8d0ca";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(20, AXIS_Y);
      ctx.lineTo(CANVAS_WIDTH - 20, AXIS_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Mirror (curved arc, opening toward the object side / left)
      ctx.strokeStyle = "#17202a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (isConcave) {
        ctx.arc(POLE_X + FOCAL_LENGTH * 2, AXIS_Y, FOCAL_LENGTH * 2, Math.PI - 0.5, Math.PI + 0.5);
      } else {
        ctx.arc(POLE_X - FOCAL_LENGTH * 2, AXIS_Y, FOCAL_LENGTH * 2, -0.5, 0.5);
      }
      ctx.stroke();

      // Focus and center markers
      const focusX = POLE_X + f;
      const centerX = POLE_X + f * 2;
      [{ x: focusX, label: "F" }, { x: centerX, label: "C" }].forEach(({ x, label }) => {
        ctx.beginPath();
        ctx.arc(x, AXIS_Y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#56616d";
        ctx.fill();
        ctx.font = "10px Inter, ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(label, x, AXIS_Y + 16);
      });

      // Object: vertical arrow, base on axis, at x = POLE_X - u
      const objX = POLE_X - u;
      const objH = 46;
      ctx.strokeStyle = "#f59a3d";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(objX, AXIS_Y);
      ctx.lineTo(objX, AXIS_Y - objH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(objX, AXIS_Y - objH);
      ctx.lineTo(objX - 5, AXIS_Y - objH + 9);
      ctx.lineTo(objX + 5, AXIS_Y - objH + 9);
      ctx.closePath();
      ctx.fillStyle = "#f59a3d";
      ctx.fill();

      const objTip: [number, number] = [objX, AXIS_Y - objH];

      // Ray A: parallel to axis from object tip to mirror, then through/away-from focus
      const mirrorHitA: [number, number] = [POLE_X, objTip[1]];
      let dirA: [number, number];
      if (isConcave) {
        dirA = [focusX - mirrorHitA[0], AXIS_Y - mirrorHitA[1]];
      } else {
        dirA = [mirrorHitA[0] - focusX, mirrorHitA[1] - AXIS_Y];
      }

      // Ray B: object tip through pole, reflects flipping the x-component of its direction
      const dirToPole: [number, number] = [POLE_X - objTip[0], AXIS_Y - objTip[1]];
      const dirB: [number, number] = [-dirToPole[0], dirToPole[1]];
      const poleHit: [number, number] = [POLE_X, AXIS_Y];

      const hit = lineIntersect(mirrorHitA, dirA, poleHit, dirB);

      ctx.strokeStyle = "#f59a3d";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(objTip[0], objTip[1]);
      ctx.lineTo(mirrorHitA[0], mirrorHitA[1]);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(objTip[0], objTip[1]);
      ctx.lineTo(poleHit[0], poleHit[1]);
      ctx.stroke();

      let resultText = "Rays are parallel — the image forms at infinity. Try a different distance.";
      if (hit) {
        const real = hit.t1 >= 0;
        const drawLen = 260;
        [
          { from: mirrorHitA, dir: dirA },
          { from: poleHit, dir: dirB },
        ].forEach(({ from, dir }) => {
          const mag = Math.hypot(dir[0], dir[1]) || 1;
          const nd = [dir[0] / mag, dir[1] / mag];
          ctx.save();
          ctx.strokeStyle = "#3c82f6";
          ctx.lineWidth = 1.5;
          if (!real) ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(from[0], from[1]);
          ctx.lineTo(from[0] + nd[0] * drawLen * (real ? 1 : -1), from[1] + nd[1] * drawLen * (real ? 1 : -1));
          ctx.stroke();
          ctx.restore();
        });

        // Image arrow
        ctx.strokeStyle = "#3c82f6";
        ctx.lineWidth = 2.5;
        if (!real) ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(hit.x, AXIS_Y);
        ctx.lineTo(hit.x, hit.y);
        ctx.stroke();
        ctx.setLineDash([]);

        const inverted = hit.y > AXIS_Y;
        const imgH = Math.abs(hit.y - AXIS_Y);
        const sizeLabel = Math.abs(imgH - objH) <= 3 ? "same-size" : imgH > objH ? "magnified" : "diminished";
        resultText = `${real ? "Real" : "Virtual"}, ${inverted ? "inverted" : "erect"}, ${sizeLabel} image at ${Math.abs((hit.x - POLE_X) / PX_PER_UNIT).toFixed(0)} units ${real ? "in front of" : "behind"} the mirror.`;
      }

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Object distance: ${(u / PX_PER_UNIT).toFixed(0)} units`, 20, 24);

      canvas.dataset.result = resultText;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reveal = () => {
    const text = canvasRef.current?.dataset.result || "";
    setLog((prev) => [...prev, text]);
  };

  const reset = () => {
    setMirrorType("concave");
    setDistance(220);
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Mirror type</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={mirrorType === "concave"} onClick={() => setMirrorType("concave")}>Concave</button>
            <button type="button" className="kx-sandbox-chip" data-active={mirrorType === "convex"} onClick={() => setMirrorType("convex")}>Convex</button>
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="distance-slider">Object distance <span className="mono">{Math.round(distance / PX_PER_UNIT)} u</span></label>
          <input id="distance-slider" type="range" min={40} max={340} value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={reveal}>Describe the Image</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
