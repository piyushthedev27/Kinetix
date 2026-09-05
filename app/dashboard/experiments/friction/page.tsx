import Link from "next/link";
import { FrictionSandbox } from "@/components/dashboard/sandbox/FrictionSandbox";

export default function FrictionPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 8 · Friction</p>
        <h1 className="kx-page-title">Same push, different surfaces.</h1>
        <p className="kx-page-subtitle">
          Pick a surface, set a force, predict where it stops — then see how much the surface changes the answer.
        </p>
      </div>

      <FrictionSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
