"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ScenePoint } from "@/lib/physics/projectile-model";

type ProjectileProps = {
  point: ScenePoint;
  className: string;
};

export function Projectile({ point, className }: ProjectileProps) {
  const reduce = useReducedMotion();

  return (
    <motion.circle
      className={className}
      r="9"
      initial={false}
      animate={{ cx: point.x, cy: point.y, opacity: 1 }}
      transition={{ type: reduce ? "tween" : "spring", stiffness: 80, damping: 16 }}
    />
  );
}

