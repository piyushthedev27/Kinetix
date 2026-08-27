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
