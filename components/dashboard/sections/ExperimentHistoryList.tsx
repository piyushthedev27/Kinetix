"use client";

import { dashboardData } from "@/lib/data";
import { useAsyncData } from "../useAsyncData";
import { ExperimentCard } from "../ExperimentCard";
import { ExperimentCardSkeleton } from "../Skeletons";
import { EmptyState } from "../EmptyState";

export function ExperimentHistoryList() {
  const { data: experiments, isLoading } = useAsyncData(
    () => dashboardData.listExperiments(),
    []
  );

  if (isLoading) return <ExperimentCardSkeleton count={4} />;

  if (!experiments || experiments.length === 0) {
    return (
      <EmptyState
        title="No experiments yet"
        body="Once you complete a throw, it'll show up here as a revisitable result."
        ctaLabel="Start Projectile Motion"
        ctaHref="/experiment/projectile-motion/setup"
      />
    );
  }

  return (
    <div>
      {experiments.map((experiment) => (
        <ExperimentCard key={experiment.id} experiment={experiment} />
      ))}
    </div>
  );
}
