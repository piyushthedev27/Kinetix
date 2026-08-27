import Link from "next/link";
import { Brand } from "./ui";

const links = [
  ["Home", "/app"],
  ["Experiments", "/app/experiments"],
  ["History", "/app/history"],
  ["Profile", "/app/profile"],
  ["Settings", "/app/settings"],
] as const;

export function MarketingHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Brand />
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="#how">How it works</Link>
          <Link href="/app/experiments">Experiments</Link>
        </nav>
        <Link className="button primary small" href="/auth/sign-up">
          Start experimenting
        </Link>
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
          Alex <strong>· Learner</strong>
          <br />
          <span className="mono">KX-STUDENT-01</span>
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

