"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Target, Waves, Zap } from "lucide-react";
import { SectionHeading } from "@/components/ui";

const roadmapCards = [
  {
    icon: Target,
    title: "Projectile Motion",
    description:
      "Throw an object, get launch angle, velocity, max height, range, and flight time — live.",
    status: "LIVE",
    isLive: true,
  },
  {
    icon: ArrowDown,
    title: "Free Fall",
    description:
      "Drop an object and measure acceleration due to gravity in real time.",
    status: "COMING SOON",
    isLive: false,
  },
  {
    icon: Waves,
    title: "Pendulum Motion",
    description:
      "Swing a pendulum and observe period, amplitude, and energy transfer.",
    status: "COMING SOON",
    isLive: false,
  },
  {
    icon: Zap,
    title: "Collisions",
    description:
      "Two objects, one impact — momentum and energy conservation made visible.",
    status: "COMING SOON",
    isLive: false,
  },
];

export function RoadmapSection() {
  const reduce = useReducedMotion();

  return (
    <section className="roadmap-section" id="experiments">
      <div className="container">
        <SectionHeading
          eyebrow="THE ROADMAP"
          title="One physics engine. Every experiment you can throw, drop, or swing."
          description="Projectile motion is live today. The same detect-track-calculate pipeline is built to extend to more of the physics students actually study."
        />

        <div className="roadmap-grid">
          {roadmapCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                className={`roadmap-card ${card.isLive ? "roadmap-card--live" : ""}`}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={reduce ? undefined : { y: -6 }}
              >
                <div className="roadmap-card__top">
                  <div className="roadmap-card__icon">
                    <Icon size={20} />
                  </div>
                  <span
                    className={`roadmap-status-tag ${
                      card.isLive
                        ? "roadmap-status-tag--live"
                        : "roadmap-status-tag--soon"
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
