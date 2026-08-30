import type { DashboardStats, ExperimentSummary, UserProfile } from "./types";
import type { DashboardDataProvider } from "./provider";

/**
 * DEVELOPMENT DATA — labeled the same way lib/camera, lib/tracking,
 * lib/transport, and lib/ai label their dev adapters. This is not
 * production data and does not claim to be.
 *
 * IMPORTANT: getStats() is DERIVED from the same array listExperiments()
 * returns — never a second hardcoded number. This is the fix for the
 * "stat count doesn't match the visible list" class of bug: it is now
 * structurally impossible for the two to disagree.
 */

const MOCK_EXPERIMENTS: ExperimentSummary[] = [
  {
    id: "exp-005",
    experimentType: "projectile-motion",
    label: "Projectile Motion",
    completedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42 min ago
    launchAngle: 43,
    initialVelocity: 6.0,
    maxHeight: 1.3,
    range: 5.8,
    flightTime: 0.91,
    predictionScore: {
      overall: 87,
      angleAccuracy: 92,
      heightAccuracy: 81,
      rangeAccuracy: 88,
    },
  },
  {
    id: "exp-004",
    experimentType: "projectile-motion",
    label: "Projectile Motion",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // yesterday
    launchAngle: 38,
    initialVelocity: 5.8,
    maxHeight: 1.1,
    range: 5.1,
    flightTime: 0.83,
    predictionScore: {
      overall: 74,
      angleAccuracy: 78,
      heightAccuracy: 69,
      rangeAccuracy: 75,
    },
  },
  {
    id: "exp-003",
    experimentType: "projectile-motion",
    label: "Projectile Motion",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(),
    launchAngle: 45,
    initialVelocity: 5.4,
    maxHeight: 1.02,
    range: 4.9,
    flightTime: 0.79,
    // no prediction made this attempt — tests the optional-field UI path
  },
  {
    id: "exp-002",
    experimentType: "projectile-motion",
    label: "Projectile Motion",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 68).toISOString(),
    launchAngle: 33,
    initialVelocity: 5.1,
    maxHeight: 0.74,
    range: 4.2,
    flightTime: 0.65,
    predictionScore: {
      overall: 61,
      angleAccuracy: 58,
      heightAccuracy: 64,
      rangeAccuracy: 61,
    },
  },
  {
    id: "exp-001",
    experimentType: "projectile-motion",
    label: "Projectile Motion",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    launchAngle: 41,
    initialVelocity: 5.6,
    maxHeight: 1.08,
    range: 5.0,
    flightTime: 0.8,
  },
];

const MOCK_PROFILE: UserProfile = {
  displayName: "Piyush",
  email: "piyush270205@gmail.com",
  role: "Learner",
  joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
};

/** Simulates real network latency so loading states are actually exercised. */
function delay<T>(value: T, ms = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function computeStats(experiments: ExperimentSummary[]): DashboardStats {
  if (experiments.length === 0) {
    return { experimentsCompleted: 0, bestRange: 0, closestLaunchAngle: 0 };
  }
  const bestRange = Math.max(...experiments.map((e) => e.range));
  const closestLaunchAngle = experiments.reduce((closest, e) => {
    const currentDiff = Math.abs(e.launchAngle - 45);
    const closestDiff = Math.abs(closest - 45);
    return currentDiff < closestDiff ? e.launchAngle : closest;
  }, experiments[0].launchAngle);

  return {
    experimentsCompleted: experiments.length,
    bestRange,
    closestLaunchAngle,
  };
}

export const mockDashboardData: DashboardDataProvider = {
  async getStats() {
    return delay(computeStats(MOCK_EXPERIMENTS));
  },

  async listExperiments(limit) {
    const sorted = [...MOCK_EXPERIMENTS].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    return delay(typeof limit === "number" ? sorted.slice(0, limit) : sorted);
  },

  async getExperiment(id) {
    const found = MOCK_EXPERIMENTS.find((e) => e.id === id) ?? null;
    return delay(found);
  },

  async getProfile() {
    return delay(MOCK_PROFILE);
  },
};
