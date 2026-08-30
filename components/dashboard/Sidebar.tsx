"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, History, User, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";

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
  const { user } = useAuth();

  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "Learner");
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="kx-sidebar" data-open={isOpen}>
      <div className="kx-sidebar-brand">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit" }}>
          <Image src="/logo.svg" alt="" width={23} height={20} priority />
          <span>Kinetix</span>
        </Link>
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
            {displayName}
          </span>
          <span className="kx-role-pill">Learner</span>
        </div>
      </div>
    </aside>
  );
}
