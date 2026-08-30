"use client";

import { AppShell } from "@/components/layout";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <AppShell current="Settings">
      <div className="app-content settings-page">
        <header>
          <p className="eyebrow">Settings</p>
          <h1 className="page-title">Tune your Lab.</h1>
          <p className="intro">Set up Kinetix for your experiment space and how you prefer to experience motion.</p>
        </header>

        <section className="settings-grid">
          <article>
            <span className="settings-index">01</span>
            <h2>Experiment setup</h2>
            <div className="setting-row">
              <span>Measurement units</span>
              <b>Metric</b>
            </div>
            <div className="setting-row">
              <span>Camera guidance</span>
              <b className="setting-on">Enabled</b>
            </div>
          </article>

          <article>
            <span className="settings-index">02</span>
            <h2>Accessibility</h2>
            <div className="setting-row">
              <span>Motion preference</span>
              <b>Device setting</b>
            </div>
            <p>Decorative animation is reduced automatically when your device requests it.</p>
          </article>

          <article>
            <span className="settings-index">03</span>
            <h2>Account</h2>
            <div className="setting-row">
              <span>Email</span>
              <b>{user?.email || "Not signed in"}</b>
            </div>
            <div className="setting-row">
              <span>Authentication</span>
              <b className="setting-on">Wired (Real Backend)</b>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Button onClick={logout} variant="secondary" small>
                Log out
              </Button>
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}

