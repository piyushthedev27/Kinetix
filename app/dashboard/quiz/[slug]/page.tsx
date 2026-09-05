import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { findTopicBySlug } from "@/lib/data/physics-topics";
import { QUIZ_QUESTIONS } from "@/lib/data/quiz-questions";
import { QuizRunner } from "@/components/dashboard/quiz/QuizRunner";

export default async function QuizTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = findTopicBySlug(slug);
  const questions = found ? QUIZ_QUESTIONS[found.topic.id] : undefined;

  if (!found || !questions) notFound();

  const { topic } = found;

  return (
    <div className="app-content library">
      <div className="kx-experiment-breadcrumb">
        <Link href="/dashboard/quiz">Quizzes</Link>
        <ChevronRight size={12} />
        <span className="kx-experiment-breadcrumb-current">{topic.title}</span>
      </div>

      <div className="kx-page-header">
        <p className="kx-page-eyebrow">{topic.title}</p>
        <h1 className="kx-page-title">Quick quiz</h1>
        <p className="kx-page-subtitle">{questions.length} questions — check your answer after each one.</p>
      </div>

      <QuizRunner topicId={topic.id} slug={slug} title={topic.title} questions={questions} />

      <div style={{ marginTop: 20 }}>
        <Link href={`/dashboard/experiments/${slug}`} className="kx-btn kx-btn-secondary">
          Back to the experiment
        </Link>
      </div>
    </div>
  );
}
