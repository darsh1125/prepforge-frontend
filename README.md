# PrepForge Frontend

Web UI for **PrepForge**, an AI-powered interview preparation application.

This repository is the Next.js client only. The API, MongoDB, crawling, LLM orchestration, and the batch evaluator live in a **separate** repository:

https://github.com/darsh1125/prepforge-backend

Do not merge these projects into a monorepo.

## Technology

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Local setup

```bash
cd prepforge-frontend
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

Run the backend in another terminal (`cd prepforge-backend && npm run dev`) so `GET http://localhost:5000/health` is available.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend origin, e.g. `http://localhost:5000` |

Only browser-safe values belong in `NEXT_PUBLIC_*`. Never put MongoDB URIs, session secrets, or LLM keys here.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

UI tests are not configured in Prompt 1. Domain tests live in the backend repo.

## Architecture

```
src/
  app/            routes: /, /dashboard, /kits/new
  components/     shared layout
  features/kits   kit creation placeholder
  lib/api         reusable HTTP client
  types/api.ts    API-facing Appendix A types
```

The API client (`src/lib/api/client.ts`) reads `NEXT_PUBLIC_API_URL`, sends JSON, includes cookies (`credentials: "include"`) for future auth, and surfaces structured errors. Do not scatter raw `fetch` calls.

Frontend must not contain MongoDB access, LLM secrets, crawlers, extraction, coverage, scheduling, or the CLI evaluator.

## Current implementation status (Prompt 1)

Implemented:

- App shell and placeholder pages
- Typed API client + health check
- Appendix A TypeScript types (API-facing copies)

Not implemented:

- login / register / protected routes
- kit generation UI, builder, regeneration, flashcard practice

## Deployment note

Frontend and backend deploy on different origins. CORS on the backend must allow this frontend origin; cookies will require that setup. This app already sends credentials on API requests.
