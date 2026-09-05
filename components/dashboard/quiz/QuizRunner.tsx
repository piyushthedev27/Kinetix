"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/data/quiz-questions";
import { recordQuizResult } from "@/lib/data/quiz-results";

interface QuizRunnerProps {
  topicId: string;
  slug: string;
  title: string;
  questions: QuizQuestion[];
}

function feedbackFor(pct: number) {
  if (pct === 100) return "Perfect score! You've got this topic down.";
  if (pct >= 75) return "Great work — you clearly understood the experiment.";
  if (pct >= 50) return "Good start. Revisit the experiment and try again to sharpen it up.";
  return "This one needs another look — try the experiment again, then retake the quiz.";
}

export function QuizRunner({ topicId, slug, title, questions }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const checkAnswer = () => {
    if (selected === null) return;
    setChecked(true);
    if (selected === question.correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      recordQuizResult({ topicId, slug, title, score, total: questions.length });
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  };

  const retake = () => {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="kx-quiz kx-quiz-result">
        <p className="kx-quiz-result-score">{score} / {questions.length}</p>
        <p className="kx-quiz-result-feedback">{feedbackFor(pct)}</p>
        <div className="kx-sandbox-actions">
          <button type="button" className="kx-btn kx-btn-primary" onClick={retake}>Retake Quiz</button>
          <Link href="/dashboard/quiz" className="kx-btn kx-btn-secondary">Back to Quizzes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="kx-quiz">
      <p className="kx-quiz-progress">Question {index + 1} of {questions.length}</p>
      <h2 className="kx-quiz-question">{question.question}</h2>

      <div className="kx-quiz-options">
        {question.options.map((opt, i) => {
          const isCorrectOpt = checked && i === question.correctIndex;
          const isWrongSelected = checked && i === selected && i !== question.correctIndex;
          return (
            <button
              key={i}
              type="button"
              className="kx-quiz-option"
              data-selected={selected === i}
              data-correct={isCorrectOpt}
              data-wrong={isWrongSelected}
              disabled={checked}
              onClick={() => setSelected(i)}
            >
              <span>{opt}</span>
              {isCorrectOpt && <Check size={16} />}
              {isWrongSelected && <X size={16} />}
            </button>
          );
        })}
      </div>

      {checked && <p className="kx-quiz-explanation">{question.explanation}</p>}

      <div className="kx-sandbox-actions">
        {!checked ? (
          <button type="button" className="kx-btn kx-btn-primary" onClick={checkAnswer} disabled={selected === null}>
            Check Answer
          </button>
        ) : (
          <button type="button" className="kx-btn kx-btn-primary" onClick={next}>
            {isLast ? "See Results" : "Next Question"}
          </button>
        )}
      </div>
    </div>
  );
}
