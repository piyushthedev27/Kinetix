"use client";

import { dashboardData } from "@/lib/data";
import { useAsyncData } from "../useAsyncData";
import { StatCard } from "../StatCard";
import { StatRowSkeleton } from "../Skeletons";

export function StatsSection() {
  const { data: stats, isLoading, error } = useAsyncData(
    () => dashboardData.getStats(),
    []
  );

  if (isLoading) return <StatRowSkeleton count={3} />;
  if (error || !stats) return null; // stat row failing silently is fine — not critical path

  return (
    <div className="kx-stat-row">
      <StatCard value={String(stats.experimentsCompleted)} label="Experiments completed" />
      <StatCard value={`${stats.bestRange.toFixed(1)} m`} label="Best range" />
      <StatCard value={`${stats.closestLaunchAngle}°`} label="Closest launch angle" />
    </div>
  );
}
