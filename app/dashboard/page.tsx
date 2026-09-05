import Link from "next/link";
import { LibraryStats } from "@/components/dashboard/sections/LibraryStats";
import { ContinueSection } from "@/components/dashboard/sections/ContinueSection";
import { PHYSICS_TOPICS } from "@/lib/data/physics-topics";

export default function DashboardHomePage() {
  return (
    <div>
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Your Physics Lab</p>
        <h1 className="kx-page-title">Welcome back.</h1>
        <p className="kx-page-subtitle">Here&rsquo;s where your experiments stand.</p>
      </div>

      <LibraryStats />

      <div className="kx-two-col">
        <ContinueSection />

        <div className="kx-card">
          <h2 className="kx-section-title">Explore by grade</h2>
          {PHYSICS_TOPICS.map((group) => (
            <div key={group.grade} className="kx-experiment-card-meta" style={{ margin: "10px 0" }}>
              <strong style={{ color: "var(--ink, #17202a)" }}>{group.grade}</strong> — {group.topics.length} experiments
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/dashboard/experiments" className="kx-btn kx-btn-primary">
          Browse Experiments
        </Link>
        <Link href="/dashboard/history" className="kx-btn kx-btn-secondary">
          View History
        </Link>
      </div>
    </div>
  );
}
