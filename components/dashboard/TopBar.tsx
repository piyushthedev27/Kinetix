"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { dashboardData } from "@/lib/data";
import { useAsyncData } from "./useAsyncData";
// If your project's auth hook lives somewhere else, update this import —
// it must expose a `logout()` function. See README "Wiring notes".
import { useAuth } from "@/lib/auth/AuthProvider";

const PAGE_TITLES: { match: (p: string) => boolean; title: string }[] = [
  { match: (p) => p === "/dashboard", title: "Home" },
  { match: (p) => p.startsWith("/dashboard/experiments"), title: "Experiments" },
  { match: (p) => p.startsWith("/dashboard/history"), title: "History" },
  { match: (p) => p.startsWith("/dashboard/profile"), title: "Profile" },
  { match: (p) => p.startsWith("/dashboard/settings"), title: "Settings" },
];

function getPageTitle(pathname: string): string {
  return PAGE_TITLES.find((entry) => entry.match(pathname))?.title ?? "Dashboard";
}

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: profile } = useAsyncData(() => dashboardData.getProfile(), []);

  // `useAuth` is optional at the type level here in case it isn't wired
  // yet in your project — guard the call so this component doesn't crash
  // a project that hasn't added AuthProvider yet.
  let logout: (() => void) | undefined;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ({ logout } = useAuth());
  } catch {
    logout = undefined;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    logout?.();
    router.push("/auth/sign-in");
  }

  return (
    <header className="kx-topbar">
      <div className="kx-topbar-left">
        <button
          type="button"
          className="kx-menu-toggle"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <span className="kx-topbar-title">{getPageTitle(pathname)}</span>
      </div>

      <div className="kx-topbar-right">
        <span className="kx-status-pill">
          <span className="kx-status-pill-dot" aria-hidden />
          Phone connected
        </span>

        <div className="kx-user-menu" ref={menuRef}>
          <button
            type="button"
            className="kx-user-menu-trigger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Open user menu"
          >
            <div className="kx-avatar" style={{ width: 28, height: 28, fontSize: 12 }} aria-hidden>
              {profile?.displayName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <ChevronDown size={14} />
          </button>

          {menuOpen && (
            <div className="kx-user-menu-dropdown" role="menu">
              <Link href="/dashboard/profile" className="kx-user-menu-item" role="menuitem" onClick={() => setMenuOpen(false)}>
                <User /> Profile
              </Link>
              <Link href="/dashboard/settings" className="kx-user-menu-item" role="menuitem" onClick={() => setMenuOpen(false)}>
                <Settings /> Settings
              </Link>
              <button type="button" className="kx-user-menu-item" role="menuitem" onClick={handleLogout}>
                <LogOut /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
