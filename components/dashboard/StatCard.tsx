interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="kx-stat-card">
      <div className="kx-stat-value">{value}</div>
      <div className="kx-stat-label">{label}</div>
    </div>
  );
}
