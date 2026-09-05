import Link from "next/link";
import { ElectricityAndCircuitsSandbox } from "@/components/dashboard/sandbox/ElectricityAndCircuitsSandbox";

export default function ElectricityAndCircuitsPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 6 · Electricity and Circuits</p>
        <h1 className="kx-page-title">A bulb only lights up in a complete loop.</h1>
        <p className="kx-page-subtitle">
          Open the switch, break the wire, add more cells — predict what happens to the bulb before you check.
        </p>
      </div>

      <ElectricityAndCircuitsSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
