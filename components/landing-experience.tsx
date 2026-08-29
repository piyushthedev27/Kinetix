"use client";

import { ArrowDown, Camera, ChartNoAxesCombined, Check, Orbit, Signal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button, SectionHeading } from "./ui";
import { DataBridge, LivePhysicsLab, PhysicsMotion } from "./kinetix-motion";
import {
  PredictionChallenge,
  PhysicsScoreSection,
  TheoryVsRealitySection,
  ReplaySection,
  LabReportSection,
} from "./features";

const learningSteps = [
  {
    number: "01",
    title: "Do it",
    copy: "Place the phone, throw the ball, and let a real motion become the input.",
    icon: Camera,
  },
  {
    number: "02",
    title: "Track it",
    copy: "Kinetix turns the motion into a path, angle, range, and flight time.",
    icon: Signal,
  },
  {
    number: "03",
    title: "Understand it",
    copy: "Compare the measured arc with theory, then try again with intent.",
    icon: ChartNoAxesCombined,
  },
] as const;

const proofCards = [
  {
    title: "Your movement",
    copy: "The experiment starts with a real action, not a slider.",
  },
  {
    title: "Your data",
    copy: "Measured motion becomes trajectory, velocity, height, and range.",
  },
  {
    title: "Your explanation",
    copy: "See why theory and reality differed, then improve the next throw.",
  },
] as const;

export function LandingExperience() {
  const reduce = useReducedMotion();

  return (
    <main id="content">
      <section className="kinetic-hero">
        <div className="container kinetic-hero__grid">
          <motion.div
            className="kinetic-hero__copy"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <p className="eyebrow hero-eyebrow">
              Physics, in real life <Orbit size={14} />
            </p>
            <h1>
              Don&apos;t just solve the equation. <em>Perform it.</em>
            </h1>
            <motion.p
              className="summary"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              Throw a ball. Kinetix tracks the motion, turns it into physics, and shows you why the result happened.
            </motion.p>
            <motion.div
              className="actions"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Button href="/auth/sign-up">Start experimenting</Button>
              <Button href="#story" variant="secondary">
                See how it works
              </Button>
            </motion.div>
            <div className="hero-notes" aria-hidden="true">
              <span>v₀ = 5.8 m/s</span>
              <span>θ = 38°</span>
            </div>
          </motion.div>

          <motion.div
            className="kinetic-hero__visual"
            initial={reduce ? false : { opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
          >
            <div className="hero-grid" />
            <PhysicsMotion />
          </motion.div>
        </div>
        <a className="scroll-hint" href="#story">
          <span>Scroll to observe</span>
          <ArrowDown size={16} />
        </a>
      </section>

      <section id="story" className="story-section">
        <div className="container">
          <SectionHeading
            eyebrow="The learning loop"
            title="One throw becomes a complete physics story."
            description="Kinetix moves from observation to explanation without asking students to imagine the motion."
          />

          <div className="story-rail">
            {learningSteps.map(({ number, title, copy, icon: Icon }, index) => (
              <motion.article
                className="story-step"
                key={number}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="story-step__number">{number}</span>
                <div className="story-step__icon">
                  <Icon size={21} />
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="story-step__connector">{index < learningSteps.length - 1 ? "→" : null}</span>
              </motion.article>
            ))}
          </div>

          <div className="story-equation">
            <span>REAL MOTION</span>
            <b>→</b>
            <span>POSITION DATA</span>
            <b>→</b>
            <span>PHYSICS YOU CAN SEE</span>
          </div>
        </div>
      </section>

      <section className="bridge-section">
        <div className="container">
          <SectionHeading
            eyebrow="The Kinetix moment"
            title="Your phone observes. Your Lab explains."
            description="The phone stays with the experiment. The laptop turns that motion into a shared, visual learning surface."
          />

          <div className="bridge-layout">
            <motion.div
              className="premium-phone"
              initial={reduce ? false : { opacity: 0, x: -24, rotate: -4 }}
              whileInView={{ opacity: 1, x: 0, rotate: -2 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <div className="premium-phone__speaker" />
              <div className="premium-phone__screen">
                <div className="phone-screen__top">
                  <span>← Projectile</span>
                  <span>1 / 1</span>
                </div>
                <span className="phone-screen__tracking">
                  <i />
                  Tracking
                </span>
                <div className="phone-screen__ground" />
                <PhysicsMotion className="phone-physics" />
                <div className="phone-screen__hud">
                  <div>
                    <span>ANGLE</span>
                    <b>38°</b>
                  </div>
                  <div>
                    <span>SPEED</span>
                    <b>5.8</b>
                  </div>
                  <div>
                    <span>TIME</span>
                    <b>0.62</b>
                  </div>
                </div>
                <span className="phone-screen__record">
                  <i />
                  Recording
                </span>
              </div>
            </motion.div>

            <DataBridge />

            <motion.div
              initial={reduce ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <LivePhysicsLab compact />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="insight-section">
        <div className="container">
          <SectionHeading eyebrow="Why it works" title="Physics is easier when it moves." />

          <div className="insight-grid">
            {proofCards.map((card, index) => (
              <motion.article key={card.title} whileHover={reduce ? undefined : { y: -7 }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <i>
                  <Check size={15} />
                </i>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <PredictionChallenge />

      <PhysicsScoreSection />

      <TheoryVsRealitySection />

      <ReplaySection />

      <LabReportSection />

      <section className="final-field">
        <div className="container">
          <p className="eyebrow">Ready to experiment?</p>
          <h2>
            Your phone. Your throw.
            <br />
            <em>Your physics.</em>
          </h2>
          <p>Start with Projectile Motion and make the real world match the equation.</p>
          <Button href="/auth/sign-up">Start your first experiment</Button>
        </div>
      </section>
    </main>
  );
}
