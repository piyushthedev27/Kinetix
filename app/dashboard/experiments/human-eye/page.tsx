import Link from "next/link";
import { HumanEyeSandbox } from "@/components/dashboard/sandbox/HumanEyeSandbox";

export default function HumanEyePage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 10 · The Human Eye and the Colourful World</p>
        <h1 className="kx-page-title">A lens problem your glasses solve.</h1>
        <p className="kx-page-subtitle">
          Correct a short-sighted or long-sighted eye by dialing in the right lens power — or split white light into a spectrum.
        </p>
      </div>

      <HumanEyeSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
