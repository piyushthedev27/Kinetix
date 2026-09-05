import { LibraryStats } from "@/components/dashboard/sections/LibraryStats";
import { VisitHistoryList } from "@/components/dashboard/sections/VisitHistoryList";

export default function DashboardHistoryPage() {
  return (
    <div>
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Your Experiments</p>
        <h1 className="kx-page-title">See where you&rsquo;ve been.</h1>
        <p className="kx-page-subtitle">
          Every experiment you open is saved here on this device so you can jump back in.
        </p>
      </div>

      <LibraryStats />
      <VisitHistoryList />
    </div>
  );
}
