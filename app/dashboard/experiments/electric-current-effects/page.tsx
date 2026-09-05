import Link from "next/link";
import { ElectricEffectsSandbox } from "@/components/dashboard/sandbox/ElectricEffectsSandbox";

export default function ElectricCurrentEffectsPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 7 · Electric Current and its Effects</p>
        <h1 className="kx-page-title">One current, three effects.</h1>
        <p className="kx-page-subtitle">
          Turn up the current and watch it heat a coil, deflect a compass, and light a bulb — all at once.
        </p>
      </div>

      <ElectricEffectsSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
