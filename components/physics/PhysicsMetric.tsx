type PhysicsMetricProps = {
  label: string;
  value: string;
  mode?: "card" | "live";
  active?: boolean;
};

export function PhysicsMetric({ label, value, mode = "card", active = false }: PhysicsMetricProps) {
  const className = mode === "live" ? "live-metric" : "metric";
  return (
    <div className={active ? `${className} ${className}--active` : className}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

