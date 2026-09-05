import Link from "next/link";
import { MotionMeasurementSandbox } from "@/components/dashboard/sandbox/MotionMeasurementSandbox";

export default function MotionMeasurementPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 6 · Motion and Measurement of Distances</p>
        <h1 className="kx-page-title">Push it. Watch it move. Read the ruler.</h1>
        <p className="kx-page-subtitle">
          Click the object or press Start to apply a force. When it comes to rest, read the ruler to measure how far it travelled.
        </p>
      </div>

      <MotionMeasurementSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
