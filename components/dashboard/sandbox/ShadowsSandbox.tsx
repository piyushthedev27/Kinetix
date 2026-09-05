"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 260;
const GROUND_Y = 220;
const OBJ_X = 340;
const OBJ_TOP_Y = 150;
const LIGHT_HEIGHT_MIN = 20;
const LIGHT_HEIGHT_MAX = 130; // just above the object's top

type Guess = "longer" | "shorter";

export function ShadowsSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lightHeightRef = useRef(70);
  const lightDistRef = useRef(150);

  const [lightHeight, setLightHeight] = useState(70); // smaller = higher up
  const [lightDist, setLightDist] = useState(150); // horizontal distance of light from object
  const [guess, setGuess] = useState<Guess>("longer");
  const [log, setLog] = useState<string[]>(["Ready — move the light and watch the shadow."]);
  const prevShadowRef = useRef<number | null>(null);

  useEffect(() => { lightHeightRef.current = lightHeight; }, [lightHeight]);
  useEffect(() => { lightDistRef.current = lightDist; }, [lightDist]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const lightX = OBJ_X - lightDistRef.current;
      const lightY = lightHeightRef.current;

      // Ground
      ctx.strokeStyle = "#8b96a3";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, GROUND_Y);
      ctx.lineTo(CANVAS_WIDTH - 20, GROUND_Y);
      ctx.stroke();

      // Light rays to object top and beyond to ground
      const t = (GROUND_Y - lightY) / (OBJ_TOP_Y - lightY);
      const shadowX = lightX + t * (OBJ_X - lightX);
      const shadowLen = Math.abs(shadowX - OBJ_X);

      ctx.strokeStyle = "rgba(245, 200, 60, 0.7)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(lightX, lightY);
      ctx.lineTo(shadowX, GROUND_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Light source
      ctx.beginPath();
      ctx.arc(lightX, lightY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#f5c83c";
      ctx.fill();

      // Shadow on the ground
      ctx.strokeStyle = "#17202a";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(OBJ_X, GROUND_Y);
      ctx.lineTo(shadowX, GROUND_Y);
      ctx.stroke();

      // Object
      ctx.strokeStyle = "#3baa70";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(OBJ_X, GROUND_Y);
      ctx.lineTo(OBJ_X, OBJ_TOP_Y);
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Shadow length: ${shadowLen.toFixed(0)} px`, 20, 24);

      canvas.dataset.shadowLen = String(shadowLen);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const raiseAndCheck = () => {
    const before = Number(canvasRef.current?.dataset.shadowLen || 0);
    prevShadowRef.current = before;
    const newHeight = Math.max(LIGHT_HEIGHT_MIN, lightHeight - 40);
    setLightHeight(newHeight);
    setTimeout(() => {
      const after = Number(canvasRef.current?.dataset.shadowLen || 0);
      const actual: Guess = after < before ? "shorter" : "longer";
      setLog((prev) => [
        ...prev,
        `Raised the light: shadow went from ${before.toFixed(0)} px to ${after.toFixed(0)} px.`,
        "Raising the light source makes the rays fall more steeply, so the shadow shrinks — a light directly overhead casts almost no shadow at all.",
        guess === actual ? "Your prediction was correct!" : "Your prediction didn't match — try it again and watch the shadow length number.",
      ]);
    }, 50);
  };

  const reset = () => {
    setLightHeight(70);
    setLightDist(150);
    setLog(["Ready — move the light and watch the shadow."]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="height-slider">Light height <span className="mono">{lightHeight}</span></label>
          <input id="height-slider" type="range" min={LIGHT_HEIGHT_MIN} max={LIGHT_HEIGHT_MAX} value={lightHeight} onChange={(e) => setLightHeight(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="dist-slider">Light distance from object <span className="mono">{lightDist}</span></label>
          <input id="dist-slider" type="range" min={60} max={260} value={lightDist} onChange={(e) => setLightDist(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>If the light is raised, will the shadow get longer or shorter?</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={guess === "longer"} onClick={() => setGuess("longer")}>Longer</button>
          <button type="button" className="kx-sandbox-chip" data-active={guess === "shorter"} onClick={() => setGuess("shorter")}>Shorter</button>
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={raiseAndCheck}>Raise the Light & Check</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
