"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, History, User, Settings } from "lucide-react";
import { dashboardData } from "@/lib/data";
import { useAsyncData } from "./useAsyncData";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home, match: (p: string) => p === "/dashboard" },
  { href: "/dashboard/experiments", label: "Experiments", icon: FlaskConical, match: (p: string) => p.startsWith("/dashboard/experiments") },
  { href: "/dashboard/history", label: "History", icon: History, match: (p: string) => p.startsWith("/dashboard/history") },
  { href: "/dashboard/profile", label: "Profile", icon: User, match: (p: string) => p.startsWith("/dashboard/profile") },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, match: (p: string) => p.startsWith("/dashboard/settings") },
];

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { data: profile } = useAsyncData(() => dashboardData.getProfile(), []);

  const initial = profile?.displayName?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <aside className="kx-sidebar" data-open={isOpen}>
      <div className="kx-sidebar-brand">
        <span aria-hidden>⚪</span> Kinetix
      </div>

      <nav className="kx-sidebar-nav" aria-label="Dashboard navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon, match }) => (
          <Link
            key={href}
            href={href}
            className="kx-sidebar-link"
            data-active={match(pathname ?? "")}
            onClick={onNavigate}
          >
            <Icon aria-hidden />
            {label}
          </Link>
        ))}
      </nav>

      <div className="kx-sidebar-footer">
        <div className="kx-avatar" aria-hidden>
          {initial}
        </div>
        <div className="kx-sidebar-footer-text">
          <span className="kx-sidebar-footer-name">
            {profile?.displayName ?? "Loading…"}
          </span>
          <span className="kx-role-pill">{profile?.role ?? "Learner"}</span>
        </div>
      </div>
    </aside>
  );
}
