import Link from "next/link";
import { MagneticEffectsSandbox } from "@/components/dashboard/sandbox/MagneticEffectsSandbox";

export default function MagneticEffectsPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 10 · Magnetic Effects of Electric Current</p>
        <h1 className="kx-page-title">A wire with current is also a magnet.</h1>
        <p className="kx-page-subtitle">
          Turn up the current, flip its direction, and predict which way a nearby compass needle will swing.
        </p>
      </div>

      <MagneticEffectsSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
