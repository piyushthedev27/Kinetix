"use client";

import { useAuth } from "@/lib/auth/AuthProvider";
import { LibraryStats } from "@/components/dashboard/sections/LibraryStats";
import { VisitHistoryList } from "@/components/dashboard/sections/VisitHistoryList";

export default function DashboardProfilePage() {
  const { user } = useAuth();
  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Learner");

  return (
    <div>
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Your Profile</p>
        <h1 className="kx-page-title">A record of real attempts.</h1>
        <p className="kx-page-subtitle">Visible progress, and what to try next.</p>
      </div>

      <div className="kx-card" style={{ marginBottom: 24 }}>
        <h2 className="kx-page-title" style={{ marginBottom: 4, fontSize: 20 }}>
          {displayName}&rsquo;s Physics Lab
        </h2>
        <p className="kx-page-subtitle">{user?.email || ""}</p>
      </div>

      <LibraryStats />

      <h2 className="kx-section-title">Recent activity</h2>
      <VisitHistoryList limit={5} />
    </div>
  );
}
