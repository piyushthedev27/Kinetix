"use client";

import { useEffect, useState } from "react";
import { PHYSICS_TOPICS } from "@/lib/data/physics-topics";
import { getVisitedTopicIds } from "@/lib/data/experiment-visits";
import { StatCard } from "../StatCard";

const TOTAL_TOPICS = PHYSICS_TOPICS.reduce((sum, g) => sum + g.topics.length, 0);
const TOTAL_GRADES = PHYSICS_TOPICS.length;

export function LibraryStats() {
  const [explored, setExplored] = useState<number | null>(null);

  useEffect(() => {
    setExplored(getVisitedTopicIds().size);
  }, []);

  return (
    <div className="kx-stat-row">
      <StatCard value={String(TOTAL_TOPICS)} label="Experiments available" />
      <StatCard value={String(TOTAL_GRADES)} label="Grade levels" />
      <StatCard value={explored === null ? "—" : String(explored)} label="Experiments explored" />
    </div>
  );
}
