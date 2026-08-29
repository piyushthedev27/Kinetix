"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionHeading, Button } from "@/components/ui";

export function TheoryVsRealitySection() {
  const reduce = useReducedMotion();

  return (
    <section className="theory-reality-section">
      <div className="container">
        <SectionHeading
          eyebrow="Understanding Differences"
          title="Theory meets reality."
          description="See the mathematical prediction overlaid with what actually happened. Kinetix explains the difference."
        />

        <div className="theory-comparison">
          <motion.div
            className="theory-visual"
            initial={reduce ? false : { opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65 }}
          >
            <svg className="trajectory-svg" viewBox="0 0 500 300" role="img" aria-label="Theoretical vs actual trajectory">
              <defs>
                <linearGradient id="theoryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(139, 150, 163)" />
                  <stop offset="100%" stopColor="rgb(183, 227, 58)" />
                </linearGradient>
              </defs>

              {/* Grid background */}
              <line x1="20" y1="250" x2="480" y2="250" stroke="var(--line)" strokeWidth="1" />
              <line x1="20" y1="150" x2="480" y2="150" stroke="var(--line)" strokeWidth="1" opacity="0.5" />

              {/* Theory trajectory (dashed) */}
              <motion.path
                d="M 50 220 Q 180 80 350 200"
                fill="none"
                stroke="var(--quiet)"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Actual trajectory (solid) */}
              <motion.path
                d="M 50 220 Q 175 70 340 210"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.5, delay: 0.15, ease: "easeOut" }}
              />

              {/* Theory endpoint */}
              <motion.circle
                cx="350"
                cy="200"
                r="5"
                fill="none"
                stroke="var(--quiet)"
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              />

              {/* Actual endpoint */}
              <motion.circle
                cx="340"
                cy="210"
                r="6"
                fill="var(--lime)"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 1.3, duration: 0.4 }}
              />

              {/* Labels */}
              <text x="360" y="190" className="trajectory-label" textAnchor="start">
                Theory
              </text>
              <text x="360" y="225" className="trajectory-label" textAnchor="start">
                Actual
              </text>

              {/* Error annotation */}
              <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5 }}>
                <line x1="345" y1="195" x2="345" y2="215" stroke="var(--orange)" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="360" y="208" className="error-label">
                  8% error
                </text>
              </motion.g>
            </svg>

            <div className="trajectory-legend">
              <span>
                <i style={{ background: "var(--quiet)", borderRadius: "2px" }} /> Theory (45° optimal)
              </span>
              <span>
                <i style={{ background: "var(--ink)" }} /> Actual (measured)
              </span>
              <span>
                <i style={{ background: "var(--orange)" }} /> Air resistance impact
              </span>
            </div>
          </motion.div>

          <motion.div
            className="theory-explanation"
            initial={reduce ? false : { opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <div className="explanation-item">
              <span className="explanation-icon orange">①</span>
              <div>
                <h3>Air resistance</h3>
                <p>Slows the ball slightly, reducing range by 2-4%. More noticeable at higher speeds.</p>
              </div>
            </div>

            <div className="explanation-item">
              <span className="explanation-icon blue">②</span>
              <div>
                <h3>Camera angle</h3>
                <p>Our phone is calibrated, but perspective can add ±1° to angle measurements in edge cases.</p>
              </div>
            </div>

            <div className="explanation-item">
              <span className="explanation-icon green">③</span>
              <div>
                <h3>Calibration</h3>
                <p>We match real-world distance using markers. Accuracy within ±0.15 m for distances under 8 m.</p>
              </div>
            </div>

            <div className="explanation-item">
              <span className="explanation-icon lime">④</span>
              <div>
                <h3>Your throw</h3>
                <p>Release point, spin, and hand motion affect results. Consistent form improves measurement accuracy.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
