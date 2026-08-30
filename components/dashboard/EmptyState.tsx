import Link from "next/link";
import { FlaskConical } from "lucide-react";

interface EmptyStateProps {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ title, body, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="kx-empty-state">
      <FlaskConical size={28} color="var(--muted, #56616d)" aria-hidden />
      <div className="kx-empty-state-title">{title}</div>
      <p className="kx-empty-state-body">{body}</p>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="kx-btn kx-btn-primary">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
