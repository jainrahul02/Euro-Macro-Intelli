# EuroPulse AI

AI-powered EU macro intelligence dashboard for Deutsche Bank — monitors inflation, sovereign risk, forex, and geopolitical events across Europe, with scenario simulation and AI-generated portfolio insights.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/europulse-ai run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Recharts, react-simple-maps, Framer Motion, wouter
- API: Express 5 (artifact: api-server)
- Validation: Zod (zod/v4), API codegen via Orval (OpenAPI-first)
- No database — all data served from mock data in `artifacts/api-server/src/routes/mockData.ts`

## Where Things Live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `artifacts/api-server/src/routes/mockData.ts` — all mock data (EU country risk, news, forecasts, scenarios)
- `artifacts/api-server/src/routes/` — Express route handlers (dashboard, news, risk, forecast, simulator, sidebar)
- `artifacts/europulse-ai/src/pages/` — React pages (Dashboard, News, Risk Radar, Forecast, Simulator)

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | KPI cards, alerts feed, Europe risk heatmap |
| `/news` | News | AI-analyzed news feed with severity filtering |
| `/risk` | Risk Radar | Interactive Europe map + country risk rankings |
| `/forecast` | Forecast | 4 economic forecasts with Recharts line charts |
| `/simulator` | Simulator | Scenario shock simulator with transmission flow |

The right panel (AI Insights) is persistent across all pages, powered by `/api/sidebar/insight?page=<current>`.

## Architecture Decisions

- **No database**: All data is rich mock data in `mockData.ts`. Replacing with real data requires only updating the mock exports.
- **OpenAPI-first**: All types are generated from `lib/api-spec/openapi.yaml` via Orval. Never hand-write types the codegen produces.
- **Mock simulation engine**: The simulator computes dynamic results from `intensity` input via formula functions in `simulationResults` map.
- **Sidebar context**: The AI insights panel reads the current route and passes it as `?page=` to the sidebar endpoint — insights are page-specific.

## User Preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `mockData.ts` uses relative `.js` imports in ESM routes — keep the `.js` extension on import paths.
- Timestamps in mock data are human-readable strings ("2h ago", "May 20, 2025 09:15 CET") — don't wrap them in `new Date()`.
- Orval body schema names must be entity-shaped (e.g. `SimulationInput`), never operation-shaped (e.g. `RunSimulationBody`) to avoid TS2308 collisions.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `lib/api-spec/openapi.yaml` for the full API contract
