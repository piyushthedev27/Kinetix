"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { SectionHeading } from "@/components/ui";

export function TheoryVsRealitySection() {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(svgRef, { once: true, amount: 0.4 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reduce) {
    return (
      <section className="theory-reality-section">
        <div className="container">
          <SectionHeading
            eyebrow="Understanding Differences"
            title="Theory meets reality."
            description="See the mathematical prediction overlaid with what actually happened. Kinetix explains the difference."
          />

          <div className="theory-comparison">
            <motion.div className="theory-visual" initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }}>
              <svg className="trajectory-svg" viewBox="0 0 500 300" role="img" aria-label="Theoretical vs actual trajectory">
                <line x1="20" y1="250" x2="480" y2="250" stroke="var(--line)" strokeWidth="1" />
                <line x1="20" y1="150" x2="480" y2="150" stroke="var(--line)" strokeWidth="1" opacity="0.5" />
                <path d="M 50 220 Q 180 80 350 200" fill="none" stroke="var(--quiet)" strokeWidth="2.5" strokeDasharray="8 6" />
                <path d="M 50 220 Q 175 70 340 210" fill="none" stroke="var(--ink)" strokeWidth="3" />
                <circle cx="350" cy="200" r="5" fill="none" stroke="var(--quiet)" strokeWidth="2" />
                <circle cx="340" cy="210" r="6" fill="var(--lime)" />
                <text x="360" y="190" className="trajectory-label" textAnchor="start">Theory</text>
                <text x="360" y="225" className="trajectory-label" textAnchor="start">Actual</text>
                <line x1="345" y1="195" x2="345" y2="215" stroke="var(--orange)" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="360" y="208" className="error-label">8% error</text>
              </svg>
            </motion.div>

            <div className="theory-explanation">
              <div className="explanation-item"><span className="explanation-icon orange">①</span><div><h3>Air resistance</h3><p>Slows the ball slightly, reducing range by 2-4%. More noticeable at higher speeds.</p></div></div>
              <div className="explanation-item"><span className="explanation-icon blue">②</span><div><h3>Camera angle</h3><p>Our phone is calibrated, but perspective can add ±1° to angle measurements in edge cases.</p></div></div>
              <div className="explanation-item"><span className="explanation-icon green">③</span><div><h3>Calibration</h3><p>We match real-world distance using markers. Accuracy within ±0.15 m for distances under 8 m.</p></div></div>
              <div className="explanation-item"><span className="explanation-icon lime">④</span><div><h3>Your throw</h3><p>Release point, spin, and hand motion affect results. Consistent form improves measurement accuracy.</p></div></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const pathLengthTarget = mounted ? (isInView ? 1 : 0) : 1;
  const errorOpacityTarget = mounted ? (isInView ? 0.08 : 0) : 0.08;

  return (
    <section className="theory-reality-section">
      <div className="container">
        <SectionHeading
          eyebrow="Understanding Differences"
          title="Theory meets reality."
          description="See the mathematical prediction overlaid with what actually happened. Kinetix explains the difference."
        />

        <div className="theory-comparison">
          <motion.div className="theory-visual" initial={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <svg ref={svgRef} className="trajectory-svg" viewBox="0 0 500 300" role="img" aria-label="Theoretical vs actual trajectory">
              <line x1="20" y1="250" x2="480" y2="250" stroke="var(--line)" strokeWidth="1" />
              <line x1="20" y1="150" x2="480" y2="150" stroke="var(--line)" strokeWidth="1" opacity="0.5" />

              {/* Theory: blue dashed */}
              <motion.path 
                d="M 50 220 Q 180 80 350 200" 
                className="scroll-drawn-path scroll-drawn-path--theory" 
                initial={false}
                animate={{ pathLength: pathLengthTarget }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              {/* Reality: orange solid */}
              <motion.path 
                d="M 50 220 Q 175 70 340 210" 
                className="scroll-drawn-path scroll-drawn-path--reality" 
                strokeWidth={3} 
                initial={false}
                animate={{ pathLength: pathLengthTarget }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
              />
              {/* Error gap region */}
              <motion.path
                d="M 50 220 Q 180 80 350 200 Q 345 205 340 210 Q 175 70 50 220"
                fill="var(--orange)"
                className="theory-error-fill"
                initial={false}
                animate={{ opacity: errorOpacityTarget }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />

              <circle cx="350" cy="200" r="5" fill="none" stroke="var(--blue)" strokeWidth="2" />
              <circle cx="340" cy="210" r="6" fill="var(--lime)" />

              {/* Labels match their respective curve colors */}
              <text x="360" y="190" className="trajectory-label" textAnchor="start" fill="var(--blue)">Theory</text>
              <text x="360" y="225" className="trajectory-label" textAnchor="start" fill="var(--orange)">Actual</text>

              <g>
                <line x1="345" y1="195" x2="345" y2="215" stroke="var(--orange)" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="360" y="208" className="error-label">8% error</text>
              </g>
            </svg>

            <div className="trajectory-legend">
              <span>
                <svg width="24" height="10" viewBox="0 0 24 10" style={{ display: "inline-block", verticalAlign: "middle" }} aria-hidden="true">
                  <line x1="0" y1="5" x2="24" y2="5" stroke="var(--blue)" strokeWidth="2" strokeDasharray="4 3" />
                </svg>
                {" "}Theory (45° optimal)
              </span>
              <span><i style={{ background: "var(--orange)" }} />{" "}Actual (measured)</span>
              <span><i style={{ background: "var(--orange)", opacity: 0.4 }} />{" "}Air resistance impact</span>
            </div>
          </motion.div>

          <motion.div className="theory-explanation" initial={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
            <div className="explanation-item"><span className="explanation-icon orange">①</span><div><h3>Air resistance</h3><p>Slows the ball slightly, reducing range by 2-4%. More noticeable at higher speeds.</p></div></div>
            <div className="explanation-item"><span className="explanation-icon blue">②</span><div><h3>Camera angle</h3><p>Our phone is calibrated, but perspective can add ±1° to angle measurements in edge cases.</p></div></div>
            <div className="explanation-item"><span className="explanation-icon green">③</span><div><h3>Calibration</h3><p>We match real-world distance using markers. Accuracy within ±0.15 m for distances under 8 m.</p></div></div>
            <div className="explanation-item"><span className="explanation-icon lime">④</span><div><h3>Your throw</h3><p>Release point, spin, and hand motion affect results. Consistent form improves measurement accuracy.</p></div></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
