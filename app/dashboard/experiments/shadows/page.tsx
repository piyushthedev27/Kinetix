import Link from "next/link";
import { ShadowsSandbox } from "@/components/dashboard/sandbox/ShadowsSandbox";

export default function ShadowsPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 6 · Light, Shadows and Reflections</p>
        <h1 className="kx-page-title">Move the light. Watch the shadow change.</h1>
        <p className="kx-page-subtitle">
          Predict what happens when the light rises, then check the shadow&apos;s length for yourself.
        </p>
      </div>

      <ShadowsSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
