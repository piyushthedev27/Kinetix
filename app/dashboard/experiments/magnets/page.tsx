import Link from "next/link";
import { MagnetsSandbox } from "@/components/dashboard/sandbox/MagnetsSandbox";

export default function MagnetsPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 6 · Fun with Magnets</p>
        <h1 className="kx-page-title">Some poles pull. Some poles push.</h1>
        <p className="kx-page-subtitle">
          Choose which poles face each other, predict what happens, then release the magnet and watch.
        </p>
      </div>

      <MagnetsSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
