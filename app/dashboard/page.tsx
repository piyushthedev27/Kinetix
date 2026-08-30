import Link from "next/link";
import { StatsSection } from "@/components/dashboard/sections/StatsSection";
import { RecentExperimentSection } from "@/components/dashboard/sections/RecentExperimentSection";

export default function DashboardHomePage() {
  return (
    <div>
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Your Physics Lab</p>
        <h1 className="kx-page-title">Welcome back.</h1>
        <p className="kx-page-subtitle">
          Here&rsquo;s where your experiments stand.
        </p>
      </div>

      <StatsSection />

      <div className="kx-two-col">
        <RecentExperimentSection />

        <div className="kx-card">
          <h2 className="kx-section-title">Next insight</h2>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink, #17202a)", margin: "4px 0 6px" }}>
            Try closer to 45°
          </p>
          <p style={{ fontSize: 13, color: "var(--muted, #56616d)", margin: 0 }}>
            See how launch angle changes range and why the path shifts.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/experiment/projectile-motion/setup" className="kx-btn kx-btn-primary">
          Start Projectile Motion
        </Link>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-secondary">
          Open Live Lab
        </Link>
      </div>
    </div>
  );
}
