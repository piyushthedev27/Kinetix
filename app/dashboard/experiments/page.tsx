import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PHYSICS_TOPICS } from "@/lib/data/physics-topics";

export default function ExperimentsPage() {
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

      {PHYSICS_TOPICS.map((group) => (
        <div key={group.grade} className="kx-topic-section">
          <h2 className="kx-topic-section-title">{group.grade}</h2>
          <p className="kx-topic-section-desc">{group.description}</p>
          <div className="kx-topic-list">
            {group.topics.map((topic) => {
              const Icon = topic.icon;
              const card = (
                <>
                  <div className="kx-topic-icon">
                    <Icon aria-hidden />
                  </div>
                  <div className="kx-topic-body">
                    <p className="kx-topic-title">{topic.title}</p>
                    <p className="kx-topic-desc">{topic.description}</p>
                  </div>
                  <span className="kx-topic-pill" data-ready={Boolean(topic.slug)}>
                    <span className="kx-topic-pill-dot" aria-hidden />
                    {topic.slug ? "Ready" : "Coming soon"}
                  </span>
                  {topic.slug && <ChevronRight className="kx-topic-chevron" size={18} aria-hidden />}
                </>
              );

              return topic.slug ? (
                <Link key={topic.id} href={`/dashboard/experiments/${topic.slug}`} className="kx-topic-card" data-available="true">
                  {card}
                </Link>
              ) : (
                <div key={topic.id} className="kx-topic-card" data-available="false">
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
