"use client";

import { useState } from "react";

type Category = "renewable" | "nonrenewable";

interface Source {
  id: string;
  name: string;
  correct: Category;
  fact: string;
}

const SOURCES: Source[] = [
  { id: "solar", name: "Solar", correct: "renewable", fact: "The sun's energy is effectively inexhaustible on human timescales." },
  { id: "wind", name: "Wind", correct: "renewable", fact: "Wind comes from the sun's uneven heating of the atmosphere — it won't run out." },
  { id: "hydro", name: "Hydropower", correct: "renewable", fact: "Flowing water is continuously replenished by the water cycle." },
  { id: "biomass", name: "Biomass", correct: "renewable", fact: "Plants regrow, so biomass can be replenished if managed sustainably." },
  { id: "coal", name: "Coal", correct: "nonrenewable", fact: "Formed over millions of years — we burn it far faster than it forms." },
  { id: "petroleum", name: "Petroleum", correct: "nonrenewable", fact: "Like coal, it took millions of years to form and is used up much faster." },
  { id: "gas", name: "Natural Gas", correct: "nonrenewable", fact: "A fossil fuel with a limited underground supply." },
  { id: "nuclear", name: "Nuclear (uranium)", correct: "nonrenewable", fact: "Uranium is a mined mineral resource — finite, even though it isn't a fossil fuel." },
];

export function SourcesOfEnergySandbox() {
  const [answers, setAnswers] = useState<Record<string, Category | undefined>>({});
  const [revealed, setRevealed] = useState(false);
  const [log, setLog] = useState<string[]>(["Sort every source, then check your answers."]);

  const setAnswer = (id: string, cat: Category) => {
    setAnswers((prev) => ({ ...prev, [id]: cat }));
    setRevealed(false);
  };

  const checkAll = () => {
    const unanswered = SOURCES.filter((s) => !answers[s.id]);
    if (unanswered.length > 0) {
      setLog((prev) => [...prev, `Sort all ${SOURCES.length} sources before checking — ${unanswered.length} left.`]);
      return;
    }
    const correctCount = SOURCES.filter((s) => answers[s.id] === s.correct).length;
    setRevealed(true);
    setLog((prev) => [
      ...prev,
      `You got ${correctCount} of ${SOURCES.length} correct.`,
      "Renewable sources are replenished naturally on a human timescale (sun, wind, flowing water, regrown plants). Non-renewable sources — fossil fuels and mined fuels — took millions of years to form and are being used up far faster than nature remakes them.",
    ]);
  };

  const reset = () => {
    setAnswers({});
    setRevealed(false);
    setLog(["Sort every source, then check your answers."]);
  };

  return (
    <div className="kx-sandbox">
      <div className="kx-sandbox-source-grid">
        {SOURCES.map((s) => {
          const answer = answers[s.id];
          const isCorrect = revealed && answer === s.correct;
          const isWrong = revealed && answer !== s.correct;
          return (
            <div key={s.id} className="kx-sandbox-source-card" data-result={isCorrect ? "correct" : isWrong ? "incorrect" : undefined}>
              <div className="kx-sandbox-source-name">{s.name}</div>
              <div className="kx-sandbox-chip-row">
                <button type="button" className="kx-sandbox-chip" data-active={answer === "renewable"} onClick={() => setAnswer(s.id, "renewable")}>Renewable</button>
                <button type="button" className="kx-sandbox-chip" data-active={answer === "nonrenewable"} onClick={() => setAnswer(s.id, "nonrenewable")}>Non-renewable</button>
              </div>
              {revealed && <p className="kx-sandbox-source-fact">{s.fact}</p>}
            </div>
          );
        })}
      </div>

      <div className="kx-sandbox-actions">
        <button type="button" className="kx-btn kx-btn-primary" onClick={checkAll}>Check Answers</button>
        <button type="button" className="kx-btn kx-btn-secondary" onClick={reset}>Reset</button>
      </div>

      <div className="kx-sandbox-log" aria-live="polite">
        {log.map((line, i) => <div key={i} className="kx-sandbox-log-line">{line}</div>)}
      </div>
    </div>
  );
}
