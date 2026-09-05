import Link from "next/link";
import { ElectrolysisSandbox } from "@/components/dashboard/sandbox/ElectrolysisSandbox";

export default function ElectrolysisPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 8 · Chemical Effects of Electric Current</p>
        <h1 className="kx-page-title">Current can trigger a chemical reaction.</h1>
        <p className="kx-page-subtitle">
          Turn up the voltage and watch bubbles form faster at each electrode.
        </p>
      </div>

      <ElectrolysisSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
