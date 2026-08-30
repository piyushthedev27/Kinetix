"use client";

import { dashboardData } from "@/lib/data";
import { useAsyncData } from "../useAsyncData";
import { StatCard } from "../StatCard";
import { CardSkeleton, StatRowSkeleton } from "../Skeletons";

export function ProfileSummary() {
  const { data: profile, isLoading: profileLoading } = useAsyncData(
    () => dashboardData.getProfile(),
    []
  );
  const { data: stats, isLoading: statsLoading } = useAsyncData(
    () => dashboardData.getStats(),
    []
  );
  const { data: experiments } = useAsyncData(() => dashboardData.listExperiments(1), []);

  const best = experiments?.[0];

  return (
    <div>
      {profileLoading ? (
        <CardSkeleton height={140} />
      ) : (
        profile && (
          <div className="kx-card" style={{ marginBottom: 24 }}>
            <h2 className="kx-page-title" style={{ marginBottom: 4 }}>
              {profile.displayName}&rsquo;s Physics Lab
            </h2>
            <p className="kx-page-subtitle">{profile.email}</p>
          </div>
        )
      )}

      {statsLoading ? (
        <StatRowSkeleton count={3} />
      ) : (
        stats && (
          <div className="kx-stat-row">
            <StatCard value={String(stats.experimentsCompleted)} label="Experiments completed" />
            <StatCard value={`${stats.bestRange.toFixed(1)} m`} label="Best range" />
            <StatCard value={`${stats.closestLaunchAngle}°`} label="Closest launch angle" />
          </div>
        )
      )}

      {best && (
        <p className="kx-page-subtitle" style={{ marginTop: 8 }}>
          Most recent: {best.launchAngle}° · {best.initialVelocity.toFixed(1)} m/s ·{" "}
          {best.range.toFixed(1)} m range
        </p>
      )}
    </div>
  );
}
