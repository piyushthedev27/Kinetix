import Link from "next/link";
import { SourcesOfEnergySandbox } from "@/components/dashboard/sandbox/SourcesOfEnergySandbox";

export default function SourcesOfEnergyPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 10 · Sources of Energy</p>
        <h1 className="kx-page-title">Renewable or not?</h1>
        <p className="kx-page-subtitle">
          Sort each energy source, then check which ones nature replenishes — and which ones we&apos;re using up.
        </p>
      </div>

      <SourcesOfEnergySandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
