"use client";

import { motion, useReducedMotion } from "motion/react";

type MotionTimelineProps = {
  progress: number;
  startLabel?: string;
  endLabel?: string;
  className?: string;
};

export function MotionTimeline({
  progress,
  startLabel = "00:00",
  endLabel = "00:00.96",
  className = "",
}: MotionTimelineProps) {
  const reduce = useReducedMotion();

  return (
    <div className={`timeline ${className}`.trim()}>
      <span>{startLabel}</span>
      <div>
        <motion.i
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut" }}
        />
      </div>
      <span>{endLabel}</span>
    </div>
  );
}

