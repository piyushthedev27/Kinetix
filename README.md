# Kinetix

**Physics you can see.** Throw a ball, Kinetix tracks the motion, turns it into physics, and shows you why the result happened.

Kinetix is a phone-first physics lab platform built with Next.js. Students use their phone to capture real-world motion, and a laptop dashboard instantly visualizes the underlying physics — trajectory, velocity, angle, energy — as interactive, scroll-driven data stories.

> **Hackathon context**: Projectile Motion is the first live experiment. Free Fall, Pendulum Motion, and Collisions are on the roadmap — the same detect-track-calculate pipeline is built to extend to all of them.

---

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Screenshot tool

Capture clean, animation-settled screenshots of every landing page section:

```bash
node scripts/screenshot-landing.mjs              # default: http://localhost:3000
node scripts/screenshot-landing.mjs http://localhost:3001   # custom port
```

Outputs numbered PNGs to `screenshots/` (gitignored). The script auto-detects system Chrome or Edge — no bundled Chromium download required.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 |
| Scroll Animations | GSAP + ScrollTrigger (hero pinned sequence) |
| Component Animations | Framer Motion (`motion/react`) |
| Styling | Vanilla CSS with design tokens (`tokens.css`) |
| Icons | Lucide React |
| Build | ~21s production, 103 kB shared JS |

---

## Project structure

```text
app/
├─ page.tsx                         # marketing landing page
├─ layout.tsx                       # root layout (metadata, global CSS)
├─ styles/
│  ├─ tokens.css                    # design tokens (colors, fonts, spacing, shadows)
│  ├─ landing.css                   # landing page component styles (2300+ lines)
│  └─ pages.css                     # dashboard and page-specific styles
├─ auth/                            # sign-in, sign-up, password recovery
├─ dashboard/                       # learner web app (served at /app/*)
│  ├─ experiments/                  # experiment list + projectile motion detail
│  ├─ history/                      # past experiment results
│  ├─ lab/                          # live physics lab
│  ├─ profile/                      # learner profile
│  └─ settings/
├─ experiment/projectile-motion/    # focused experiment workflow
│  ├─ setup/ → calibrate/ → capture/ → processing/ → replay/ → compare/ → explain/
├─ how-it-works/
└─ onboarding/

components/
├─ features/                        # landing page feature sections
│  ├─ PredictionChallenge.tsx       # angle/height/range prediction sliders
│  ├─ PhysicsScoreSection.tsx       # animated score rings + bar fills
│  ├─ TheoryVsRealitySection.tsx    # SVG trajectory comparison (pathLength animation)
│  ├─ ReplaySection.tsx             # frame-by-frame replay with velocity waveform
│  ├─ LabReportSection.tsx          # automated lab report preview (staggerChildren)
│  ├─ RoadmapSection.tsx            # experiment roadmap (1 LIVE + 3 COMING SOON)
│  └─ index.ts                      # barrel export
├─ physics/                         # reusable projectile visualization system
│  ├─ ProjectileScene.tsx           # live lab + replay scene (with "Experiment 1 of 4" tag)
│  ├─ MotionTimeline.tsx
│  ├─ PhysicsGrid.tsx
│  └─ VelocityVector.tsx
├─ landing-experience.tsx           # landing page composition + GSAP hero scroll
├─ kinetix-motion.tsx               # LivePhysicsLab, DataBridge, PhysicsMotion
├─ layout.tsx                       # MarketingHeader, Footer, AppShell
└─ ui.tsx                           # Button, Brand, SectionHeading, Eyebrow

lib/
├─ physics/                         # canonical experiment model and calculations
├─ camera/, tracking/, transport/   # device integration boundaries
├─ ai/, auth/                       # provider boundaries
└─ mock-data.ts                     # compatibility exports

scripts/
└─ screenshot-landing.mjs           # Puppeteer screenshot automation

public/                             # Kinetix logo and loading SVG assets
Docs/                               # product specs, design system, hackathon guide
```

---

## Landing page sections

The landing page is a scroll-driven, cinematic experience built in this order:

