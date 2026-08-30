"use client";

import Link from "next/link";
import { Brand } from "./ui";
import { useAuth } from "@/lib/auth/AuthProvider";

const links = [
  ["Home", "/app"],
  ["Experiments", "/app/experiments"],
  ["History", "/app/history"],
  ["Profile", "/app/profile"],
  ["Settings", "/app/settings"],
] as const;

export function MarketingHeader() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container">
        <Brand />
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="#story">How it works</Link>
          <Link href="#experiments">Experiments</Link>
        </nav>
        {isAuthenticated ? (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{user?.email}</span>
            <button 
              className="button small ghost" 
              onClick={logout}
              style={{ padding: "0.25rem 0.75rem" }}
            >
              Log out
            </button>
          </div>
        ) : (
          <Link className="button primary small" href="/auth/sign-up">
            Start experimenting
          </Link>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Brand />
        <span>Science + motion + curiosity + precision.</span>
      </div>
    </footer>
  );
}

export function AppShell({
  children,
  current = "Home",
}: {
  children: React.ReactNode;
  current?: string;
}) {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <nav aria-label="App navigation">
          {links.map(([label, href]) => (
            <Link
              aria-current={label === current ? "page" : undefined}
              className={label === current ? "active" : ""}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">
          {user?.email?.split('@')[0] || 'Student'} <strong>· Learner</strong>
          <br />
          <span className="mono">KX-{user?.id?.slice(0, 8).toUpperCase() || 'STUDENT'}</span>
        </div>
      </aside>
      <main className="app-main">
        <header className="app-header">
          <span className="eyebrow">Your Physics Lab</span>
          <span className="tag live">Phone connected</span>
        </header>
        {children}
      </main>
    </div>
  );
}

