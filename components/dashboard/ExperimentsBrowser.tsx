"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { PHYSICS_TOPICS } from "@/lib/data/physics-topics";

export function ExperimentsBrowser() {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHYSICS_TOPICS;
    return PHYSICS_TOPICS
      .map((group) => ({
        ...group,
        topics: group.topics.filter(
          (topic) => topic.title.toLowerCase().includes(q) || topic.description.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.topics.length > 0);
  }, [query]);

  const totalMatches = filteredGroups.reduce((sum, g) => sum + g.topics.length, 0);

  return (
    <div>
      <div className="kx-topic-search">
        <Search size={16} className="kx-topic-search-icon" aria-hidden />
        <input
          type="search"
          placeholder="Search experiments by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search experiments"
        />
      </div>

      {query.trim() && (
        <p className="kx-topic-search-count">
          {totalMatches === 0 ? "No experiments match." : `${totalMatches} experiment${totalMatches === 1 ? "" : "s"} found.`}
        </p>
      )}

      {filteredGroups.map((group) => (
        <div key={group.grade} className="kx-topic-section">
          <h2 className="kx-topic-section-title">{group.grade}</h2>
          <p className="kx-topic-section-desc">{group.description}</p>
          <div className="kx-topic-grid">
            {group.topics.map((topic) => {
              const Icon = topic.icon;
              const card = (
                <>
                  <div className="kx-topic-card-head">
                    <div className="kx-topic-icon">
                      <Icon aria-hidden />
                    </div>
                    <span className="kx-topic-pill" data-ready={Boolean(topic.slug)}>
                      <span className="kx-topic-pill-dot" aria-hidden />
                      {topic.slug ? "Ready" : "Soon"}
                    </span>
                  </div>
                  <div className="kx-topic-body">
                    <p className="kx-topic-title">{topic.title}</p>
                    <p className="kx-topic-desc">{topic.description}</p>
                  </div>
                  {topic.slug && (
                    <span className="kx-topic-open">
                      Open experiment <ChevronRight size={14} aria-hidden />
                    </span>
                  )}
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