| # | Section | Component | Animation |
|---|---------|-----------|-----------|
| 1 | **Hero** | `landing-experience.tsx` | GSAP ScrollTrigger pinned timeline (trajectory draw → velocity vector → HUD counters → data packet → laptop slide-in) |
| 2 | **The Learning Loop** | `landing-experience.tsx` | Framer staggered entrance |
| 3 | **Phone → Laptop Bridge** | `landing-experience.tsx` | Framer slide-in with `LivePhysicsLab` + "Experiment 1 of 4" tag |
| 4 | **Why It Works** | `landing-experience.tsx` | Framer hover lift |
| 5 | **The Roadmap** | `RoadmapSection.tsx` | 4 cards (Projectile Motion LIVE, Free Fall / Pendulum / Collisions COMING SOON) |
| 6 | **Prediction Challenge** | `PredictionChallenge.tsx` | Interactive sliders |
| 7 | **Physics Score** | `PhysicsScoreSection.tsx` | `@property --ring-value` conic-gradient + bar `scaleX` animation |
| 8 | **Theory vs Reality** | `TheoryVsRealitySection.tsx` | `motion.path` `pathLength` draw (blue dashed theory, orange solid reality) |
| 9 | **Replay** | `ReplaySection.tsx` | Velocity waveform + entrance animations |
| 10 | **Lab Report** | `LabReportSection.tsx` | `staggerChildren` variants |
| 11 | **Final CTA** | `landing-experience.tsx` | Static with `--paper` on `--ink` background |

---

## Animation architecture

- **GSAP** (`gsap` + `ScrollTrigger`): Used for the hero pinned scroll sequence. Registered inside `useEffect`, wrapped in `gsap.context()` with `return () => ctx.revert()` cleanup.
- **Framer Motion** (`motion/react`): Used for all section-level entrance animations (`useInView`, `whileInView`, `variants` with `staggerChildren`).
- **`prefers-reduced-motion`**: Both systems check `useReducedMotion()` and render the final static state immediately when motion is reduced.

---

## Design tokens

All tokens live in `app/styles/tokens.css`:

```css
--lime: #b7e33a;      --lime-dark: #9ccb25;
--blue: #3c82f6;      --orange: #f59a3d;
--green: #3baa70;     --ink: #17202a;
--muted: #56616d;     --paper: #f8f8f4;
```

Full design system documentation: [`Docs/Design_System.md`](Docs/Design_System.md)

---

## Connection architecture

The web prototype exposes provider boundaries for the next integration phase:

- `lib/camera/` — browser camera permission/stream lifecycle with a desktop fallback.
- `lib/tracking/` — object-tracker contract with an isolated development tracker.
- `lib/transport/` — phone-to-web connection contract with a development transport.
- `lib/ai/` — structured explanation request/response model and a safe local fallback.
- `lib/auth/` — identity/session types for a future server-backed provider.

These development adapters are intentionally labeled in the UI and do not claim to be production ML, Office Kit, Groq, or authentication services.

---

## Prototype flow

`/` → `/auth/sign-up` → `/onboarding` → `/app` → `/app/experiments/projectile-motion` → setup → calibration → capture → processing → replay → compare → explanation.

The `Docs/` folder remains the product and visual source of truth. The dashboard folder is named for its product role instead of duplicating the Next.js `app` directory name. Rewrites in `next.config.ts` preserve the existing `/app/...` URLs.

---

## Documentation

| File | Purpose |
|------|---------|
| [`Docs/Design_System.md`](Docs/Design_System.md) | Complete design tokens, component patterns, animation principles |
| [`Docs/PROTOTYPE.md`](Docs/PROTOTYPE.md) | Full project documentation and build stats |
| [`Docs/Feature.md`](Docs/Feature.md) | Feature descriptions and hackathon scope |
| [`Docs/Kinetix_PRD_v0.1.md`](Docs/Kinetix_PRD_v0.1.md) | Product requirements document |
| [`Docs/Kinetix_30_Hour_Hackathon_Feature_Plan.md`](Docs/Kinetix_30_Hour_Hackathon_Feature_Plan.md) | Original 30-hour hackathon plan |

---

**Last updated**: August 30, 2026
