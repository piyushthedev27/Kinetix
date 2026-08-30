"use client";

import { dashboardData } from "@/lib/data";
import { useAsyncData } from "../useAsyncData";
import { ExperimentCard } from "../ExperimentCard";
import { ExperimentCardSkeleton } from "../Skeletons";
import { EmptyState } from "../EmptyState";

export function RecentExperimentSection() {
  const { data: experiments, isLoading } = useAsyncData(
    () => dashboardData.listExperiments(1),
    []
  );

  return (
    <div>
      <h2 className="kx-section-title">Continue where you left off</h2>
      {isLoading && <ExperimentCardSkeleton count={1} />}
      {!isLoading && experiments && experiments.length > 0 && (
        <ExperimentCard experiment={experiments[0]} />
      )}
      {!isLoading && experiments && experiments.length === 0 && (
        <EmptyState
          title="No experiments yet"
          body="Run your first projectile motion experiment to see your throw turn into physics."
          ctaLabel="Start Projectile Motion"
          ctaHref="/experiment/projectile-motion/setup"
        />
      )}
    </div>
  );
}
