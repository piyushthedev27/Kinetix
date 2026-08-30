import Link from "next/link";
import type { ExperimentSummary } from "@/lib/data";
import { ScoreBadge } from "./ScoreBadge";

interface ExperimentCardProps {
  experiment: ExperimentSummary;
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  return (
    <div className="kx-experiment-card">
      <div className="kx-experiment-card-main">
        <div className="kx-experiment-card-title">
          {experiment.label}
          {experiment.predictionScore && (
            <ScoreBadge score={experiment.predictionScore.overall} />
          )}
        </div>
        <div className="kx-experiment-card-meta">
          {formatRelativeTime(experiment.completedAt)}
        </div>
        <div className="kx-experiment-card-stats">
          <span>{experiment.launchAngle}°</span>
          <span>{experiment.initialVelocity.toFixed(1)} m/s</span>
          <span>{experiment.range.toFixed(1)} m</span>
        </div>
      </div>
      <div className="kx-experiment-card-actions">
        <Link href={`/dashboard/history/${experiment.id}`} className="kx-btn kx-btn-secondary">
          View result
        </Link>
      </div>
    </div>
  );
}
