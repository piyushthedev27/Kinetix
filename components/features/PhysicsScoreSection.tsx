"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionHeading, Button } from "@/components/ui";

interface PhysicsScore {
  total: number;
  accuracy: number;
  angle: number;
  range: number;
}

const scoreExamples = [
  {
    score: 87,
    accuracy: "87%",
    accuracyLabel: "Prediction Accuracy",
    angle: "92%",
    angleLabel: "Launch Angle Match",
    range: "81%",
    rangeLabel: "Landing Accuracy",
  },
  {
    score: 94,
    accuracy: "94%",
    accuracyLabel: "Prediction Accuracy",
    angle: "96%",
    angleLabel: "Launch Angle Match",
    range: "92%",
    rangeLabel: "Landing Accuracy",
  },
  {
    score: 73,
    accuracy: "73%",
    accuracyLabel: "Prediction Accuracy",
    angle: "68%",
    angleLabel: "Launch Angle Match",
    range: "78%",
    rangeLabel: "Landing Accuracy",
  },
];

export function PhysicsScoreSection() {
  const reduce = useReducedMotion();

  return (
    <section className="physics-score-section">
      <div className="container">
        <SectionHeading
          eyebrow="Performance Metrics"
          title="Every throw is graded."
          description="Your predictions are scored instantly. Track your improvement across experiments."
        />

        <div className="score-grid" role="region" aria-label="Physics score cards">
          {scoreExamples.map((example, index) => (
            <motion.article
              key={index}
              className="score-card"
              initial={reduce ? false : { opacity: 0, scale: 0.95, y: 18 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.12 }}
              whileHover={reduce ? undefined : { y: -8, transition: { duration: 0.3 } }}
              aria-label={`Score ${example.score} out of 100: Accuracy ${example.accuracy}, Angle ${example.angle}, Range ${example.range}`}
            >
              <div className="score-display">
                <div className="score-circle" role="img" aria-label={`Physics score: ${example.score} out of 100`}>
                  <strong>{example.score}</strong>
                  <span>/100</span>
                </div>
                <span className="score-label">Physics Score</span>
              </div>

              <div className="score-breakdown" aria-label="Score breakdown">
                <div className="score-item">
                  <span className="score-item-label">{example.accuracyLabel}</span>
                  <div className="score-bar" role="progressbar" aria-valuenow={parseInt(example.accuracy)} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                      className="score-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${example.accuracy}` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1.2, delay: index * 0.12 + 0.3 }}
                    />
                  </div>
                  <span className="score-value">{example.accuracy}</span>
                </div>

                <div className="score-item">
                  <span className="score-item-label">{example.angleLabel}</span>
                  <div className="score-bar" role="progressbar" aria-valuenow={parseInt(example.angle)} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                      className="score-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${example.angle}` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1.2, delay: index * 0.12 + 0.4 }}
                    />
                  </div>
                  <span className="score-value">{example.angle}</span>
                </div>

                <div className="score-item">
                  <span className="score-item-label">{example.rangeLabel}</span>
                  <div className="score-bar" role="progressbar" aria-valuenow={parseInt(example.range)} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                      className="score-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${example.range}` }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1.2, delay: index * 0.12 + 0.5 }}
                    />
                  </div>
                  <span className="score-value">{example.range}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="score-cta"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.35 }}
        >
          <Button href="/app/dashboard">Check Your Scores</Button>
        </motion.div>
      </div>
    </section>
  );
}
