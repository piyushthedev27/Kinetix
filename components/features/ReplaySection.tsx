"use client";

import { motion, useReducedMotion } from "motion/react";
import { Play, Pause, SkipBack } from "lucide-react";
import { SectionHeading, Button } from "@/components/ui";
import { useState, useEffect } from "react";

export function ReplaySection() {
  const reduce = useReducedMotion();
  const [currentFrame, setCurrentFrame] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const totalFrames = 62;

  // Playback animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= totalFrames) {
          setIsPlaying(false);
          return totalFrames;
        }
        return prev + 1;
      });
    }, 100 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    } else if (e.key === "ArrowLeft") {
      setCurrentFrame(Math.max(0, currentFrame - 1));
    } else if (e.key === "ArrowRight") {
      setCurrentFrame(Math.min(totalFrames, currentFrame + 1));
    }
  };

  return (
    <section className="replay-section">
      <div className="container">
        <SectionHeading
          eyebrow="Interactive Playback"
          title="Replay frame by frame."
          description="Pause at any moment to see velocity, trajectory, and angle. Understand the physics step by step."
        />

        <div className="replay-layout">
          <motion.div
            className="replay-viewer"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6 }}
          >
            <div className="replay-screen">
              <svg viewBox="0 0 480 320" role="img" aria-label="Replay visualization">
                {/* Grid */}
                <line x1="30" y1="240" x2="450" y2="240" stroke="var(--line)" strokeWidth="1" />

                {/* Ground indicator */}
                <rect x="30" y="240" width="420" height="50" fill="var(--lime-soft)" opacity="0.3" />
                <text x="240" y="285" textAnchor="middle" className="replay-label">
                  Ground reference
                </text>

                {/* Trajectory path */}
                <motion.path
                  d="M 60 220 Q 160 80 320 240"
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                />

                {/* Ball at frame 0 (initial) */}
                <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
                  <circle cx="60" cy="220" r="8" fill="var(--lime)" stroke="var(--ink)" strokeWidth="2" />
                  <text x="50" y="260" className="frame-label">
                    Frame 0
                  </text>
                </motion.g>

                {/* Ball at frame mid (apex) */}
                <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }}>
                  <circle cx="160" cy="80" r="8" fill="var(--lime)" stroke="var(--ink)" strokeWidth="2" />
                  <text x="155" y="60" className="frame-label" textAnchor="middle">
                    Apex
                  </text>
                  {/* Velocity arrow */}
                  <line x1="160" y1="80" x2="200" y2="85" stroke="var(--blue)" strokeWidth="2" />
                  <polygon points="200,85 195,82 197,90" fill="var(--blue)" />
                </motion.g>

                {/* Ball at frame end */}
                <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 }}>
                  <circle cx="320" cy="240" r="8" fill="var(--lime)" stroke="var(--ink)" strokeWidth="2" />
                  <text x="330" y="260" className="frame-label">
                    Frame 62
                  </text>
                </motion.g>

                {/* Angle indicator */}
                <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.9 }}>
                  <line x1="60" y1="220" x2="95" y2="220" stroke="var(--orange)" strokeWidth="1.5" />
                  <path d="M 75 220 A 15 15 0 0 0 87 197" fill="none" stroke="var(--orange)" strokeWidth="1.5" />
                  <text x="85" y="215" className="replay-annotation">
                    38°
                  </text>
                </motion.g>
              </svg>

              <div className="replay-controls" onKeyDown={handleKeyDown} role="group" aria-label="Replay controls">
                <button
                  className="replay-btn"
                  onClick={() => setCurrentFrame(0)}
                  aria-label="Skip to beginning"
                  title="Skip to beginning"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  className={`replay-btn ${isPlaying ? "" : "play"}`}
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause replay" : "Play replay"}
                  aria-pressed={isPlaying}
                  title="Play/Pause"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <div className="replay-timeline">
                  <input
                    type="range"
                    className="timeline-slider"
                    min="0"
                    max={totalFrames}
                    value={currentFrame}
                    onChange={(e) => setCurrentFrame(Number(e.target.value))}
                    aria-label="Replay timeline"
                    aria-valuemin={0}
                    aria-valuemax={totalFrames}
                    aria-valuenow={currentFrame}
                    aria-valuetext={`Frame ${currentFrame} of ${totalFrames}`}
                  />
                  <span className="frame-counter" aria-live="polite">
                    {currentFrame} / {totalFrames}
                  </span>
                </div>

                <div className="replay-speed">
                  <label htmlFor="speed-select">Speed:</label>
                  <select
                    id="speed-select"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    aria-label="Playback speed"
                  >
                    <option value={0.25}>0.25x</option>
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live metrics sidebar */}
            <motion.div
              className="replay-metrics"
              initial={reduce ? false : { opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.5 }}
            >
              <div className="metric-box">
                <span>Position (m)</span>
                <strong>
                  <small>x:</small> {(2.4 + (currentFrame / totalFrames) * 2.8).toFixed(2)} <small>y:</small> {Math.round(220 - (currentFrame / totalFrames) * 140)}
                </strong>
              </div>
              <div className="metric-box">
                <span>Velocity (m/s)</span>
                <strong>{(4.2 * (1 - Math.abs(currentFrame - totalFrames / 2) / (totalFrames / 2))).toFixed(2)}</strong>
              </div>
              <div className="metric-box">
                <span>Time (s)</span>
                <strong>{(currentFrame * 0.01).toFixed(2)}</strong>
              </div>
            </motion.div>
          </motion.div>

          {/* Comparison section */}
          <motion.div
            className="replay-comparison"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.3, duration: 0.65 }}
          >
            <h3>Side-by-Side Comparison</h3>
            <p>Compare your predictions with actual results. Watch how angle and velocity affect the trajectory.</p>

            <div className="comparison-chart">
              <div className="chart-column">
                <span className="chart-label">Your Prediction</span>
                <div className="chart-bars">
                  <div className="chart-bar" style={{ height: "85%" }}>
                    <span>40°</span>
                  </div>
                </div>
              </div>
              <div className="chart-column">
                <span className="chart-label">Actual Result</span>
                <div className="chart-bars">
                  <div className="chart-bar actual" style={{ height: "92%" }}>
                    <span>38°</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="comparison-stats">
              <div>
                <span>Accuracy</span>
                <strong>95%</strong>
              </div>
              <div>
                <span>Difference</span>
                <strong>2°</strong>
              </div>
            </div>

            <Button href="/app/history" variant="secondary">
              View Full Comparison
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
