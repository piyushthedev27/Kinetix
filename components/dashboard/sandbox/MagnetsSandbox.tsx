"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 200;
const TRACK_Y = 110;
const MAGNET_W = 90;
const MAGNET_H = 32;
const FIXED_X = 60;
const START_MOVABLE_X = 300;
const MIN_GAP = 26;
const TRACK_END_X = CANVAS_WIDTH - 60;
const K = 800000;

type Orientation = "attract" | "repel";
type Phase = "idle" | "running" | "done";

export function MagnetsSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const movableXRef = useRef(START_MOVABLE_X);
  const velocityRef = useRef(0);
  const orientationRef = useRef<Orientation>("attract");
  const phaseRef = useRef<Phase>("idle");
  const guessRef = useRef<Orientation>("attract");
  const lastFrameRef = useRef(0);

  const [orientation, setOrientation] = useState<Orientation>("attract");
  const [guess, setGuess] = useState<Orientation>("attract");
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { orientationRef.current = orientation; }, [orientation]);
  useEffect(() => { guessRef.current = guess; }, [guess]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const draw = (t: number) => {
      const dt = lastFrameRef.current ? Math.min((t - lastFrameRef.current) / 1000, 0.03) : 0;
      lastFrameRef.current = t;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (phaseRef.current === "running") {
        const fixedRightEdge = FIXED_X + MAGNET_W;
        const dist = Math.max(MIN_GAP, movableXRef.current - fixedRightEdge);
        const force = K / (dist * dist);
        const accel = (orientationRef.current === "repel" ? 1 : -1) * force;
        velocityRef.current += accel * dt;
        movableXRef.current += velocityRef.current * dt;

        if (orientationRef.current === "attract" && movableXRef.current - fixedRightEdge <= MIN_GAP) {
          movableXRef.current = fixedRightEdge + MIN_GAP;
          velocityRef.current = 0;
          phaseRef.current = "done";
          setPhase("done");
          setLog((prev) => [
            ...prev,
            "Unlike poles (N and S) face each other — they pulled together and stuck. Unlike poles attract.",
            guessRef.current === "attract" ? "Your prediction was correct!" : "Your prediction didn't match — unlike poles always attract.",
          ]);
        } else if (orientationRef.current === "repel" && movableXRef.current >= TRACK_END_X - MAGNET_W) {
          movableXRef.current = TRACK_END_X - MAGNET_W;
          velocityRef.current = 0;
          phaseRef.current = "done";
          setPhase("done");
          setLog((prev) => [
            ...prev,
            "Like poles (N and N) face each other — they pushed apart. Like poles repel.",
            guessRef.current === "repel" ? "Your prediction was correct!" : "Your prediction didn't match — like poles always repel.",
          ]);
        }
      }

      // Fixed magnet
      drawMagnet(ctx, FIXED_X, "N", "S");
      // Movable magnet — its left-facing pole depends on orientation
      const movableLeftLabel = orientationRef.current === "attract" ? "S" : "N";
      drawMagnet(ctx, movableXRef.current, movableLeftLabel, movableLeftLabel === "S" ? "N" : "S");

      ctx.textAlign = "left";
      ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
      ctx.fillStyle = "#17202a";
      ctx.fillText(`Facing poles: ${orientationRef.current === "attract" ? "N ↔ S (unlike)" : "N ↔ N (like)"}`, 40, 24);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const drawMagnet = (ctx: CanvasRenderingContext2D, x: number, leftLabel: string, rightLabel: string) => {
    ctx.fillStyle = "#e35d5d";
    ctx.fillRect(x, TRACK_Y - MAGNET_H / 2, MAGNET_W / 2, MAGNET_H);
    ctx.fillStyle = "#3c82f6";
    ctx.fillRect(x + MAGNET_W / 2, TRACK_Y - MAGNET_H / 2, MAGNET_W / 2, MAGNET_H);
    ctx.strokeStyle = "#17202a";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, TRACK_Y - MAGNET_H / 2, MAGNET_W, MAGNET_H);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "700 13px Inter, sans-serif";
    ctx.fillText(leftLabel, x + MAGNET_W / 4, TRACK_Y + 5);
    ctx.fillText(rightLabel, x + (3 * MAGNET_W) / 4, TRACK_Y + 5);
  };

  const release = () => {
    if (phaseRef.current === "running") return;
    if (phaseRef.current === "done") movableXRef.current = START_MOVABLE_X;
    velocityRef.current = 0;
    lastFrameRef.current = performance.now();
    phaseRef.current = "running";
    setPhase("running");
    setLog((prev) => [...prev, `Released with ${orientationRef.current === "attract" ? "unlike (N–S)" : "like (N–N)"} poles facing each other.`]);
  };

  const reset = () => {
    movableXRef.current = START_MOVABLE_X;
    velocityRef.current = 0;
    phaseRef.current = "idle";
    setPhase("idle");
    setLog(["Ready"]);
  };

  const busy = phase === "running";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Facing poles</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={orientation === "attract"} disabled={busy} onClick={() => setOrientation("attract")}>N ↔ S</button>
            <button type="button" className="kx-sandbox-chip" data-active={orientation === "repel"} disabled={busy} onClick={() => setOrientation("repel")}>N ↔ N</button>
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label>Predict</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={guess === "attract"} disabled={busy} onClick={() => setGuess("attract")}>Attract</button>
            <button type="button" className="kx-sandbox-chip" data-active={guess === "repel"} disabled={busy} onClick={() => setGuess("repel")}>Repel</button>
          </div>
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={release} disabled={busy}>
          {phase === "done" ? "Try Again" : "Release Magnet"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
