# Kinetix Frontend

Kinetix is a Next.js prototype for a phone-first Physics Lab. The frontend uses realistic mock experiment data until the phone camera, tracking, Office Kit, and backend integrations are available.


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

## Prototype flow

`/` → `/auth/sign-up` → `/onboarding` → `/app` → `/app/experiments/projectile-motion` → setup → calibration → capture → processing → replay → compare → explanation.

The `Docs/` folder remains the product and visual source of truth. The older `Design-system/` folder is retained as the original static design reference; the running application is implemented in `app/` and `components/`.

## Connection architecture

The web prototype now exposes provider boundaries for the next integration phase:

- `lib/camera/` — browser camera permission/stream lifecycle with a desktop fallback.
- `lib/tracking/` — object-tracker contract with an isolated development tracker.
- `lib/transport/` — phone-to-web connection contract with a development transport.
- `lib/ai/` — structured explanation request/response model and a safe local fallback.
- `lib/auth/` — identity/session types for a future server-backed provider.

These development adapters are intentionally labeled in the UI and do not claim to be production ML, Office Kit, Groq, or authentication services.

# Kinetix

## Project structure

```text
app/
├─ page.tsx                         # marketing landing page
├─ dashboard/                       # learner web app routes (served at /app/*)
├─ auth/                            # sign-in, sign-up, password recovery
├─ experiment/projectile-motion/    # focused experiment workflow
├─ how-it-works/
├─ onboarding/
└─ styles/                          # shared design tokens and page styles
components/
├─ physics/                         # reusable projectile visualization system
├─ experiment/                      # camera capture surface
└─ layout.tsx, ui.tsx               # shared shells and primitives
lib/
├─ physics/                         # canonical experiment model and calculations
├─ camera/, tracking/, transport/   # device integration boundaries
├─ ai/, auth/                       # provider boundaries
└─ mock-data.ts                     # compatibility exports
public/                             # Kinetix logo and loading SVG assets
```

The dashboard folder is named for its product role instead of duplicating the Next.js `app` directory name. Rewrites in `next.config.ts` preserve the existing `/app/...` URLs and links.
