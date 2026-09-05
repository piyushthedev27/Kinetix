import Link from "next/link";
import { MotionGraphSandbox } from "@/components/dashboard/sandbox/MotionGraphSandbox";

export default function MotionGraphsPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 9 · Motion</p>
        <h1 className="kx-page-title">The graph is the story of the motion.</h1>
        <p className="kx-page-subtitle">
          Launch the object and watch its distance–time and speed–time graphs draw themselves in real time.
        </p>
      </div>

      <MotionGraphSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
