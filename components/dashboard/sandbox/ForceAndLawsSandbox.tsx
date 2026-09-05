"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const UNIT_PX = 48;
const RULER_UNITS = 12;
const CANVAS_WIDTH = 680;
const CANVAS_HEIGHT = 220;
const TRACK_Y = 150;
const START_X = 40;
const PUSH_MS = 900;
const ACCEL_SCALE = 3.2;

type Phase = "idle" | "pushing" | "coasting" | "done";

function unitAt(pixelX: number) {
  return Math.max(0, (pixelX - START_X) / UNIT_PX);
}
function pxForUnit(unit: number) {
  return START_X + unit * UNIT_PX;
}
function halfFor(mass: number) {
  return 12 + mass * 2.2;
}

export function ForceAndLawsSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const objectRef = useRef<Matter.Body | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const forceRef = useRef(6);
  const massRef = useRef(4);
  const predictionRef = useRef(4);
  const pushStartRef = useRef(0);
  const lastFrameRef = useRef(0);
  const velocityUnitsRef = useRef(0);
  const ghostsRef = useRef<number[]>([]);

  const [force, setForce] = useState(6);
  const [mass, setMass] = useState(4);
  const [prediction, setPrediction] = useState(4);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { forceRef.current = force; }, [force]);
  useEffect(() => {
    massRef.current = mass;
    const object = objectRef.current;
    if (object && phaseRef.current === "idle") {
      const half = halfFor(mass);
      Matter.Body.setPosition(object, { x: START_X + half, y: TRACK_Y - half });
    }
  }, [mass]);
  useEffect(() => { predictionRef.current = prediction; }, [prediction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    const half = halfFor(massRef.current);
    const object = Matter.Bodies.rectangle(START_X + half, TRACK_Y - half, half * 2, half * 2, {
      frictionAir: 0,
      friction: 0,
      restitution: 0,
    });
    Matter.Composite.add(engine.world, [object]);
    engineRef.current = engine;
    objectRef.current = object;

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    runnerRef.current = runner;

    let raf: number;
    const draw = (t: number) => {
      const dt = lastFrameRef.current ? Math.min((t - lastFrameRef.current) / 1000, 0.05) : 0;
      lastFrameRef.current = t;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.strokeStyle = "#dde2de";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(START_X, TRACK_Y);
      ctx.lineTo(pxForUnit(RULER_UNITS), TRACK_Y);
      ctx.stroke();

      ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      for (let u = 0; u <= RULER_UNITS; u++) {
        const x = pxForUnit(u);
        const tall = u % 2 === 0;
        ctx.strokeStyle = tall ? "#8b96a3" : "#c8d0ca";
        ctx.beginPath();
        ctx.moveTo(x, TRACK_Y);
        ctx.lineTo(x, TRACK_Y + (tall ? 14 : 8));
        ctx.stroke();
        if (tall) { ctx.fillStyle = "#56616d"; ctx.fillText(String(u), x, TRACK_Y + 28); }
      }

      ghostsRef.current.forEach((unit) => {
        const x = pxForUnit(unit);
        ctx.beginPath();
        ctx.arc(x, TRACK_Y - 10, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(60, 130, 246, 0.4)";
        ctx.fill();
      });

      const object = objectRef.current;
      if (object) {
        if (phaseRef.current === "pushing") {
          const accel = (forceRef.current / massRef.current) * ACCEL_SCALE;
          velocityUnitsRef.current += accel * dt;
          Matter.Body.setVelocity(object, { x: (velocityUnitsRef.current * UNIT_PX) / 60, y: 0 });
          if (t - pushStartRef.current >= PUSH_MS) {
            phaseRef.current = "coasting";
            setPhase("coasting");
            setLog((prev) => [
              ...prev,
              `Push ended. It reached ${velocityUnitsRef.current.toFixed(1)} u/s — acceleration = Force ÷ Mass = ${forceRef.current} ÷ ${massRef.current} = ${(forceRef.current / massRef.current).toFixed(2)} (in force units per kg).`,
            ]);
          }
        }

        const trackEnd = pxForUnit(RULER_UNITS);
        if (phaseRef.current === "coasting" && object.position.x >= trackEnd) {
          Matter.Body.setPosition(object, { x: trackEnd, y: object.position.y });
          Matter.Body.setVelocity(object, { x: 0, y: 0 });
          phaseRef.current = "done";
          setPhase("done");
          const guess = predictionRef.current;
          const diff = Math.abs(velocityUnitsRef.current - guess);
          setLog((prev) => [
            ...prev,
            "It ran off the end of the track at a constant speed — with no friction acting on it, it never slowed down on its own. A moving object keeps its velocity unless a force acts on it (Newton's First Law); the track ending, not a force, is what stopped it here.",
            diff <= 0.7
              ? `Your predicted top speed of ${guess} u/s was close!`
              : `Your predicted top speed of ${guess} u/s was off — the actual top speed was ${velocityUnitsRef.current.toFixed(1)} u/s.`,
          ]);
        }

        const half = halfFor(massRef.current);
        const { x, y } = object.position;
        ctx.fillStyle = "#f59a3d";
        ctx.strokeStyle = "#17202a";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x - half, y - half, half * 2, half * 2, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#17202a";
        ctx.font = "700 10px Inter, sans-serif";
        ctx.fillText(`${massRef.current}kg`, x, y + 4);

        ctx.textAlign = "left";
        ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
        ctx.fillText(`Velocity: ${velocityUnitsRef.current.toFixed(1)} u/s`, START_X, 20);
        ctx.fillText(`Phase: ${phaseRef.current}`, START_X + 220, 20);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  const launch = () => {
    const object = objectRef.current;
    if (!object || phaseRef.current === "pushing" || phaseRef.current === "coasting") return;

    if (phaseRef.current === "done") {
      ghostsRef.current = [unitAt(object.position.x), ...ghostsRef.current].slice(0, 4);
      const half = halfFor(massRef.current);
      Matter.Body.setPosition(object, { x: START_X + half, y: TRACK_Y - half });
    }
    velocityUnitsRef.current = 0;
    pushStartRef.current = performance.now();
    lastFrameRef.current = performance.now();
    phaseRef.current = "pushing";
    setPhase("pushing");
    setLog((prev) => [...prev, `Pushing with ${forceRef.current} force units against a ${massRef.current} kg mass.`]);
  };

  const reset = () => {
    const object = objectRef.current;
    if (!object) return;
    const half = halfFor(massRef.current);
    Matter.Body.setPosition(object, { x: START_X + half, y: TRACK_Y - half });
    Matter.Body.setVelocity(object, { x: 0, y: 0 });
    velocityUnitsRef.current = 0;
    phaseRef.current = "idle";
    ghostsRef.current = [];
    setPhase("idle");
    setLog(["Ready"]);
  };

  const busy = phase === "pushing" || phase === "coasting";

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="mass-slider">Mass <span className="mono">{mass} kg</span></label>
          <input id="mass-slider" type="range" min={1} max={10} value={mass} disabled={busy} onChange={(e) => setMass(Number(e.target.value))} />
        </div>
        <div className="kx-sandbox-field">
          <label htmlFor="force-slider">Force <span className="mono">{force}/10</span></label>
          <input id="force-slider" type="range" min={1} max={10} value={force} disabled={busy} onChange={(e) => setForce(Number(e.target.value))} />
        </div>
      </div>

      <div className="kx-sandbox-field" style={{ marginBottom: 16 }}>
        <label htmlFor="prediction-slider">
          Predict the top speed it reaches <span className="mono">{prediction} u/s</span>
        </label>
        <input id="prediction-slider" type="range" min={0} max={12} step={0.5} value={prediction} disabled={busy} onChange={(e) => setPrediction(Number(e.target.value))} />
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={launch} disabled={busy}>
          {phase === "done" ? "Push Again" : "Apply Force"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
