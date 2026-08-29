"use client";

import { ArrowRight, Target } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui";
import { useState } from "react";

export function PredictionChallenge() {
  const reduce = useReducedMotion();
  const [predictions, setPredictions] = useState({ angle: 45, height: 50, range: 30 });

  return (
    <section className="prediction-section">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow">Interactive Learning</p>
            <h2>Make a prediction. See if you were right.</h2>
          </div>
          <p>Before you throw, predict the angle, height, and landing point. Then watch Kinetix score your accuracy.</p>
        </header>

        <div className="prediction-grid" role="group" aria-labelledby="predictions-heading">
          {[
            {
              number: "01",
              label: "Predict angle",
              description: "What angle will maximize range?",
              icon: Target,
              key: "angle",
              min: 0,
              max: 90,
              unit: "°",
            },
            {
              number: "02",
              label: "Predict height",
              description: "How high will the ball peak?",
              icon: Target,
              key: "height",
              min: 0,
              max: 100,
              unit: "m",
            },
            {
              number: "03",
              label: "Predict range",
              description: "Where will it land?",
              icon: Target,
              key: "range",
              min: 0,
              max: 100,
              unit: "m",
            },
          ].map(({ number, label, description, icon: Icon, key, min, max, unit }, index) => (
            <motion.article
              key={number}
              className="prediction-card"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="card-number">{number}</span>
              <div className="card-icon" aria-hidden="true">
                <Icon size={20} />
              </div>
              <h3>{label}</h3>
              <p>{description}</p>
              <div className="prediction-input-group">
                <label htmlFor={`prediction-${key}`} className="sr-only">
                  {label} input ({min}-{max}{unit})
                </label>
                <input
                  id={`prediction-${key}`}
                  type="range"
                  className="prediction-input"
                  min={min}
                  max={max}
                  value={predictions[key as keyof typeof predictions]}
                  onChange={(e) => setPredictions({ ...predictions, [key]: Number(e.target.value) })}
                  aria-label={`${label}: ${predictions[key as keyof typeof predictions]}${unit}`}
                  aria-describedby={`prediction-${key}-help`}
                />
                <span className="prediction-value" id={`prediction-${key}-help`}>
                  {predictions[key as keyof typeof predictions]}{unit}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="prediction-cta"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          <Button href="/app/experiments/projectile-motion" aria-label="Start Prediction Challenge with angle set to 45 degrees">
            Start Prediction Challenge
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
