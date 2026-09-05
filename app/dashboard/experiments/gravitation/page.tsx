import Link from "next/link";
import { GravitationSandbox } from "@/components/dashboard/sandbox/GravitationSandbox";

export default function GravitationPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 9 · Gravitation</p>
        <h1 className="kx-page-title">Does a heavier object really fall faster?</h1>
        <p className="kx-page-subtitle">
          Predict what happens, drop a ball and a feather together, then toggle air resistance and watch the answer change.
        </p>
      </div>

      <GravitationSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
