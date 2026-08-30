"use client";

import { dashboardData } from "@/lib/data";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAsyncData } from "../useAsyncData";
import { StatCard } from "../StatCard";
import { CardSkeleton, StatRowSkeleton } from "../Skeletons";

export function ProfileSummary() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: stats, isLoading: statsLoading } = useAsyncData(
    () => dashboardData.getStats(),
    []
  );
  const { data: experiments } = useAsyncData(() => dashboardData.listExperiments(1), []);

  const best = experiments?.[0];
  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Learner");
  const email = user?.email || "";

  return (
    <div>
      {authLoading ? (
        <CardSkeleton height={140} />
      ) : (
        <div className="kx-card" style={{ marginBottom: 24 }}>
          <h2 className="kx-page-title" style={{ marginBottom: 4 }}>
            {displayName}&rsquo;s Physics Lab
          </h2>
          <p className="kx-page-subtitle">{email}</p>
        </div>
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
