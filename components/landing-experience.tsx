"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Camera, ChartNoAxesCombined, Check, Orbit, Signal } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button, SectionHeading } from "./ui";
import { useAuth } from "@/lib/auth/AuthProvider";
import { DataBridge, LivePhysicsLab, PhysicsMotion } from "./kinetix-motion";
import {
  PredictionChallenge,
  PhysicsScoreSection,
  TheoryVsRealitySection,
  ReplaySection,
  LabReportSection,
  RoadmapSection,
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

function ScrollHeroSequence() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduce) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Set initial states so they are hidden before scrubbing
      // Trajectory path length is approx 350
      gsap.set(".hero-trajectory", { strokeDasharray: 350, strokeDashoffset: 350 });
      gsap.set([".hero-vel-line", ".hero-vel-head", ".hero-bounds"], { opacity: 0 });
      gsap.set(".hero-packet", { opacity: 0, x: -20, y: -20, scale: 0.5 });
      gsap.set(".hero-laptop", { opacity: 0, x: 60, y: 30 });
      
      const hudAngle = { val: 0 };
      const hudVel = { val: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 78px",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      // Phone base parallax
      tl.to(".hero-phone", { y: 42, duration: 1 }, 0);
      tl.fromTo(".hero-phone", { rotate: -2 }, { rotate: -4, duration: 0.5, ease: "power1.inOut" }, 0);
      tl.to(".hero-phone", { rotate: -2, duration: 0.5, ease: "power1.inOut" }, 0.5);

      // Internal visualization sequence
      // 0.1 - 0.2: Bounding box fades in
      tl.to(".hero-bounds", { opacity: 1, duration: 0.1 }, 0.1);
      
      // 0.2 - 0.5: Trajectory draws
      tl.to(".hero-trajectory", { strokeDashoffset: 0, duration: 0.3 }, 0.2);
      
      // 0.5 - 0.6: Velocity vector appears
      tl.to([".hero-vel-line", ".hero-vel-head"], { opacity: 1, duration: 0.1 }, 0.5);

      // HUD counter sync with trajectory
      tl.to(hudAngle, { 
        val: 38, 
        duration: 0.3,
        onUpdate: () => {
          const el = document.querySelector(".hero-hud-angle");
          if (el) el.textContent = `${Math.round(hudAngle.val)}°`;
        }
      }, 0.2);
      
      tl.to(hudVel, { 
        val: 5.8, 
        duration: 0.3,
        onUpdate: () => {
          const el = document.querySelector(".hero-hud-vel");
          if (el) el.textContent = `${hudVel.val.toFixed(1)} m/s`;
        }
      }, 0.2);

      // 0.6 - 0.8: Data packet flies to laptop
      tl.to(".hero-packet", { 
        opacity: 1, 
        scale: 1,
        x: 180,
        y: 60,
        duration: 0.2,
        ease: "power2.out"
      }, 0.6);
      tl.to(".hero-packet", { opacity: 0, duration: 0.1 }, 0.8);
      
      // 0.8 - 0.95: Laptop slides in and bars react
      tl.to(".hero-laptop", {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.15,
        ease: "power2.out"
      }, 0.8);
      tl.from(".hero-laptop__bars i", { 
        scaleY: 0, 
        transformOrigin: "bottom", 
        stagger: 0.05, 
        duration: 0.15,
        ease: "back.out(1.5)"
      }, 0.85);

    }, containerRef);

    return () => ctx.revert();
  }, [reduce]);

  if (reduce) {
    return (
      <div className="kinetic-hero__visual">
        <div className="hero-grid" />
        <PhysicsMotion />
      </div>
    );
  }

  // Final HTML fallback state is fully populated (e.g. 38°, 5.8 m/s, fully drawn trajectory)
  // GSAP will animate *from* a hidden state when JS executes, satisfying the HTML-first rule.
  return (
    <div ref={containerRef} className="scroll-hero" aria-hidden="true">
      <div className="scroll-hero__sticky">
        <div className="hero-phone" style={{ transform: "rotate(-2deg)" }}>
          <div className="hero-phone__frame">
            <div className="hero-phone__speaker" />
            <div className="hero-phone__screen">
              <div className="hero-phone__top">
                <span>Projectile</span>
                <span>1/1</span>
              </div>

              <div className="hero-bounds" />

              <svg viewBox="0 0 330 210" className="scroll-hero__svg" role="img" aria-label="Projectile preview">
                <line x1="25" y1="170" x2="290" y2="170" stroke="var(--line)" strokeWidth="1" />
                <path d="M 28 156 Q 112 80 208 110 T 282 155" fill="none" stroke="var(--lime)" strokeWidth="2.5" strokeLinecap="round" className="hero-trajectory" />
                <circle cx="110" cy="116" r="6" fill="var(--lime)" stroke="var(--ink)" strokeWidth="2" />
                <line x1="110" y1="116" x2="146" y2="104" stroke="var(--blue)" strokeWidth="2.5" className="hero-vel-line" />
                <polygon points="146,104 139,101 142,110" fill="var(--blue)" className="hero-vel-head" />
                <g>
                  <rect x="168" y="28" width="98" height="28" rx="7" fill="rgba(23,32,42,0.92)" />
                  <text x="179" y="48" fill="#fff" fontSize="9" fontFamily="var(--mono)" letterSpacing="0.08em">ANGLE</text>
                  <text x="226" y="48" fill="#fff" fontSize="12" fontWeight="700" fontFamily="var(--mono)">38°</text>
                </g>
              </svg>

              <div className="hero-hud">
                <span>θ</span>
                <strong className="hero-hud-angle">38°</strong>
                <span>v</span>
                <strong className="hero-hud-vel">5.8 m/s</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-packet" />

        <div className="hero-laptop">
          <div className="hero-laptop__screen">
            <span>trajectory</span>
            <div className="hero-laptop__bar" />
            <div className="hero-laptop__bars">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="hero-laptop__base" />
        </div>
      </div>
    </div>
  );
}

export function LandingExperience() {
  const reduce = useReducedMotion();
  const { isAuthenticated } = useAuth();

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
            <div className="hero-copy-sticky">
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
                <Button href={isAuthenticated ? "/dashboard" : "/auth/sign-up"}>Start experimenting</Button>
                <Button href="#story" variant="secondary">
                  See how it works
                </Button>
              </motion.div>
              <p className="hero-subnote">
                Starting with projectile motion — more experiments on the way.
              </p>
              <div className="hero-notes" aria-hidden="true">
                <span>v₀ = 5.8 m/s</span>
                <span>θ = 38°</span>
              </div>
            </div>
          </motion.div>

          <ScrollHeroSequence />
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

      <RoadmapSection />

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
