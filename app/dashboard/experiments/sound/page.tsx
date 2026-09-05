import Link from "next/link";
import { SoundSandbox } from "@/components/dashboard/sandbox/SoundSandbox";

export default function SoundPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 8 · Sound</p>
        <h1 className="kx-page-title">Faster vibrations, higher pitch.</h1>
        <p className="kx-page-subtitle">
          Change the frequency and amplitude, watch the waveform respond, and hear the difference for yourself.
        </p>
      </div>

      <SoundSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
