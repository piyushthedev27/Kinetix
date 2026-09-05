import Link from "next/link";
import { NaturalPhenomenaSandbox } from "@/components/dashboard/sandbox/NaturalPhenomenaSandbox";

export default function NaturalPhenomenaPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 8 · Some Natural Phenomena</p>
        <h1 className="kx-page-title">Sudden charge. Spreading waves.</h1>
        <p className="kx-page-subtitle">
          Build up static charge until lightning strikes, or set an earthquake&apos;s epicenter and watch the seismic waves travel outward.
        </p>
      </div>

      <NaturalPhenomenaSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
