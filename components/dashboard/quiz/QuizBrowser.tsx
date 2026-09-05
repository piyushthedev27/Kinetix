"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { PHYSICS_TOPICS } from "@/lib/data/physics-topics";
import { QUIZ_QUESTIONS } from "@/lib/data/quiz-questions";
import { getBestScore } from "@/lib/data/quiz-results";

export function QuizBrowser() {
  const [query, setQuery] = useState("");
  const [bestScores, setBestScores] = useState<Record<string, { score: number; total: number } | null>>({});

  useEffect(() => {
    const scores: Record<string, { score: number; total: number } | null> = {};
    for (const group of PHYSICS_TOPICS) {
      for (const topic of group.topics) {
        const best = getBestScore(topic.id);
        scores[topic.id] = best ? { score: best.score, total: best.total } : null;
      }
    }
    setBestScores(scores);
  }, []);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHYSICS_TOPICS;
    return PHYSICS_TOPICS
      .map((group) => ({
        ...group,
        topics: group.topics.filter((topic) => topic.title.toLowerCase().includes(q)),
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
          placeholder="Search quizzes by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search quizzes"
        />
      </div>

      {query.trim() && (
        <p className="kx-topic-search-count">
          {totalMatches === 0 ? "No quizzes match." : `${totalMatches} quiz${totalMatches === 1 ? "" : "zes"} found.`}
        </p>
      )}

      {filteredGroups.map((group) => (
        <div key={group.grade} className="kx-topic-section">
          <h2 className="kx-topic-section-title">{group.grade}</h2>
          <p className="kx-topic-section-desc">{group.description}</p>
          <div className="kx-topic-grid">
            {group.topics.map((topic) => {
              const Icon = topic.icon;
              const hasQuiz = Boolean(topic.slug) && Boolean(QUIZ_QUESTIONS[topic.id]);
              const best = bestScores[topic.id];
              const card = (
                <>
                  <div className="kx-topic-card-head">
                    <div className="kx-topic-icon">
                      <Icon aria-hidden />
                    </div>
                    <span className="kx-topic-pill" data-ready={hasQuiz}>
                      <span className="kx-topic-pill-dot" aria-hidden />
                      {best ? `Best: ${best.score}/${best.total}` : hasQuiz ? "Not taken" : "Soon"}
                    </span>
                  </div>
                  <div className="kx-topic-body">
                    <p className="kx-topic-title">{topic.title}</p>
                    <p className="kx-topic-desc">{topic.description}</p>
                  </div>
                  {hasQuiz && (
                    <span className="kx-topic-open">
                      {best ? "Retake quiz" : "Start quiz"} <ChevronRight size={14} aria-hidden />
                    </span>
                  )}
                </>
              );

              return hasQuiz ? (
                <Link key={topic.id} href={`/dashboard/quiz/${topic.slug}`} className="kx-topic-card" data-available="true">
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
