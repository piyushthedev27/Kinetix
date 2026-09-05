"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const UNIT_PX = 48;
const RULER_UNITS = 12;
const CANVAS_WIDTH = 680;
const CANVAS_HEIGHT = 240;
const TRACK_Y = 172;
const OBJECT_RADIUS = 18;
const START_X = 40;
const FRICTION_AIR = 0.045;
const STOP_SPEED_THRESHOLD = 0.03;
const VELOCITY_PER_FORCE = 2.2;
const MAX_GHOSTS = 3;

function unitAt(pixelX: number) {
  return Math.max(0, (pixelX - START_X) / UNIT_PX);
}

function pxForUnit(unit: number) {
  return START_X + unit * UNIT_PX;
}

function feedbackFor(diff: number) {
  if (diff <= 0.5) return "Spot on! Your prediction matched the ruler almost exactly.";
  if (diff <= 1.5) return "Close — a small gap between your prediction and the reading.";
  return "Not quite. Try a different force and see how the stopping point shifts.";
}

type Phase = "idle" | "running" | "done";

export function MotionMeasurementSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const objectRef = useRef<Matter.Body | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const movingRef = useRef(false);
  const forceRef = useRef(6);
  const predictionRef = useRef(6);
  const ghostsRef = useRef<number[]>([]);
  const peakSpeedRef = useRef(0);

  const [force, setForce] = useState(6);
  const [prediction, setPrediction] = useState(6);
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => {
    forceRef.current = force;
  }, [force]);

  useEffect(() => {
    predictionRef.current = prediction;
  }, [prediction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    const object = Matter.Bodies.circle(START_X, TRACK_Y - OBJECT_RADIUS, OBJECT_RADIUS, {
      frictionAir: FRICTION_AIR,
      friction: 0,
      frictionStatic: 0,
      restitution: 0,
    });
    Matter.Composite.add(engine.world, [object]);
    engineRef.current = engine;
    objectRef.current = object;

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    runnerRef.current = runner;

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Track
      ctx.strokeStyle = "#dde2de";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(START_X, TRACK_Y);
      ctx.lineTo(START_X + RULER_UNITS * UNIT_PX, TRACK_Y);
      ctx.stroke();

      // Ruler ticks + labels
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
        if (tall) {
          ctx.fillStyle = "#56616d";
          ctx.fillText(String(u), x, TRACK_Y + 28);
        }
      }

      // Prediction marker
      const predX = pxForUnit(predictionRef.current);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "#3c82f6";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(predX, TRACK_Y - 54);
      ctx.lineTo(predX, TRACK_Y + 4);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#3c82f6";
      ctx.font = "10px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("your guess", predX, TRACK_Y - 60);

      // Ghost trail from earlier runs
      ghostsRef.current.forEach((unit) => {
        const x = pxForUnit(unit);
        ctx.beginPath();
        ctx.arc(x, TRACK_Y - OBJECT_RADIUS, OBJECT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(183, 227, 58, 0.25)";
        ctx.fill();
        ctx.strokeStyle = "rgba(23, 32, 42, 0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      const object = objectRef.current;
      if (object) {
        const { x, y } = object.position;
        const speed = object.speed;
        peakSpeedRef.current = Math.max(peakSpeedRef.current, speed);

        // Force arrow while moving
        if (movingRef.current && speed > 0.05) {
          const arrowLen = Math.min(90, (speed / Math.max(peakSpeedRef.current, 0.01)) * 90);
          ctx.strokeStyle = "#f59a3d";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, y - OBJECT_RADIUS - 12);
          ctx.lineTo(x + arrowLen, y - OBJECT_RADIUS - 12);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + arrowLen, y - OBJECT_RADIUS - 12);
          ctx.lineTo(x + arrowLen - 7, y - OBJECT_RADIUS - 17);
          ctx.lineTo(x + arrowLen - 7, y - OBJECT_RADIUS - 7);
          ctx.closePath();
          ctx.fillStyle = "#f59a3d";
          ctx.fill();
        }

        // Object
        ctx.beginPath();
        ctx.arc(x, y, OBJECT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#b7e33a";
        ctx.fill();
        ctx.strokeStyle = "#17202a";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Live readout
        ctx.textAlign = "left";
        ctx.fillStyle = "#17202a";
        ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
        ctx.fillText(`Position: ${unitAt(x).toFixed(1)} u`, START_X, 22);
        ctx.fillText(`Speed: ${(speed * 0.83).toFixed(1)} u/s`, START_X + 160, 22);

        if (movingRef.current && speed < STOP_SPEED_THRESHOLD) {
          Matter.Body.setVelocity(object, { x: 0, y: 0 });
          movingRef.current = false;
          const actual = Math.round(unitAt(x) * 2) / 2;
          const guess = predictionRef.current;
          const diff = Math.abs(actual - guess);
          setPhase("done");
          setLog((prev) => [
            ...prev,
            "Motion detected: the object's position changed over time — this is Motion.",
            `It came to rest at the ${actual} mark. Reading 0 → ${actual} on the ruler is the Measurement of Distance.`,
            `Your guess was ${guess}. ${feedbackFor(diff)}`,
          ]);
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
  }, []);

  const launch = () => {
    const object = objectRef.current;
    if (!object || movingRef.current) return;

    if (phase === "done") {
      const finalUnit = Math.round(unitAt(object.position.x) * 2) / 2;
      ghostsRef.current = [finalUnit, ...ghostsRef.current].slice(0, MAX_GHOSTS);
      Matter.Body.setPosition(object, { x: START_X, y: TRACK_Y - OBJECT_RADIUS });
    }

    peakSpeedRef.current = 0;
    Matter.Body.setVelocity(object, { x: forceRef.current * VELOCITY_PER_FORCE, y: 0 });
    movingRef.current = true;
    setPhase("running");
    setLog((prev) => [...prev, `Force Applied — level ${forceRef.current}.`]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const object = objectRef.current;
    if (!object) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const dx = x - object.position.x;
    const dy = y - object.position.y;
    if (Math.sqrt(dx * dx + dy * dy) <= OBJECT_RADIUS + 6) launch();
  };

  const reset = () => {
    const object = objectRef.current;
    if (!object) return;
    Matter.Body.setPosition(object, { x: START_X, y: TRACK_Y - OBJECT_RADIUS });
    Matter.Body.setVelocity(object, { x: 0, y: 0 });
    movingRef.current = false;
    ghostsRef.current = [];
    peakSpeedRef.current = 0;
    setPhase("idle");
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label htmlFor="force-slider">
            Force <span className="mono">{force}/10</span>
          </label>
          <input
            id="force-slider"
            type="range"
            min={1}
            max={10}
            value={force}
            disabled={phase === "running"}
            onChange={(e) => setForce(Number(e.target.value))}
          />
        </div>

        <div className="kx-sandbox-field">
          <label htmlFor="prediction-slider">
            Your prediction — where will it stop? <span className="mono">{prediction} u</span>
          </label>
          <input
            id="prediction-slider"
            type="range"
            min={0}
            max={RULER_UNITS}
            step={0.5}
            value={prediction}
            disabled={phase === "running"}
            onChange={(e) => setPrediction(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="kx-sandbox-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="kx-sandbox-canvas"
          role="button"
          aria-label="Click the object to apply force"
        />
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={launch} disabled={phase === "running"}>
          {phase === "done" ? "Run Again" : "Start Experiment"}
        </button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => (
          <div key={i} className="kx-sandbox-log-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
