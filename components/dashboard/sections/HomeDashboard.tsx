"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FlaskConical, ListChecks, History as HistoryIcon, PlayCircle, ArrowRight } from "lucide-react";
import { PHYSICS_TOPICS } from "@/lib/data/physics-topics";
import { getVisitedTopicIds, getVisits, type ExperimentVisit } from "@/lib/data/experiment-visits";
import { formatRelativeTime } from "@/lib/format";
import { StatCard } from "../StatCard";

const TOTAL_TOPICS = PHYSICS_TOPICS.reduce((sum, g) => sum + g.topics.length, 0);
const TOTAL_CATEGORIES = PHYSICS_TOPICS.length;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeDashboard() {
  const reduce = useReducedMotion();
  const [greeting, setGreeting] = useState("Welcome back");
  const [explored, setExplored] = useState<number | null>(null);
  const [latestVisit, setLatestVisit] = useState<ExperimentVisit | null>(null);

  useEffect(() => {
    setGreeting(getGreeting());
    setExplored(getVisitedTopicIds().size);
    const visits = getVisits(1);
    setLatestVisit(visits[0] ?? null);
  }, []);

  const actions = [
    latestVisit
      ? {
          key: "continue",
          href: `/dashboard/experiments/${latestVisit.slug}`,
          icon: PlayCircle,
          title: `Continue: ${latestVisit.title}`,
          desc: `Pick up right where you left off — last opened ${formatRelativeTime(latestVisit.visitedAt)}.`,
        }
      : {
          key: "start",
          href: "/dashboard/experiments",
          icon: PlayCircle,
          title: "Start your first experiment",
          desc: "Pick any topic from the library and dive into a hands-on physics experiment.",
        },
    {
      key: "browse",
      href: "/dashboard/experiments",
      icon: FlaskConical,
      title: "Browse Experiments",
      desc: `${TOTAL_TOPICS} hands-on experiments across ${TOTAL_CATEGORIES} levels, from foundation to advanced.`,
    },
    {
      key: "quiz",
      href: "/dashboard/quiz",
      icon: ListChecks,
      title: "Take a Quiz",
      desc: "Test what actually stuck — a short quiz for every experiment you've tried.",
    },
    {
      key: "history",
      href: "/dashboard/history",
      icon: HistoryIcon,
      title: "View History",
      desc: "See every experiment you've explored on this device, most recent first.",
    },
  ];

  return (
    <div>
      <motion.div
        className="kx-page-header"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="kx-page-eyebrow">Your Physics Lab</p>
        <h1 className="kx-page-title">{greeting}.</h1>
        <p className="kx-page-subtitle">Here&rsquo;s what you can do today.</p>
      </motion.div>

      <div className="kx-stat-row">
        {[
          { value: String(TOTAL_TOPICS), label: "Experiments available" },
          { value: String(TOTAL_CATEGORIES), label: "Levels" },
          { value: explored === null ? "—" : String(explored), label: "Experiments explored" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i }}
          >
            <StatCard value={stat.value} label={stat.label} />
          </motion.div>
        ))}
      </div>

      <h2 className="kx-section-title" style={{ marginTop: 8 }}>What would you like to do?</h2>
      <div className="kx-home-actions-grid">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.key}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
              whileHover={reduce ? undefined : { y: -3 }}
            >
              <Link href={action.href} className="kx-home-action-card">
                <div className="kx-home-action-icon">
                  <Icon aria-hidden size={20} />
                </div>
                <div className="kx-home-action-body">
                  <p className="kx-home-action-title">{action.title}</p>
                  <p className="kx-home-action-desc">{action.desc}</p>
                </div>
                <ArrowRight className="kx-home-action-arrow" size={18} aria-hidden />
              </Link>
            </motion.div>
          );
        })}
      </div>

      <h2 className="kx-section-title" style={{ marginTop: 28 }}>Explore by level</h2>
      <div className="kx-home-category-row">
        {PHYSICS_TOPICS.map((group, i) => (
          <motion.div
            key={group.grade}
            initial={reduce ? false : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
          >
            <Link href="/dashboard/experiments" className="kx-home-category-pill">
              <span className="kx-home-category-name">{group.grade}</span>
              <span className="kx-home-category-count">{group.topics.length} experiments</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
