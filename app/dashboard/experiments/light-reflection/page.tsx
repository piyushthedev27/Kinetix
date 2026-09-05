import Link from "next/link";
import { LightReflectionSandbox } from "@/components/dashboard/sandbox/LightReflectionSandbox";

export default function LightReflectionPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 7 · Light</p>
        <h1 className="kx-page-title">Light bounces off a mirror at a matching angle.</h1>
        <p className="kx-page-subtitle">
          Set the angle the light arrives at, predict how it leaves, then reveal the reflected ray.
        </p>
      </div>

      <LightReflectionSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
