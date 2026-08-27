"use client";

import { motion, useReducedMotion } from "motion/react";

type TrajectoryProps = {
  d: string;
  className: string;
  progress?: number;
  show?: boolean;
};

export function Trajectory({ d, className, progress = 1, show = true }: TrajectoryProps) {
  const reduce = useReducedMotion();

  return (
    <motion.path
      className={className}
      d={d}
      initial={show ? { pathLength: 0 } : false}
      animate={show ? { pathLength: progress } : { pathLength: 1 }}
      transition={{ duration: reduce ? 0 : 0.95, ease: "easeOut" }}
    />
  );
}

