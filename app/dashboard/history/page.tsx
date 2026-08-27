import { AppShell } from "@/components/layout";
import { Button } from "@/components/ui";
import { history } from "@/lib/mock-data";

export default function HistoryPage() {
  return (
    <AppShell current="History">
      <div className="app-content">
        <p className="eyebrow">Your experiments</p>
        <h1 className="page-title">See your improvement.</h1>
        <p className="intro">Each captured experiment becomes a learning artifact you can revisit.</p>

        <div className="small-stats">
          <div className="stat">
            <strong>4</strong>
            <span>Experiments completed</span>
          </div>
          <div className="stat">
            <strong>5.8 m</strong>
            <span>Best range</span>
          </div>
        </div>

        <section style={{ marginTop: 28 }}>
          {history.map((item) => (
            <article className="next-card" style={{ marginTop: 12, padding: 18 }} key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.date}</p>
                <p className="mono">
                  {item.angle} · {item.velocity} · {item.range}
                </p>
                <p className="intro" style={{ marginTop: 10 }}>
                  {item.comparison}
                </p>
              </div>
              <Button href={`/app/history/${item.id}`} small variant="secondary">
                View result
              </Button>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}

