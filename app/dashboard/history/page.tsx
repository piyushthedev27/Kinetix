import { StatsSection } from "@/components/dashboard/sections/StatsSection";
import { ExperimentHistoryList } from "@/components/dashboard/sections/ExperimentHistoryList";

export default function DashboardHistoryPage() {
  return (
    <div>
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Your Experiments</p>
        <h1 className="kx-page-title">See your improvement.</h1>
        <p className="kx-page-subtitle">
          Each captured experiment becomes a learning artifact you can revisit.
        </p>
      </div>

      <StatsSection />
      <ExperimentHistoryList />
    </div>
  );
}
