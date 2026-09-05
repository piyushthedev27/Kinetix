import Link from "next/link";
import { HeatSandbox } from "@/components/dashboard/sandbox/HeatSandbox";

export default function HeatPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 7 · Heat</p>
        <h1 className="kx-page-title">Heat is particles moving faster.</h1>
        <p className="kx-page-subtitle">
          Turn up the temperature and watch a tidy solid shake loose into a liquid, then a gas.
        </p>
      </div>

      <HeatSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
