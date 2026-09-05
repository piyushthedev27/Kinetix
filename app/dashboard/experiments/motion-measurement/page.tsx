"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Box, Boxes } from "lucide-react";
import { MotionMeasurementSandbox } from "@/components/dashboard/sandbox/MotionMeasurementSandbox";
import { ExperimentChat } from "@/components/dashboard/experiment/ExperimentChat";

const EXPERIMENT_TITLE = "Motion and Measurement of Distances";
const EXPERIMENT_SUMMARY =
  "The student pushes an object with an adjustable force on a frictionless-looking track that actually has air friction. The object decelerates and stops; the student predicts the stopping point beforehand, then reads it off a ruler. The lesson is that a changing position over time is Motion, and reading the ruler from start to end is Measurement of Distance.";
const SUGGESTED_QUESTIONS = [
  "How does this experiment work?",
  "Why does it stop? Shouldn't it keep moving?",
  "What is friction?",
  "How is distance calculated?",
];

export default function MotionMeasurementPage() {
  const [view, setView] = useState<"2d" | "3d">("2d");

  return (
    <div className="app-content library">
      <div className="kx-experiment-breadcrumb">
        <Link href="/dashboard/experiments">Experiments</Link>
        <ChevronRight size={12} />
        <span className="kx-experiment-breadcrumb-current">{EXPERIMENT_TITLE}</span>
      </div>

      <div className="kx-experiment-top">
        <div className="kx-page-header" style={{ marginBottom: 0 }}>
          <p className="kx-page-eyebrow">{EXPERIMENT_TITLE}</p>
          <h1 className="kx-page-title">Push it. Watch it move. Read the ruler.</h1>
          <p className="kx-page-subtitle">
            Click the object or press Start to apply a force. When it comes to rest, read the ruler to measure how far it travelled.
          </p>
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
            <MotionMeasurementSandbox />
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

        <ExperimentChat
          experimentTitle={EXPERIMENT_TITLE}
          experimentSummary={EXPERIMENT_SUMMARY}
          suggestedQuestions={SUGGESTED_QUESTIONS}
        />
      </div>
    </div>
  );
}
