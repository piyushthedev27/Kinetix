"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const UNIT_PX = 56;
const FINISH_UNITS = 10;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 220;
const START_X = 30;
const LANE_A_Y = 70;
const LANE_B_Y = 150;
const RADIUS = 14;

type Phase = "idle" | "running" | "done";
type Racer = "A" | "B";

function unitAt(pixelX: number) {
  return Math.max(0, (pixelX - START_X) / UNIT_PX);
}

export function MotionAndTimeSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodyARef = useRef<Matter.Body | null>(null);
  const bodyBRef = useRef<Matter.Body | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const runningRef = useRef(false);
  const hasStartedRef = useRef(false);
  const startTimeRef = useRef(0);
  const finishTimeARef = useRef<number | null>(null);
  const finishTimeBRef = useRef<number | null>(null);
  const speedARef = useRef(4);
  const speedBRef = useRef(6);

  const [speedA, setSpeedA] = useState(4);
  const [speedB, setSpeedB] = useState(6);
  const [guess, setGuess] = useState<Racer>("A");
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { speedARef.current = speedA; }, [speedA]);
  useEffect(() => { speedBRef.current = speedB; }, [speedB]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    const bodyA = Matter.Bodies.circle(START_X, LANE_A_Y, RADIUS, { frictionAir: 0, friction: 0, restitution: 0 });
    const bodyB = Matter.Bodies.circle(START_X, LANE_B_Y, RADIUS, { frictionAir: 0, friction: 0, restitution: 0 });
    Matter.Composite.add(engine.world, [bodyA, bodyB]);
    engineRef.current = engine;
    bodyARef.current = bodyA;
    bodyBRef.current = bodyB;

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    runnerRef.current = runner;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const finishX = START_X + FINISH_UNITS * UNIT_PX;

      [LANE_A_Y, LANE_B_Y].forEach((laneY) => {
        ctx.strokeStyle = "#dde2de";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(START_X, laneY);
        ctx.lineTo(finishX, laneY);
        ctx.stroke();
      });

      // Finish line
      ctx.strokeStyle = "#3c82f6";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(finishX, LANE_A_Y - 24);
      ctx.lineTo(finishX, LANE_B_Y + 24);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#3c82f6";
      ctx.font = "10px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("finish", finishX, LANE_A_Y - 30);

      const bodyA = bodyARef.current;
      const bodyB = bodyBRef.current;
      const now = performance.now();

      if (bodyA && bodyB) {
        [{ body: bodyA, y: LANE_A_Y, label: "A", finishRef: finishTimeARef, color: "#b7e33a" },
         { body: bodyB, y: LANE_B_Y, label: "B", finishRef: finishTimeBRef, color: "#3c82f6" }].forEach(({ body, y, label, finishRef, color }) => {
          const x = Math.min(body.position.x, finishX);
          ctx.beginPath();
          ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = "#17202a";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = "#17202a";
          ctx.font = "600 11px 'SFMono-Regular', Consolas, monospace";
          ctx.textAlign = "left";
          const elapsed = hasStartedRef.current ? ((finishRef.current ?? now) - startTimeRef.current) / 1000 : 0;
          ctx.fillText(`${label}: ${unitAt(body.position.x).toFixed(1)} u · ${elapsed.toFixed(1)} s`, START_X, y - RADIUS - 8);

          if (runningRef.current && finishRef.current === null && body.position.x >= finishX) {
            finishRef.current = now;
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
            Matter.Body.setPosition(body, { x: finishX, y });
          }
        });

        if (runningRef.current && finishTimeARef.current !== null && finishTimeBRef.current !== null) {
          runningRef.current = false;
          const tA = (finishTimeARef.current - startTimeRef.current) / 1000;
          const tB = (finishTimeBRef.current - startTimeRef.current) / 1000;
          const winner: Racer = tA < tB ? "A" : tB < tA ? "B" : "A";
          const gap = Math.abs(tA - tB);
          setPhase("done");
          setLog((prev) => [
            ...prev,
            `A crossed the finish line in ${tA.toFixed(1)} s. B crossed in ${tB.toFixed(1)} s.`,
            tA === tB
              ? "Both covered the same distance in exactly the same time — a dead heat."
              : `${winner} covered the same distance (${FINISH_UNITS} units) in less time — that's a greater speed. Speed is distance covered per unit of time.`,
            gap === 0
              ? ""
              : guess === winner
                ? `Your prediction (${guess}) was correct — ${winner} won by ${gap.toFixed(1)} s.`
                : `Your prediction (${guess}) didn't win this time — ${winner} finished first by ${gap.toFixed(1)} s.`,
          ].filter(Boolean));
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [guess]);

  const launch = () => {
    const bodyA = bodyARef.current;
    const bodyB = bodyBRef.current;
    if (!bodyA || !bodyB || runningRef.current) return;

    if (phase === "done") {
      Matter.Body.setPosition(bodyA, { x: START_X, y: LANE_A_Y });
      Matter.Body.setPosition(bodyB, { x: START_X, y: LANE_B_Y });
    }

    finishTimeARef.current = null;
    finishTimeBRef.current = null;
    startTimeRef.current = performance.now();
    Matter.Body.setVelocity(bodyA, { x: (speedARef.current * UNIT_PX) / 60, y: 0 });
    Matter.Body.setVelocity(bodyB, { x: (speedBRef.current * UNIT_PX) / 60, y: 0 });
    runningRef.current = true;
    hasStartedRef.current = true;
    setPhase("running");
    setLog((prev) => [...prev, `Both released — A at ${speedARef.current} u/s, B at ${speedBRef.current} u/s.`]);
  };

  const reset = () => {
    const bodyA = bodyARef.current;
    const bodyB = bodyBRef.current;
    if (!bodyA || !bodyB) return;
    Matter.Body.setPosition(bodyA, { x: START_X, y: LANE_A_Y });
    Matter.Body.setPosition(bodyB, { x: START_X, y: LANE_B_Y });
    Matter.Body.setVelocity(bodyA, { x: 0, y: 0 });
    Matter.Body.setVelocity(bodyB, { x: 0, y: 0 });
    runningRef.current = false;
    hasStartedRef.current = false;
    finishTimeARef.current = null;
    finishTimeBRef.current = null;
    setPhase("idle");
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="speed-a">
            Speed A (lime) <span className="mono">{speedA} u/s</span>
          </label>
          <input id="speed-a" type="range" min={1} max={10} value={speedA} disabled={phase === "running"} onChange={(e) => setSpeedA(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="speed-b">
            Speed B (blue) <span className="mono">{speedB} u/s</span>
          </label>
          <input id="speed-b" type="range" min={1} max={10} value={speedB} disabled={phase === "running"} onChange={(e) => setSpeedB(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label>Who do you predict finishes first?</label>
        <div className="kx-sandbox-chip-row">
          <button type="button" className="kx-sandbox-chip" data-active={guess === "A"} disabled={phase === "running"} onClick={() => setGuess("A")}>A</button>
          <button type="button" className="kx-sandbox-chip" data-active={guess === "B"} disabled={phase === "running"} onClick={() => setGuess("B")}>B</button>
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={launch} disabled={phase === "running"}>
          {phase === "done" ? "Run Again" : "Start Race"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => (
          <div key={i} className="kx-sandbox-log-line">{line}</div>
        ))}
      </div>
    </div>
  );
}
