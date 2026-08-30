import { ProfileSummary } from "@/components/dashboard/sections/ProfileSummary";

export default function DashboardProfilePage() {
  return (
    <div>
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Your Profile</p>
        <h1 className="kx-page-title">A record of real attempts.</h1>
        <p className="kx-page-subtitle">
          Visible improvements, and the next motion to test.
        </p>
      </div>

      <ProfileSummary />
    </div>
  );
}
