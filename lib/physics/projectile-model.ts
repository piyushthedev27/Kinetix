export type ScenePoint = {
  x: number;
  y: number;
};

export type ProjectileStatus =
  | "setup"
  | "tracking"
  | "processing"
  | "replay"
  | "compare"
  | "explain";

export type ProjectileSample = {
  id: string;
  time: number;
  progress: number;
  angle: number;
  speed: number;
  height: number;
  range: number;
  point: ScenePoint;
};

export type ProjectileExperiment = {
  id: string;
  type: "projectile-motion";
  title: string;
  createdAt: string;
  dateLabel: string;
  status: ProjectileStatus;
  angle: number;
  targetAngle: number;
  velocity: number;
  launchHeight: number;
  flightTime: number;
  maxHeight: number;
  range: number;
  actualTrajectory: ScenePoint[];
  theoryTrajectory: ScenePoint[];
  actualPath: string;
  theoryPath: string;
  samples: ProjectileSample[];
  metrics: { label: string; value: string }[];
  summary: string;
};

export const SCENE = {
  width: 720,
  height: 320,
  baseX: 35,
  baseY: 277,
  topY: 36,
  rightX: 670,
} as const;

