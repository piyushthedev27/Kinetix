"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  FlaskConical,
  ListChecks,
  History as HistoryIcon,
  PlayCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Trophy,
  BookOpen,
  Settings2,
  Sigma,
  Star,
  Smartphone,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PHYSICS_TOPICS } from "@/lib/data/physics-topics";
import { getVisitedTopicIds, getVisits, type ExperimentVisit } from "@/lib/data/experiment-visits";
import { getCompletedQuizCount } from "@/lib/data/quiz-results";
import { formatRelativeTime } from "@/lib/format";

const TOTAL_TOPICS = PHYSICS_TOPICS.reduce((sum, g) => sum + g.topics.length, 0);
const TOTAL_CATEGORIES = PHYSICS_TOPICS.length;

const CATEGORY_STYLE: Record<string, { icon: ComponentType<{ size?: number }>; color: string }> = {
  "Foundation Physics": { icon: BookOpen, color: "muted" },
  "Exploring Physics": { icon: BarChart3, color: "blue" },
  "Applied Physics": { icon: Settings2, color: "purple" },
  "Quantitative Physics": { icon: Sigma, color: "green" },
  "Advanced Physics": { icon: Star, color: "orange" },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeDashboard() {
  const reduce = useReducedMotion();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Welcome back");
  const [explored, setExplored] = useState<number | null>(null);
  const [quizzesCompleted, setQuizzesCompleted] = useState<number | null>(null);
  const [latestVisit, setLatestVisit] = useState<ExperimentVisit | null>(null);

  const firstName = user?.name?.split(" ")[0] || (user?.email ? user.email.split("@")[0] : "");

  useEffect(() => {
    setGreeting(getGreeting());
    setExplored(getVisitedTopicIds().size);
    setQuizzesCompleted(getCompletedQuizCount());
    setLatestVisit(getVisits(1)[0] ?? null);
  }, []);

  const stats = [
    { value: String(TOTAL_TOPICS), label: "Experiments available", icon: FlaskConical, color: "lime" },
    { value: String(TOTAL_CATEGORIES), label: "Levels", icon: BarChart3, color: "blue" },
    { value: explored === null ? "—" : String(explored), label: "Experiments explored", icon: CheckCircle2, color: "green" },
    { value: quizzesCompleted === null ? "—" : String(quizzesCompleted), label: "Quizzes completed", icon: Trophy, color: "orange" },
  ];

  return (
    <div>
      <motion.div
        className="kx-home-top"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="kx-page-header" style={{ marginBottom: 0 }}>
          <p className="kx-page-eyebrow">Your Physics Lab</p>
          <h1 className="kx-page-title">{greeting}{firstName ? `, ${firstName}` : ""}.</h1>
          <p className="kx-page-subtitle">Curiosity today. A smarter tomorrow.</p>
        </div>

        <div className="kx-home-hero-illustration" aria-hidden="true">
          <svg viewBox="0 0 220 130" fill="none">
            <rect x="65" y="10" width="90" height="10" rx="5" fill="#17202a" />
            {[
              { x: 60, y: 68, r: 7 },
              { x: 85, y: 90, r: 8 },
              { x: 110, y: 108, r: 11 },
              { x: 135, y: 90, r: 8 },
              { x: 160, y: 68, r: 7 },
            ].map((c, i) => (
              <g key={i}>
                <line x1={c.x} y1={15} x2={c.x} y2={c.y} stroke="#c8d0ca" strokeWidth="1.5" strokeDasharray={i === 2 ? "0" : "3 3"} />
                <circle cx={c.x} cy={c.y} r={c.r} fill={i === 2 ? "#b7e33a" : "#e4e8e2"} stroke="#17202a" strokeWidth={i === 2 ? 1.5 : 1} />
              </g>
            ))}
          </svg>
          <p className="kx-home-hero-text">Small Experiments.<br />Big Understanding.</p>
          <div className="kx-experiments-illustration-rule" />
        </div>
      </motion.div>

      <div className="kx-stat-row">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="kx-home-stat-card"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * i }}
            >
              <div className={`kx-home-icon-circle kx-home-icon-${stat.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <div className="kx-stat-value">{stat.value}</div>
                <div className="kx-stat-label">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <h2 className="kx-section-title" style={{ marginTop: 8 }}>What would you like to do?</h2>
      <div className="kx-home-actions-grid">
        <motion.div
          className="kx-home-action-span"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          whileHover={reduce ? undefined : { y: -3 }}
        >
          <Link href={latestVisit ? `/dashboard/experiments/${latestVisit.slug}` : "/dashboard/experiments"} className="kx-home-action-card kx-home-action-featured">
            <div className="kx-home-action-card-head">
              <div className="kx-home-icon-circle kx-home-icon-lime">
                <PlayCircle size={18} />
              </div>
              <ArrowRight className="kx-home-action-arrow" size={18} aria-hidden />
            </div>
            <p className="kx-home-action-title">{latestVisit ? "Continue Experiment" : "Start your first experiment"}</p>
            <p className="kx-home-action-desc">{latestVisit ? latestVisit.title : "Pick any topic from the library and dive in."}</p>
            <div className="kx-home-preview-graph" aria-hidden="true">
              <svg viewBox="0 0 200 40" fill="none">
                <path d="M4 36 Q 100 -6 196 36" stroke="#17202a" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                <circle cx="100" cy="10" r="5" fill="#17202a" />
              </svg>
            </div>
            {latestVisit && <p className="kx-home-action-footer">Last opened {formatRelativeTime(latestVisit.visitedAt)}</p>}
          </Link>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.17 }}
          whileHover={reduce ? undefined : { y: -3 }}
        >
          <Link href="/dashboard/experiments" className="kx-home-action-card">
            <div className="kx-home-action-card-head">
              <div className="kx-home-icon-circle kx-home-icon-lime">
                <FlaskConical size={18} />
              </div>
              <ArrowRight className="kx-home-action-arrow" size={18} aria-hidden />
            </div>
            <p className="kx-home-action-title">Browse Experiments</p>
            <p className="kx-home-action-desc">{TOTAL_TOPICS} hands-on experiments across {TOTAL_CATEGORIES} levels.</p>
            <div className="kx-home-preview-stack" aria-hidden="true">
              <span className="kx-home-preview-stack-card" />
              <span className="kx-home-preview-stack-card" />
              <span className="kx-home-preview-stack-card kx-home-preview-stack-front">Experiment</span>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          whileHover={reduce ? undefined : { y: -3 }}
        >
          <Link href="/dashboard/quiz" className="kx-home-action-card">
            <div className="kx-home-action-card-head">
              <div className="kx-home-icon-circle kx-home-icon-lime">
                <ListChecks size={18} />
              </div>
              <ArrowRight className="kx-home-action-arrow" size={18} aria-hidden />
            </div>
            <p className="kx-home-action-title">Take a Quiz</p>
            <p className="kx-home-action-desc">Test what you&rsquo;ve learned with quick quizzes.</p>
            <div className="kx-home-preview-quiz" aria-hidden="true">
              <span />
              <span />
              <span />
              <div className="kx-home-preview-quiz-badge">?</div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.31 }}
          whileHover={reduce ? undefined : { y: -3 }}
        >
          <Link href="/dashboard/history" className="kx-home-action-card">
            <div className="kx-home-action-card-head">
              <div className="kx-home-icon-circle kx-home-icon-lime">
                <HistoryIcon size={18} />
              </div>
              <ArrowRight className="kx-home-action-arrow" size={18} aria-hidden />
            </div>
            <p className="kx-home-action-title">View History</p>
            <p className="kx-home-action-desc">See every experiment you&rsquo;ve explored.</p>
            <div className="kx-home-preview-bars" aria-hidden="true">
              {[40, 55, 45, 70, 90].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} data-highlight={i >= 3} />
              ))}
            </div>
          </Link>
        </motion.div>
      </div>

      <div className="kx-home-section-header" style={{ marginTop: 28 }}>
        <h2 className="kx-section-title" style={{ margin: 0 }}>Explore by level</h2>
        <Link href="/dashboard/experiments" className="kx-home-see-all">
          See all levels <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
      <div className="kx-home-category-row">
        {PHYSICS_TOPICS.map((group, i) => {
          const style = CATEGORY_STYLE[group.grade] ?? { icon: BookOpen, color: "muted" };
          const Icon = style.icon;
          return (
            <motion.div
              key={group.grade}
              initial={reduce ? false : { opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
            >
              <Link href="/dashboard/experiments" className="kx-home-category-pill">
                <div className={`kx-home-icon-circle kx-home-icon-${style.color} kx-home-icon-sm`}>
                  <Icon size={15} />
                </div>
                <span>
                  <span className="kx-home-category-name">{group.grade}</span>
                  <span className="kx-home-category-count">{group.topics.length} experiments</span>
                </span>
                <ArrowRight className="kx-home-action-arrow" size={15} aria-hidden />
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.7 }}
      >
        <Link href="/dashboard/lab" className="kx-home-lab-banner">
          <div className="kx-home-lab-banner-icon">
            <Smartphone size={28} />
          </div>
          <div className="kx-home-lab-banner-body">
            <p className="kx-home-lab-banner-eyebrow">Turn Your Phone Into a Lab</p>
            <p className="kx-home-lab-banner-title">Real experiments. Real results.</p>
            <p className="kx-home-lab-banner-desc">Use your phone&rsquo;s sensors — motion, sound, light and more — to explore physics in the real world.</p>
          </div>
          <span className="kx-btn kx-btn-primary kx-home-lab-banner-cta">
            Explore Phone Lab <ArrowRight size={16} aria-hidden />
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
