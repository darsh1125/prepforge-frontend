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

## Current implementation status (Prompt 10)

Implemented:

- App shell with authenticated navigation
- Typed API client + health check
- Appendix A TypeScript types (API-facing copies)
- HTTP-only cookie auth with login, registration, logout, and session restoration
- Protected dashboard, kit creation, and kit detail pages
- User-scoped kit creation, listing, viewing, and deletion UI
- Kit detail research action with public interview source links, counts, and warning states
- Kit detail role analysis with title, seniority, responsibilities, and labeled JD requirements
- Kit detail generated questions grouped by category with difficulty and requirement references
- Kit detail deterministic coverage display with uncovered requirement warnings and pass counts
- Flashcard generation action and grounded flashcard display
- Deterministic study schedule action with exact-day rendering, focus, minutes, and question IDs
- One-click Generate Prep Kit action with staged progress and backend polling
- Refresh-safe active generation state, warnings, failure messaging, and retry action
- Local-draft Kit Builder for company brief, questions, flashcards, pinning, add/delete, category/difficulty/reference edits, and question reorder
- Explicit Save/Cancel controls; no API request is made per keystroke
- Revision-aware builder refresh with conflict/error feedback and deterministic coverage/schedule state display

Not implemented:

- Practice mode, regeneration, and final batch evaluator UI

Flashcards and schedules use separate protected API actions, while Generate Prep Kit starts the canonical backend pipeline. The detail page polls every two seconds during active generation, reconstructs state after refresh, renders aggregated warnings, and exposes retry after failure. Flashcard errors are shown without removing existing content; schedule errors preserve flashcards and prior kit data. The UI renders every returned schedule day, including repeated review days for long study windows.

Builder saves send one explicit mutation after the user confirms an edit. The backend returns the complete updated builder state and revision, so the page replaces local state atomically and can recover after refresh.

## Deployment note

Frontend and backend deploy on different origins. CORS on the backend must allow this frontend origin; cookies will require that setup. This app already sends credentials on API requests.
