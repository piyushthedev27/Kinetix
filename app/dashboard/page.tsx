import { AppShell } from "@/components/layout";
import { LivePhysicsLab } from "@/components/kinetix-motion";
import { Button } from "@/components/ui";
import { history } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <AppShell current="Home">
      <div className="app-content dashboard">
        <header className="dashboard__title">
          <div>
            <p className="eyebrow">Your Physics Lab</p>
            <h1 className="page-title">
              Ready to make
              <br />
              motion visible?
            </h1>
            <p className="intro">
              Your next experiment begins with a real throw, then becomes a replay you can improve.
            </p>
            <div className="actions">
              <Button href="/app/experiments/projectile-motion">Start Projectile Motion</Button>
              <Button href="/app/lab" variant="secondary">
                Open Live Lab
              </Button>
            </div>
          </div>

          <aside className="dashboard__next">
            <span>Next insight</span>
            <strong>Try closer to 45°</strong>
            <p>See how launch angle changes range and why the path shifts.</p>
            <i>θ</i>
          </aside>
        </header>

        <section className="dashboard__experiment">
          <div className="dashboard__experiment-copy">
            <p className="eyebrow">Live preview · shared model</p>
            <h2>Projectile Motion</h2>
            <p>Throw, track, and understand. Follow the same capture loop before starting your own.</p>
            <span className="live-status">Phone ready</span>
          </div>
          <LivePhysicsLab compact />
        </section>

        <section className="dashboard__scores">
          <div>
            <p className="eyebrow">Your Performance</p>
            <h3>Physics Scores</h3>
            <div className="score-summary">
              <article>
                <strong>87</strong>
                <span>Best Score</span>
              </article>
              <article>
                <strong>82</strong>
                <span>Average Score</span>
              </article>
              <article>
                <strong>92%</strong>
                <span>Accuracy Rate</span>
              </article>
            </div>
          </div>

          <div className="dashboard__features">
            <p className="eyebrow">Quick Actions</p>
            <div className="features-grid">
              <article className="feature-card">
                <div className="feature-icon">🎯</div>
                <h4>Prediction Challenge</h4>
                <p>Predict angle, height & range before throwing</p>
                <Button href="/app/experiments/projectile-motion" variant="ghost" small>
                  Try Now
                </Button>
              </article>

              <article className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Compare Throws</h4>
                <p>View side-by-side analysis of your experiments</p>
                <Button href="/app/history" variant="ghost" small>
                  Compare
                </Button>
              </article>

              <article className="feature-card">
                <div className="feature-icon">📑</div>
                <h4>Lab Report</h4>
                <p>Download your results as a detailed report</p>
                <Button href="/app/dashboard" variant="ghost" small>
                  Generate
                </Button>
              </article>
            </div>
          </div>
        </section>

        <section className="dashboard__lower">
          <div>
            <p className="eyebrow">Your progress</p>
            <div className="dashboard__stats">
              <article>
                <strong>4</strong>
                <span>Experiments completed</span>
              </article>
              <article>
                <strong>5.8 <small>m</small></strong>
                <span>Best range</span>
              </article>
              <article>
                <strong>43°</strong>
                <span>Closest angle</span>
              </article>
            </div>
          </div>

          <div className="dashboard__activity">
            <p className="eyebrow">Recent experiments</p>
            {history.map((item) => (
              <article key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.date}</span>
                </div>
                <span className="mono">
                  {item.angle} · {item.velocity} · {item.range}
                </span>
                <Button href={`/app/history/${item.id}`} variant="ghost" small>
                  Replay
                </Button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
