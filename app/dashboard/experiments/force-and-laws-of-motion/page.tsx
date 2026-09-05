import Link from "next/link";
import { ForceAndLawsSandbox } from "@/components/dashboard/sandbox/ForceAndLawsSandbox";

export default function ForceAndLawsPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 9 · Force and Laws of Motion</p>
        <h1 className="kx-page-title">Heavier things resist speeding up.</h1>
        <p className="kx-page-subtitle">
          Set a mass and a force, predict the top speed, then check whether acceleration really is force divided by mass.
        </p>
      </div>

      <ForceAndLawsSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
