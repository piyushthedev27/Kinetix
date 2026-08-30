/**
 * Kinetix dashboard data types.
 *
 * These are the ONLY shapes dashboard UI components should know about.
 * When the real backend is ready, nothing in components/ or app/dashboard/
 * needs to change — only lib/data/index.ts (which provider is active)
 * and, if needed, a new provider implementation that returns these
 * exact same shapes.
 */

export type ExperimentType =
  | "projectile-motion"
  | "free-fall"
  | "pendulum"
  | "collision";

export interface PredictionScore {
  overall: number; // 0-100
  angleAccuracy: number; // 0-100
  heightAccuracy: number; // 0-100
  rangeAccuracy: number; // 0-100
}

export interface ExperimentSummary {
  id: string;
  experimentType: ExperimentType;
  label: string; // "Projectile Motion"
  completedAt: string; // ISO timestamp
  launchAngle: number; // degrees
  initialVelocity: number; // m/s
  maxHeight: number; // metres
  range: number; // metres
  flightTime: number; // seconds
  /** Only present if the learner made a prediction before throwing. */
  predictionScore?: PredictionScore;
}

export interface DashboardStats {
  experimentsCompleted: number;
  bestRange: number;
  closestLaunchAngle: number;
}

export interface UserProfile {
  displayName: string;
  email: string;
  role: "Learner" | "Teacher";
  joinedAt: string; // ISO timestamp
}
