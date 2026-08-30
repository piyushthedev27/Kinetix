import { mockDashboardData } from "./mock-provider";
import type { DashboardDataProvider } from "./provider";

/**
 * THE ONE LINE TO CHANGE WHEN THE REAL BACKEND EXISTS.
 *
 * Every dashboard page/component imports `dashboardData` from here —
 * never from `./mock-provider` directly. When a real API-backed
 * provider is built (e.g. `./api-provider.ts`, implementing the same
 * `DashboardDataProvider` interface), swap the export below and
 * nothing else in the app needs to change.
 *
 *   import { apiDashboardData } from "./api-provider";
 *   export const dashboardData: DashboardDataProvider = apiDashboardData;
 */
export const dashboardData: DashboardDataProvider = mockDashboardData;

export type { DashboardDataProvider } from "./provider";
export type {
  DashboardStats,
  ExperimentSummary,
  ExperimentType,
  PredictionScore,
  UserProfile,
} from "./types";
