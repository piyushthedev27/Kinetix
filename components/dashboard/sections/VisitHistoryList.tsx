"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getVisits, type ExperimentVisit } from "@/lib/data/experiment-visits";
import { formatRelativeTime } from "@/lib/format";
import { EmptyState } from "../EmptyState";

interface VisitHistoryListProps {
  limit?: number;
}

export function VisitHistoryList({ limit }: VisitHistoryListProps) {
  const [visits, setVisits] = useState<ExperimentVisit[] | null>(null);

  useEffect(() => {
    setVisits(getVisits(limit));
  }, [limit]);

  if (visits === null) return null;

  if (visits.length === 0) {
    return (
      <EmptyState
        title="No experiments explored yet"
        body="Open any topic in the library and it'll show up here so you can pick up where you left off."
        ctaLabel="Browse Experiments"
        ctaHref="/dashboard/experiments"
      />
    );
  }

  return (
    <div>
      {visits.map((v) => (
        <Link key={v.id} href={`/dashboard/experiments/${v.slug}`} className="kx-experiment-card" style={{ textDecoration: "none" }}>
          <div className="kx-experiment-card-main">
            <div className="kx-experiment-card-title">{v.title}</div>
            <div className="kx-experiment-card-meta">
              {v.grade} · {formatRelativeTime(v.visitedAt)}
            </div>
          </div>
          <div className="kx-experiment-card-actions">
            <span className="kx-btn kx-btn-secondary">Resume</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
