import Link from "next/link";
import { ElectricityQuantitativeSandbox } from "@/components/dashboard/sandbox/ElectricityQuantitativeSandbox";

export default function ElectricityPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 10 · Electricity</p>
        <h1 className="kx-page-title">Voltage pushes, resistance resists.</h1>
        <p className="kx-page-subtitle">
          Set a voltage and a resistance, predict the current, then check it against Ohm&apos;s Law.
        </p>
      </div>

      <ElectricityQuantitativeSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
