"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const UNIT_PX = 48;
const RULER_UNITS = 12;
const CANVAS_WIDTH = 680;
const CANVAS_HEIGHT = 240;
const TRACK_Y = 172;
const HALF = 16;
const START_X = 40;
const STOP_SPEED_THRESHOLD = 0.03;
const VELOCITY_PER_FORCE = 2.2;
const MAX_GHOSTS = 4;

type SurfaceId = "ice" | "wood" | "sandpaper";

const SURFACES: Record<SurfaceId, { label: string; frictionAir: number; base: string; grain: string }> = {
  ice: { label: "Ice", frictionAir: 0.05, base: "#eaf2ff", grain: "#bcd8ff" },
  wood: { label: "Wood", frictionAir: 0.09, base: "#f1e3cf", grain: "#c9a877" },
  sandpaper: { label: "Sandpaper", frictionAir: 0.16, base: "#e8ddc9", grain: "#a68a5b" },
};

function unitAt(pixelX: number) {
  return Math.max(0, (pixelX - START_X) / UNIT_PX);
}

function pxForUnit(unit: number) {
  return START_X + unit * UNIT_PX;
}

type Phase = "idle" | "running" | "done";

export function FrictionSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const objectRef = useRef<Matter.Body | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const movingRef = useRef(false);
  const forceRef = useRef(6);
  const predictionRef = useRef(5);
  const surfaceRef = useRef<SurfaceId>("wood");
  const ghostsRef = useRef<{ unit: number; surface: SurfaceId }[]>([]);
  const grainSeedRef = useRef(0);

  const [force, setForce] = useState(6);
  const [prediction, setPrediction] = useState(5);
  const [surface, setSurface] = useState<SurfaceId>("wood");
  const [phase, setPhase] = useState<Phase>("idle");
  const [log, setLog] = useState<string[]>(["Ready"]);

  useEffect(() => { forceRef.current = force; }, [force]);
  useEffect(() => { predictionRef.current = prediction; }, [prediction]);
  useEffect(() => { surfaceRef.current = surface; }, [surface]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    const object = Matter.Bodies.rectangle(START_X + HALF, TRACK_Y - HALF, HALF * 2, HALF * 2, {
      frictionAir: SURFACES.wood.frictionAir,
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
      const surf = SURFACES[surfaceRef.current];
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Surface strip
      ctx.fillStyle = surf.base;
      ctx.fillRect(START_X - 10, TRACK_Y - 2, RULER_UNITS * UNIT_PX + 20, 10);
      ctx.strokeStyle = "#c8d0ca";
      ctx.strokeRect(START_X - 10, TRACK_Y - 2, RULER_UNITS * UNIT_PX + 20, 10);

      // Deterministic grain texture so it doesn't flicker every frame
      let seed = 1;
      ctx.fillStyle = surf.grain;
      for (let i = 0; i < 40; i++) {
        seed = (seed * 9301 + 49297) % 233280;
        const gx = START_X - 10 + (seed / 233280) * (RULER_UNITS * UNIT_PX + 20);
        seed = (seed * 9301 + 49297) % 233280;
        const gy = TRACK_Y - 2 + (seed / 233280) * 10;
        ctx.fillRect(gx, gy, surfaceRef.current === "ice" ? 1 : 2, surfaceRef.current === "ice" ? 1 : 2);
      }

      // Ruler ticks + labels
      ctx.font = "11px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      for (let u = 0; u <= RULER_UNITS; u++) {
        const x = pxForUnit(u);
        const tall = u % 2 === 0;
        ctx.strokeStyle = tall ? "#8b96a3" : "#c8d0ca";
        ctx.beginPath();
        ctx.moveTo(x, TRACK_Y + 8);
        ctx.lineTo(x, TRACK_Y + 8 + (tall ? 14 : 8));
        ctx.stroke();
        if (tall) {
          ctx.fillStyle = "#56616d";
          ctx.fillText(String(u), x, TRACK_Y + 46);
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
      ctx.lineTo(predX, TRACK_Y + 12);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#3c82f6";
      ctx.font = "10px Inter, ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("your guess", predX, TRACK_Y - 60);

      // Ghost trail
      ghostsRef.current.forEach(({ unit, surface: gs }) => {
        const x = pxForUnit(unit);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = SURFACES[gs].grain;
        ctx.fillRect(x - HALF, TRACK_Y - HALF * 2, HALF * 2, HALF * 2);
        ctx.globalAlpha = 1;
        ctx.font = "9px Inter, ui-sans-serif, system-ui, sans-serif";
        ctx.fillStyle = "#8b96a3";
        ctx.fillText(SURFACES[gs].label[0], x, TRACK_Y - HALF * 2 - 4);
      });

      const object = objectRef.current;
      if (object) {
        const trackEndX = pxForUnit(RULER_UNITS);
        if (movingRef.current && object.position.x >= trackEndX) {
          Matter.Body.setPosition(object, { x: trackEndX, y: object.position.y });
          Matter.Body.setVelocity(object, { x: 0, y: 0 });
        }

        const { x, y } = object.position;
        const speed = object.speed;

        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = "#b7e33a";
        ctx.strokeStyle = "#17202a";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-HALF, -HALF, HALF * 2, HALF * 2, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.textAlign = "left";
        ctx.fillStyle = "#17202a";
        ctx.font = "600 12px 'SFMono-Regular', Consolas, monospace";
        ctx.fillText(`Position: ${unitAt(x).toFixed(1)} u`, START_X, 22);
        ctx.fillText(`Speed: ${(speed * 0.83).toFixed(1)} u/s`, START_X + 160, 22);
        ctx.fillText(`Surface: ${surf.label}`, START_X + 320, 22);

        if (movingRef.current && speed < STOP_SPEED_THRESHOLD) {
          Matter.Body.setVelocity(object, { x: 0, y: 0 });
          movingRef.current = false;
          const actual = Math.round(unitAt(x) * 2) / 2;
          const guess = predictionRef.current;
          const diff = Math.abs(actual - guess);
          setPhase("done");
          setLog((prev) => [
            ...prev,
            `It slid to a stop at the ${actual} mark on ${surf.label.toLowerCase()}.`,
            `${surf.label} resists sliding more than a smoother surface — that resistive force is Friction. Rougher surface → more friction → shorter distance for the same push.`,
            diff <= 0.5
              ? `Your guess of ${guess} was spot on!`
              : diff <= 1.5
                ? `Your guess of ${guess} was close.`
                : `Your guess of ${guess} was off — try comparing surfaces at the same force.`,
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
      ghostsRef.current = [{ unit: finalUnit, surface: surfaceRef.current }, ...ghostsRef.current].slice(0, MAX_GHOSTS);
      Matter.Body.setPosition(object, { x: START_X + HALF, y: TRACK_Y - HALF });
    }

    object.frictionAir = SURFACES[surfaceRef.current].frictionAir;
    Matter.Body.setVelocity(object, { x: forceRef.current * VELOCITY_PER_FORCE, y: 0 });
    movingRef.current = true;
    setPhase("running");
    setLog((prev) => [...prev, `Force Applied — level ${forceRef.current} on ${SURFACES[surfaceRef.current].label.toLowerCase()}.`]);
  };

  const reset = () => {
    const object = objectRef.current;
    if (!object) return;
    Matter.Body.setPosition(object, { x: START_X + HALF, y: TRACK_Y - HALF });
    Matter.Body.setVelocity(object, { x: 0, y: 0 });
    movingRef.current = false;
    ghostsRef.current = [];
    setPhase("idle");
    setLog(["Ready"]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-setup">
        <div className="kx-sandbox-field">
          <label>Surface</label>
          <div className="kx-sandbox-chip-row">
            {(Object.keys(SURFACES) as SurfaceId[]).map((id) => (
              <button
                key={id}
                type="button"
                className="kx-sandbox-chip"
                data-active={surface === id}
                disabled={phase === "running"}
                onClick={() => setSurface(id)}
              >
                {SURFACES[id].label}
              </button>
            ))}
          </div>
        </div>

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
            Predict the stopping point <span className="mono">{prediction} u</span>
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
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="kx-sandbox-canvas" />
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
          <div key={i} className="kx-sandbox-log-line">{line}</div>
        ))}
      </div>
    </div>
  );
}
