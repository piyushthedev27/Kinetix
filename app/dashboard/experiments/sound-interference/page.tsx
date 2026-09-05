import Link from "next/link";
import { SoundInterferenceSandbox } from "@/components/dashboard/sandbox/SoundInterferenceSandbox";

export default function SoundInterferencePage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 9 · Sound</p>
        <h1 className="kx-page-title">Two sounds can add up — or cancel out.</h1>
        <p className="kx-page-subtitle">
          Shift the phase between two identical sound sources and predict whether the result gets louder or quieter.
        </p>
      </div>

      <SoundInterferenceSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
