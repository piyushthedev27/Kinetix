"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import "./dashboard.css";

interface DashboardShellProps {
  children: ReactNode;
}

/**
 * Wraps every dashboard page. Responsive behavior:
 *  - Desktop (>1024px): sidebar fixed open, no toggle needed.
 *  - Tablet/Mobile (<=1024px): sidebar becomes a slide-out drawer,
 *    opened via the TopBar's hamburger button, closed by tapping the
 *    backdrop or any nav link.
 *
 * Usage: wrap your existing app/dashboard/layout.tsx content in this
 * (see README "Installation" step 4). If you already have an AuthGuard
 * wrapper, put <AuthGuard><DashboardShell>{children}</DashboardShell></AuthGuard>
 * — guard on the outside, shell on the inside.
 */
export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="kx-shell">
      <Sidebar isOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div
        className="kx-sidebar-backdrop"
        data-open={mobileOpen}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />
      <div className="kx-main">
        <TopBar onMenuClick={() => setMobileOpen((v) => !v)} />
        <div className="kx-content">{children}</div>
      </div>
    </div>
  );
}
