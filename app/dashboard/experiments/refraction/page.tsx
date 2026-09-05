import Link from "next/link";
import { RefractionSandbox } from "@/components/dashboard/sandbox/RefractionSandbox";

export default function RefractionPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 10 · Light — Reflection and Refraction</p>
        <h1 className="kx-page-title">Light bends when it changes speed.</h1>
        <p className="kx-page-subtitle">
          Set the angle and the medium, predict which way it bends, then reveal the refracted ray.
        </p>
      </div>

      <RefractionSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
