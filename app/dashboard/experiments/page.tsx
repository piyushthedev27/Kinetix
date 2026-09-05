import Link from "next/link";
import { PHYSICS_TOPICS } from "@/lib/data/physics-topics";

export default function ExperimentsPage() {
  return (
    <div className="app-content library">
      <div className="kx-page-header">
        <p className="kx-page-eyebrow">Physics Concepts, Grades 6–10 (NCERT/CBSE)</p>
        <h1 className="kx-page-title">Pick a topic to experiment with.</h1>
        <p className="kx-page-subtitle">
          Select a topic below to open its sandbox. Topics without a sandbox yet are marked coming soon.
        </p>
      </div>

      {PHYSICS_TOPICS.map((group) => (
        <div key={group.grade} className="kx-topic-grade">
          <h2 className="kx-section-title">{group.grade}</h2>
          <div className="kx-topic-list">
            {group.topics.map((topic) =>
              topic.slug ? (
                <Link
                  key={topic.id}
                  href={`/dashboard/experiments/${topic.slug}`}
                  className="kx-topic-item"
                  data-available="true"
                >
                  <span>{topic.title}</span>
                  <span className="tag live">Ready</span>
                </Link>
              ) : (
                <div key={topic.id} className="kx-topic-item" data-available="false">
                  <span>{topic.title}</span>
                  <span className="tag">Coming soon</span>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
