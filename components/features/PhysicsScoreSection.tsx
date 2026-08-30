"use client";

import { useRef, useEffect } from "react";
import { motion, useReducedMotion, useInView, animate } from "motion/react";
import { SectionHeading, Button } from "@/components/ui";

const scoreExamples = [
  {
    score: 87,
    accuracy: 87,
    angle: 92,
    range: 81,
    accuracyLabel: "Prediction Accuracy",
    angleLabel: "Launch Angle Match",
    rangeLabel: "Landing Accuracy",
  },
  {
    score: 94,
    accuracy: 94,
    angle: 96,
    range: 92,
    accuracyLabel: "Prediction Accuracy",
    angleLabel: "Launch Angle Match",
    rangeLabel: "Landing Accuracy",
  },
  {
    score: 73,
    accuracy: 73,
    angle: 68,
    range: 78,
    accuracyLabel: "Prediction Accuracy",
    angleLabel: "Launch Angle Match",
    rangeLabel: "Landing Accuracy",
  },
];

function ScoreRingCard({ example }: { example: typeof scoreExamples[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const fill1Ref = useRef<HTMLDivElement>(null);
  const fill2Ref = useRef<HTMLDivElement>(null);
  const fill3Ref = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    if (!isInView) {
      // Hide instantly before scroll if JS is active
      if (ringRef.current) ringRef.current.style.setProperty("--ring-value", "0");
      if (fill1Ref.current) fill1Ref.current.style.transform = "scaleX(0)";
      if (fill2Ref.current) fill2Ref.current.style.transform = "scaleX(0)";
      if (fill3Ref.current) fill3Ref.current.style.transform = "scaleX(0)";
    } else {
      // Animate to target
      if (ringRef.current) {
        animate(ringRef.current, { "--ring-value": example.score }, { duration: 1, ease: "easeOut" });
      }
      const fills = [fill1Ref.current, fill2Ref.current, fill3Ref.current];
      fills.forEach((el, i) => {
        if (el) animate(el, { scaleX: 1 }, { duration: 0.8, delay: i * 0.1, ease: "easeOut" });
      });
    }
  }, [isInView, example.score, reduce]);

  return (
    <motion.article
      ref={ref}
      className="score-card"
      initial={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      aria-label={`Score ${example.score} out of 100: Accuracy ${example.accuracy}%, Angle ${example.angle}%, Range ${example.range}%`}
    >
      <div className="score-display">
        <div ref={ringRef} className="score-ring" role="img" aria-label={`Physics score: ${example.score} out of 100`} style={{ ["--ring-value" as string]: example.score }}>
          <strong>{example.score}</strong>
          <span>/100</span>
        </div>
        <span className="score-label">Physics Score</span>
      </div>

      <div className="score-breakdown" aria-label="Score breakdown">
        <div className="score-item">
          <span className="score-item-label">{example.accuracyLabel}</span>
          <div className="score-bar" role="progressbar" aria-valuenow={example.accuracy} aria-valuemin={0} aria-valuemax={100}>
            <div ref={fill1Ref} className="score-fill" style={{ width: `${example.accuracy}%` }} />
          </div>
          <span className="score-value">{example.accuracy}%</span>
        </div>

        <div className="score-item">
          <span className="score-item-label">{example.angleLabel}</span>
          <div className="score-bar" role="progressbar" aria-valuenow={example.angle} aria-valuemin={0} aria-valuemax={100}>
            <div ref={fill2Ref} className="score-fill" style={{ width: `${example.angle}%` }} />
          </div>
          <span className="score-value">{example.angle}%</span>
        </div>

        <div className="score-item">
          <span className="score-item-label">{example.rangeLabel}</span>
          <div className="score-bar" role="progressbar" aria-valuenow={example.range} aria-valuemin={0} aria-valuemax={100}>
            <div ref={fill3Ref} className="score-fill" style={{ width: `${example.range}%` }} />
          </div>
          <span className="score-value">{example.range}%</span>
        </div>
      </div>
    </motion.article>
  );
}

export function PhysicsScoreSection() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section className="physics-score-section">
        <div className="container">
          <SectionHeading eyebrow="Performance Metrics" title="Every throw is graded." description="Your predictions are scored instantly. Track your improvement across experiments." />
          <div className="score-grid" role="region" aria-label="Physics score cards">
            {scoreExamples.map((example, index) => (
              <motion.article key={index} className="score-card" initial={{ opacity: 0, scale: 0.95, y: 18 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.12 }} whileHover={{ y: -8, transition: { duration: 0.3 } }} aria-label={`Score ${example.score} out of 100: Accuracy ${example.accuracy}%, Angle ${example.angle}%, Range ${example.range}%`}>
                <div className="score-display">
                  <div className="score-ring" style={{ ["--ring-value" as string]: example.score }} role="img" aria-label={`Physics score: ${example.score} out of 100`}>
                    <strong>{example.score}</strong>
                    <span>/100</span>
                  </div>
                  <span className="score-label">Physics Score</span>
                </div>

                <div className="score-breakdown" aria-label="Score breakdown">
                  <div className="score-item"><span className="score-item-label">{example.accuracyLabel}</span><div className="score-bar" role="progressbar" aria-valuenow={example.accuracy} aria-valuemin={0} aria-valuemax={100}><div className="score-fill" style={{ width: `${example.accuracy}%` }} /></div><span className="score-value">{example.accuracy}%</span></div>
                  <div className="score-item"><span className="score-item-label">{example.angleLabel}</span><div className="score-bar" role="progressbar" aria-valuenow={example.angle} aria-valuemin={0} aria-valuemax={100}><div className="score-fill" style={{ width: `${example.angle}%` }} /></div><span className="score-value">{example.angle}%</span></div>
                  <div className="score-item"><span className="score-item-label">{example.rangeLabel}</span><div className="score-bar" role="progressbar" aria-valuenow={example.range} aria-valuemin={0} aria-valuemax={100}><div className="score-fill" style={{ width: `${example.range}%` }} /></div><span className="score-value">{example.range}%</span></div>
                </div>
              </motion.article>
            ))}
          </div>
          <motion.div className="score-cta" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.35 }}><Button href="/app/dashboard">Check Your Scores</Button></motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="physics-score-section">
      <div className="container">
        <SectionHeading eyebrow="Performance Metrics" title="Every throw is graded." description="Your predictions are scored instantly. Track your improvement across experiments." />

        <div className="score-grid" role="region" aria-label="Physics score cards">
          {scoreExamples.map((example, index) => (
            <ScoreRingCard key={index} example={example} />
          ))}
        </div>

        <motion.div className="score-cta" initial={{ opacity: 1, y: 0 }}><Button href="/app/dashboard">Check Your Scores</Button></motion.div>
      </div>
    </section>
  );
}
