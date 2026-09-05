"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getVisits, type ExperimentVisit } from "@/lib/data/experiment-visits";
import { formatRelativeTime } from "@/lib/format";
import { EmptyState } from "../EmptyState";

export function ContinueSection() {
  const [latest, setLatest] = useState<ExperimentVisit[] | null>(null);

  useEffect(() => {
    setLatest(getVisits(1));
  }, []);

  if (latest === null) return null;

  const visit = latest[0];

  return (
    <div>
      <h2 className="kx-section-title">Continue where you left off</h2>
      {visit ? (
        <div className="kx-experiment-card">
          <div className="kx-experiment-card-main">
            <div className="kx-experiment-card-title">{visit.title}</div>
            <div className="kx-experiment-card-meta">
              {visit.grade} · Last opened {formatRelativeTime(visit.visitedAt)}
            </div>
          </div>
          <div className="kx-experiment-card-actions">
            <Link href={`/dashboard/experiments/${visit.slug}`} className="kx-btn kx-btn-primary">
              Resume
            </Link>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No experiments yet"
          body="Pick any topic from the library to start your first hands-on experiment."
          ctaLabel="Browse Experiments"
          ctaHref="/dashboard/experiments"
        />
      )}
    </div>
  );
}
