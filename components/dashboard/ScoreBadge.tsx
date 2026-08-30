import { Target } from "lucide-react";

interface ScoreBadgeProps {
  score: number; // 0-100
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const tier = score >= 80 ? "high" : score >= 60 ? "mid" : "low";
  return (
    <span className="kx-score-badge" data-tier={tier}>
      <Target size={11} aria-hidden />
      {Math.round(score)}% match
    </span>
  );
}
