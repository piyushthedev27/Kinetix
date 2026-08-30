import { PhysicsMotion } from "@/components/kinetix-motion";
import { Button } from "@/components/ui";

export default function ExperimentsPage() {
  return (
    <div className="app-content library">
        <header>
          <p className="eyebrow">Experiment library</p>
          <h1 className="page-title">Learning starts in motion.</h1>
          <p className="intro">One complete experiment. A real camera, a real throw, and a visible equation.</p>
        </header>

        <section className="library-feature">
          <div>
            <p className="eyebrow">01 · Available now</p>
            <h2>
              Projectile
              <br />
              <em>Motion</em>
            </h2>
            <p>
              Throw a ball. Kinetix detects the path and turns it into angle, velocity, height, range, and a learning moment.
            </p>
            <div className="actions">
              <Button href="/app/experiments/projectile-motion">Explore experiment</Button>
              <span className="mono">≈ 2 MIN · CAMERA</span>
            </div>
          </div>

          <div className="library-feature__visual">
            <PhysicsMotion />
          </div>
        </section>

        <section className="library-next">
          <div>
            <p className="eyebrow">Next experiments</p>
            <h2>More ways to test the equation.</h2>
          </div>

          <article>
            <span>02</span>
            <h3>Pendulum Motion</h3>
            <p>See a real swing become period and energy.</p>
            <b>Planned next</b>
          </article>

          <article>
            <span>03</span>
            <h3>Free Fall</h3>
            <p>Measure a drop and make gravity visible.</p>
            <b>Planned next</b>
          </article>
        </section>
    </div>
  );
}
