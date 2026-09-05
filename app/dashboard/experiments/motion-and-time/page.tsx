import Link from "next/link";
import { MotionAndTimeSandbox } from "@/components/dashboard/sandbox/MotionAndTimeSandbox";

export default function MotionAndTimePage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 7 · Motion and Time</p>
        <h1 className="kx-page-title">Same finish line, two different speeds.</h1>
        <p className="kx-page-subtitle">
          Set a speed for each racer, predict the winner, then watch the clock decide who covers the distance faster.
        </p>
      </div>

      <MotionAndTimeSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
