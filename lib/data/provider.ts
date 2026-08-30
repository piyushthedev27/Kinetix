import type {
  DashboardStats,
  ExperimentSummary,
  UserProfile,
} from "./types";

/**
 * Every dashboard data source (mock today, a real API later) must
 * satisfy this interface. Components never import a concrete provider
 * directly — they import `dashboardData` from `lib/data/index.ts`.
 *
 * This is the same pattern already used by lib/camera, lib/tracking,
 * lib/transport, lib/ai, and lib/auth — one swappable seam per concern.
 */
export interface DashboardDataProvider {
  getStats(): Promise<DashboardStats>;
  listExperiments(limit?: number): Promise<ExperimentSummary[]>;
  getExperiment(id: string): Promise<ExperimentSummary | null>;
  getProfile(): Promise<UserProfile>;
}
