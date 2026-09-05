import { ExperimentsBrowser } from "@/components/dashboard/ExperimentsBrowser";

export default async function ExperimentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  return (
    <div className="app-content library">
      <div className="kx-experiments-header">
        <div className="kx-page-header">
          <p className="kx-page-eyebrow">Physics Lab</p>
          <h1 className="kx-page-title">Pick a topic to experiment with.</h1>
          <p className="kx-page-subtitle">Choose a physics concept and explore it through a hands-on experiment.</p>
        </div>

        <div className="kx-experiments-illustration" aria-hidden="true">
          <svg viewBox="0 0 260 110" fill="none">
            <path d="M10 95 Q 130 5 250 95" stroke="#9ccb25" strokeWidth="2" strokeDasharray="4 5" fill="none" />
            <circle cx="130" cy="27" r="7" fill="#b7e33a" stroke="#17202a" strokeWidth="1.5" />
            <circle cx="10" cy="95" r="4" fill="#17202a" />
            <line x1="10" y1="95" x2="250" y2="95" stroke="#8b96a3" strokeWidth="2" />
          </svg>
          <p className="kx-experiments-illustration-text">Real Experiments. Deeper Understanding.</p>
          <div className="kx-experiments-illustration-rule" />
        </div>
      </div>

      <ExperimentsBrowser initialQuery={q} />
    </div>
  );
}
