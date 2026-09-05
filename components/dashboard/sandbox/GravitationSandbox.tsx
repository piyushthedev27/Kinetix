"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 280;
const TOP_Y = 34;
const FLOOR_Y = 250;
const BALL_X = 170;
const FEATHER_X = 330;
const BALL_RADIUS = 16;
const FEATHER_RADIUS = 20;
const GRAVITY = 480; // px/s^2, tuned for a ~1s fall over the visible drop height
const FEATHER_DRAG = 3.2; // linear drag coefficient applied only when air resistance is on

type Guess = "together" | "ball-first";
type Phase = "idle" | "falling" | "done";

export function GravitationSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);
  const featherRef = useRef<Matter.Body | null>(null);
  const ballVyRef = useRef(0);
  const featherVyRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const airResistanceRef = useRef(false);
  const lastFrameRef = useRef(0);
  const startTimeRef = useRef(0);
  const ballLandedRef = useRef<number | null>(null);
  const featherLandedRef = useRef<number | null>(null);

  const [airResistance, setAirResistance] = useState(false);
  const [guess, setGuess] = useState<Guess>("together");
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { airResistanceRef.current = airResistance; }, [airResistance]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ball = Matter.Bodies.circle(BALL_X, TOP_Y, BALL_RADIUS, { isStatic: true });
    const feather = Matter.Bodies.circle(FEATHER_X, TOP_Y, FEATHER_RADIUS, { isStatic: true });
    ballRef.current = ball;
    featherRef.current = feather;

    let raf: number;
    const draw = (t: number) => {
      const dt = lastFrameRef.current ? Math.min((t - lastFrameRef.current) / 1000, 0.05) : 0;
      lastFrameRef.current = t;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.strokeStyle = "#c8d0ca";
      ctx.setLineDash([4, 4]);
      [BALL_X, FEATHER_X].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, TOP_Y - 20);
        ctx.lineTo(x, FLOOR_Y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.strokeStyle = "#8b96a3";
      ctx.beginPath();
      ctx.moveTo(60, FLOOR_Y);
      ctx.lineTo(CANVAS_WIDTH - 60, FLOOR_Y);
      ctx.stroke();

      const ball = ballRef.current;
      const feather = featherRef.current;
      const now = performance.now();

      if (ball && feather) {
        if (phaseRef.current === "falling") {
          if (ballLandedRef.current === null) {
            ballVyRef.current += GRAVITY * dt;
            const ny = Math.min(FLOOR_Y - BALL_RADIUS, ball.position.y + ballVyRef.current * dt);
            Matter.Body.setPosition(ball, { x: BALL_X, y: ny });
            if (ny >= FLOOR_Y - BALL_RADIUS) ballLandedRef.current = now;
          }
          if (featherLandedRef.current === null) {
            const drag = airResistanceRef.current ? FEATHER_DRAG * featherVyRef.current * dt : 0;
            featherVyRef.current += GRAVITY * dt - drag;
            const ny = Math.min(FLOOR_Y - FEATHER_RADIUS, feather.position.y + featherVyRef.current * dt);
            Matter.Body.setPosition(feather, { x: FEATHER_X, y: ny });
            if (ny >= FLOOR_Y - FEATHER_RADIUS) featherLandedRef.current = now;
          }
          if (ballLandedRef.current !== null && featherLandedRef.current !== null) {
            phaseRef.current = "done";
            const tBall = (ballLandedRef.current - startTimeRef.current) / 1000;
            const tFeather = (featherLandedRef.current - startTimeRef.current) / 1000;
            const gap = Math.abs(tBall - tFeather);
            const landedTogether = gap < 0.08;
            setPhase("done");
            setLog((prev) => [
              ...prev,
              `Ball landed in ${tBall.toFixed(2)} s. Feather landed in ${tFeather.toFixed(2)} s.`,
              airResistanceRef.current
                ? "With air resistance on, the feather's larger surface drags against the air and it falls slower — this is what you see with real feathers and paper."
                : "With air resistance off, gravity accelerates every mass equally — heavier does not mean faster. That's Galileo's famous result.",
              landedTogether === (guess === "together")
                ? "Your prediction was correct!"
                : "Your prediction didn't match — look at the two landing times above.",
            ]);
          }
        }

        ctx.beginPath();
        ctx.arc(ball.position.x, ball.position.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#3c82f6";
        ctx.fill();
        ctx.strokeStyle = "#17202a";
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(feather.position.x, feather.position.y, FEATHER_RADIUS, FEATHER_RADIUS * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#f59a3d";
        ctx.fill();
        ctx.strokeStyle = "#17202a";
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillStyle = "#56616d";
        ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
        ctx.fillText("Ball", BALL_X, TOP_Y - 26);
        ctx.fillText("Feather", FEATHER_X, TOP_Y - 26);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(raf);
  }, [guess]);

  const drop = () => {
    const ball = ballRef.current;
    const feather = featherRef.current;
    if (!ball || !feather || phaseRef.current === "falling") return;

    Matter.Body.setPosition(ball, { x: BALL_X, y: TOP_Y });
    Matter.Body.setPosition(feather, { x: FEATHER_X, y: TOP_Y });
    ballVyRef.current = 0;
    featherVyRef.current = 0;
    ballLandedRef.current = null;
    featherLandedRef.current = null;
    lastFrameRef.current = performance.now();
    startTimeRef.current = performance.now();
    phaseRef.current = "falling";
    setPhase("falling");
    setLog((prev) => [...prev, `Dropped together — air resistance is ${airResistanceRef.current ? "on" : "off"}.`]);
  };

  const reset = () => {
    const ball = ballRef.current;
    const feather = featherRef.current;
    if (!ball || !feather) return;
    Matter.Body.setPosition(ball, { x: BALL_X, y: TOP_Y });
    Matter.Body.setPosition(feather, { x: FEATHER_X, y: TOP_Y });
    ballVyRef.current = 0;
    featherVyRef.current = 0;
    ballLandedRef.current = null;
    featherLandedRef.current = null;
    phaseRef.current = "idle";
    setPhase("idle");
    setLog(["Ready"]);
  };

  const busy = phase === "falling";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Air resistance</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={!airResistance} disabled={busy} onClick={() => setAirResistance(false)}>Off</button>
            <button type="button" className="kx-sandbox-chip" data-active={airResistance} disabled={busy} onClick={() => setAirResistance(true)}>On</button>
          </div>
        </div>
        <div className="kx-sandbox-field">
          <label>Your prediction</label>
          <div className="kx-sandbox-chip-row">
            <button type="button" className="kx-sandbox-chip" data-active={guess === "together"} disabled={busy} onClick={() => setGuess("together")}>Land together</button>
            <button type="button" className="kx-sandbox-chip" data-active={guess === "ball-first"} disabled={busy} onClick={() => setGuess("ball-first")}>Heavier ball first</button>
          </div>
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" style={{ maxWidth: CANVAS_WIDTH }} />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={drop} disabled={busy}>
          {phase === "done" ? "Drop Again" : "Drop Both"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
