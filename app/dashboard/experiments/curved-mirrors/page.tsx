import Link from "next/link";
import { CurvedMirrorSandbox } from "@/components/dashboard/sandbox/CurvedMirrorSandbox";

export default function CurvedMirrorsPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Class 8 · Light</p>
        <h1 className="kx-page-title">Curved mirrors bend the rules.</h1>
        <p className="kx-page-subtitle">
          Move the object, switch between concave and convex, and see whether the image is real or virtual, upright or flipped.
        </p>
      </div>

      <CurvedMirrorSandbox />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Back to topics
        </Link>
      </div>
    </div>
  );
}
