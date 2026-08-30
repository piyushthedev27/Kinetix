"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Play, Pause, SkipBack } from "lucide-react";
import { SectionHeading, Button } from "@/components/ui";
import { useState, useEffect, useRef } from "react";

function ReplayPreview() {
  return (
    <div className="replay-scroll-preview">
      <svg viewBox="0 0 480 220" role="img" aria-label="Replay preview">
        <line x1="30" y1="170" x2="450" y2="170" stroke="var(--line)" strokeWidth="1" />
        <path d="M 40 155 Q 120 100 210 130 T 360 170" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeDasharray="5 5" />
        <circle cx="120" cy="100" r="8" fill="var(--lime)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="210" cy="130" r="8" fill="var(--lime)" stroke="var(--ink)" strokeWidth="2" />
        <line x1="210" y1="130" x2="250" y2="122" stroke="var(--blue)" strokeWidth="2" />
        <polygon points="250,122 243,119 246,128" fill="var(--blue)" />
      </svg>
      {/* Velocity waveform */}
      <svg className="waveform-svg" viewBox="0 0 480 40" preserveAspectRatio="none" style={{ marginTop: '-10px', width: '100%', height: '40px', display: 'block' }} aria-hidden="true">
        <polyline points="0,40 20,38 40,30 60,10 80,15 100,20 120,30 140,25 160,20 180,15 200,10 220,5 240,10 260,15 280,25 300,30 320,35 340,30 360,25 380,20 400,25 420,30 440,35 460,38 480,40" fill="none" stroke="var(--blue)" strokeWidth="1.5" opacity="0.4" />
      </svg>
    </div>
  );
}

export function ReplaySection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const viewerY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const comparisonY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const [currentFrame, setCurrentFrame] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const totalFrames = 62;

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

  if (reduce) {
    return (
      <section className="replay-section">
        <div className="container">
          <SectionHeading eyebrow="Interactive Playback" title="Replay frame by frame." description="Pause at any moment to see velocity, trajectory, and angle. Understand the physics step by step." />
        <div className="replay-layout">
          <motion.div className="replay-viewer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
            <div className="replay-screen">
              <ReplayPreview />

              <div className="replay-controls" role="group" aria-label="Replay controls">
                <button className="replay-btn" onClick={() => setCurrentFrame(0)} aria-label="Skip to beginning" title="Skip to beginning"><SkipBack size={16} /></button>
                <button className={`replay-btn ${isPlaying ? "" : "play"}`} onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause replay" : "Play replay"} aria-pressed={isPlaying} title="Play/Pause">{isPlaying ? <Pause size={16} /> : <Play size={16} />}</button>
                <div className="replay-timeline"><input type="range" className="timeline-slider" min="0" max={totalFrames} value={currentFrame} onChange={(e) => setCurrentFrame(Number(e.target.value))} aria-label="Replay timeline" /><span className="frame-counter">{currentFrame} / {totalFrames}</span></div>
                <div className="replay-speed"><label htmlFor="speed-select">Speed:</label><select id="speed-select" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label="Playback speed"><option value={0.25}>0.25x</option><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option></select></div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="replay-section">
      <div className="container">
        <SectionHeading eyebrow="Interactive Playback" title="Replay frame by frame." description="Pause at any moment to see velocity, trajectory, and angle. Understand the physics step by step." />

        <div className="replay-layout">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
            <motion.div className="replay-viewer" style={reduce ? undefined : { y: viewerY }}>
              <div className="replay-screen">
                <ReplayPreview />

                <div className="replay-controls" onKeyDown={handleKeyDown} role="group" aria-label="Replay controls">
                  <button className="replay-btn" onClick={() => setCurrentFrame(0)} aria-label="Skip to beginning" title="Skip to beginning"><SkipBack size={16} /></button>
                  <button className={`replay-btn ${isPlaying ? "" : "play"}`} onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause replay" : "Play replay"} aria-pressed={isPlaying} title="Play/Pause">{isPlaying ? <Pause size={16} /> : <Play size={16} />}</button>
                  <div className="replay-timeline"><input type="range" className="timeline-slider" min="0" max={totalFrames} value={currentFrame} onChange={(e) => setCurrentFrame(Number(e.target.value))} aria-label="Replay timeline" /><span className="frame-counter">{currentFrame} / {totalFrames}</span></div>
                  <div className="replay-speed"><label htmlFor="speed-select">Speed:</label><select id="speed-select" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label="Playback speed"><option value={0.25}>0.25x</option><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option></select></div>
                </div>
              </div>

              <div className="replay-metrics">
                <div className="metric-box"><span>Position (m)</span><strong><small>x:</small> {(2.4 + (currentFrame / totalFrames) * 2.8).toFixed(2)} <small>y:</small> {Math.round(220 - (currentFrame / totalFrames) * 140)}</strong></div>
                <div className="metric-box"><span>Velocity (m/s)</span><strong>{(4.2 * (1 - Math.abs(currentFrame - totalFrames / 2) / (totalFrames / 2))).toFixed(2)}</strong></div>
                <div className="metric-box"><span>Time (s)</span><strong>{(currentFrame * 0.01).toFixed(2)}</strong></div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <motion.div className="replay-comparison" style={reduce ? undefined : { y: comparisonY }}>
              <h3>Side-by-Side Comparison</h3>
              <p>Compare your predictions with actual results. Watch how angle and velocity affect the trajectory.</p>
              <div className="comparison-chart">
                <div className="chart-column"><span className="chart-label">Your Prediction</span><div className="chart-bars"><div className="chart-bar" style={{ height: "85%" }}><span>40°</span></div></div></div>
                <div className="chart-column"><span className="chart-label">Actual Result</span><div className="chart-bars"><div className="chart-bar actual" style={{ height: "92%" }}><span>38°</span></div></div></div>
              </div>
              <div className="comparison-stats"><div><span>Accuracy</span><strong>95%</strong></div><div><span>Difference</span><strong>2°</strong></div></div>
              <Button href="/app/history" variant="secondary">View Full Comparison</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
