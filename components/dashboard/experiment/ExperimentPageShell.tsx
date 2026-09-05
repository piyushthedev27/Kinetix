"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Box, Boxes } from "lucide-react";
import { ExperimentChat } from "./ExperimentChat";
import { recordVisit } from "@/lib/data/experiment-visits";

interface ExperimentPageShellProps {
  /** Stable topic id from lib/data/physics-topics.ts, used for visit tracking. */
  topicId: string;
  slug: string;
  grade: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** One paragraph handed to the AI as context — not shown on the page. */
  chatSummary: string;
  suggestedQuestions: string[];
  children: ReactNode;
}

export function ExperimentPageShell({
  topicId,
  slug,
  grade,
  eyebrow,
  title,
  subtitle,
  chatSummary,
  suggestedQuestions,
  children,
}: ExperimentPageShellProps) {
  const [view, setView] = useState<"2d" | "3d">("2d");

  useEffect(() => {
    recordVisit({ id: topicId, slug, title: eyebrow, grade });
  }, [topicId, slug, eyebrow, grade]);

  return (
    <div className="app-content library">
      <div className="kx-experiment-breadcrumb">
        <Link href="/dashboard/experiments">Experiments</Link>
        <ChevronRight size={12} />
        <span className="kx-experiment-breadcrumb-current">{eyebrow}</span>
      </div>

      <div className="kx-experiment-top">
        <div className="kx-page-header" style={{ marginBottom: 0 }}>
          <p className="kx-page-eyebrow">{eyebrow}</p>
          <h1 className="kx-page-title">{title}</h1>
          <p className="kx-page-subtitle">{subtitle}</p>
        </div>

        <div className="kx-view-toggle">
          <button type="button" data-active={view === "2d"} onClick={() => setView("2d")}>
            <Box size={14} /> 2D
          </button>
          <button type="button" data-active={view === "3d"} onClick={() => setView("3d")}>
            <Boxes size={14} /> 3D
          </button>
        </div>
      </div>

      <div className="kx-experiment-layout">
        <div className="kx-experiment-main">
          {view === "2d" ? (
            children
          ) : (
            <div className="kx-sandbox" style={{ display: "grid", placeItems: "center", minHeight: 320 }}>
              <p style={{ color: "var(--muted, #56616d)", fontSize: 14 }}>3D view is coming soon — try the 2D experiment for now.</p>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
              Back to topics
            </Link>
          </div>
        </div>

        <ExperimentChat experimentTitle={eyebrow} experimentSummary={chatSummary} suggestedQuestions={suggestedQuestions} />
      </div>
    </div>
  );
}
