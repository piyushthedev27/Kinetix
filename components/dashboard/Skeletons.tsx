export function StatRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="kx-stat-row">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="kx-skeleton" style={{ height: 74 }} />
      ))}
    </div>
  );
}

export function ExperimentCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="kx-skeleton" style={{ height: 88, marginBottom: 12 }} />
      ))}
    </>
  );
}

export function CardSkeleton({ height = 180 }: { height?: number }) {
  return <div className="kx-skeleton" style={{ height }} />;
}
