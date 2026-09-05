import Link from "next/link";
import { ForceAndPressureSandbox } from "@/components/dashboard/sandbox/ForceAndPressureSandbox";

export default function ForceAndPressurePage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 8 · Force and Pressure</p>
        <h1 className="kx-page-title">Same force, different area, very different result.</h1>
        <p className="kx-page-subtitle">
          Pick a shape and a force, then watch how much it sinks in — pressure is force spread over an area.
        </p>
      </div>

      <ForceAndPressureSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
