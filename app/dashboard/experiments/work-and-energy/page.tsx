import Link from "next/link";
import { WorkAndEnergySandbox } from "@/components/dashboard/sandbox/WorkAndEnergySandbox";

export default function WorkAndEnergyPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 9 · Work and Energy</p>
        <h1 className="kx-page-title">Energy doesn&apos;t disappear — it changes form.</h1>
        <p className="kx-page-subtitle">
          Release a ball into a valley and watch potential energy trade places with kinetic energy, swing after swing.
        </p>
      </div>

      <WorkAndEnergySandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
