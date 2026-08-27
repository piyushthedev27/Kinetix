"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ScenePoint } from "@/lib/physics/projectile-model";

type VelocityVectorProps = {
  point: ScenePoint;
  className: string;
  tone?: "hero" | "live";
};

export function VelocityVector({ point, className, tone = "hero" }: VelocityVectorProps) {
  const reduce = useReducedMotion();
  const offsetX = tone === "live" ? 44 : 52;
  const offsetY = tone === "live" ? 36 : 42;
  const x1 = point.x - offsetX;
  const y1 = point.y + offsetY;
  const x2 = point.x - 2;
  const y2 = point.y + 2;

  return (
    <motion.path
      className={className}
      d={`M${x1} ${y1}L${x2} ${y2}M${x2} ${y2}L${x2 - 17} ${y2 - 2}M${x2} ${y2}L${x2 - 4} ${y2 + 18}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.45 }}
    />
  );
}

