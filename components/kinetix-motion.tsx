"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { primaryProjectileExperiment } from "@/lib/physics/projectile-data";
import { ProjectileScene } from "@/components/physics/ProjectileScene";
import { createMockTransport, type ConnectionState } from "@/lib/transport/experiment-transport";

type MotionProps = {
  className?: string;
};

export function PhysicsMotion({ className = "" }: MotionProps) {
  const reduce = useReducedMotion();
  const experiment = primaryProjectileExperiment;
  const frames = experiment.samples;
  const circleX = frames.map((sample) => sample.point.x);
  const circleY = frames.map((sample) => sample.point.y);

  return (
    <svg
      className={`physics-motion ${className}`.trim()}
      viewBox="0 0 720 340"
      role="img"
      aria-label="Animated projectile trajectory"
    >
      <motion.path
        d={experiment.theoryPath}
        className="physics-theory"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 2.1, ease: "easeInOut" }}
      />
      <motion.path
        d={experiment.actualPath}
        className="physics-actual"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 1.75, ease: "easeOut" }}
      />
      <motion.path
        d="M168 190L222 145M222 145L202 146M222 145L218 166"
        className="physics-vector"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.2 }}
      />
      <motion.circle
        r="9"
        className="physics-ball"
        initial={{ cx: circleX[0], cy: circleY[0], opacity: 0 }}
        animate={{
          cx: reduce ? circleX[circleX.length - 1] : circleX,
          cy: reduce ? circleY[circleY.length - 1] : circleY,
          opacity: 1,
        }}
        transition={{ duration: 3.4, ease: "easeInOut", repeat: reduce ? 0 : Infinity, repeatDelay: 0.65 }}
      />
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 1.5 }}>
        <rect x="244" y="40" width="110" height="31" rx="7" className="physics-readout" />
        <text x="257" y="60" className="physics-text">
          ANGLE 38°
        </text>
      </motion.g>
    </svg>
  );
}

export function LivePhysicsLab({ compact = false }: { compact?: boolean }) {
  const [connection, setConnection] = useState<ConnectionState>("connecting");

  useEffect(() => {
    const transport = createMockTransport();
    const unsubscribe = transport.subscribe((event) => {
      if (event.type === "frame") setConnection("streaming");
      if (event.type === "status" && typeof event.payload === "string") setConnection(event.payload as ConnectionState);
    });
    void transport.connect();
    return () => {
      unsubscribe();
      transport.disconnect();
    };
  }, []);

  return (
    <div className="live-physics-lab-shell">
      <div className={`lab-transport-state lab-transport-state--${connection}`} role="status">
        <i />
        {connection === "streaming" ? "Live data streaming" : connection === "connected" ? "Phone connected" : "Connecting to phone…"}
        <span>Development transport</span>
      </div>
      <ProjectileScene mode="live" compact={compact} data={primaryProjectileExperiment} />
    </div>
  );
}

export function DataBridge() {
  return (
    <div className="data-bridge" aria-hidden="true">
      <span className="data-bridge__line" />
      <i />
      <i />
      <i />
    </div>
  );
}
