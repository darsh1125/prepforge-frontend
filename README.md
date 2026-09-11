# PrepForge Frontend

PrepForge is an AI interview-preparation workspace. A user supplies a job description, a company website, and the number of preparation days. The frontend sends those inputs to the separate backend and displays the generated preparation kit.

## Live Application

- Frontend: https://prepforge-frontend.netlify.app
- Backend API: https://prepforge-backend-pha6.onrender.com
- Frontend repository: https://github.com/darsh1125/prepforge-frontend
- Backend repository: https://github.com/darsh1125/prepforge-backend

The frontend is hosted on Netlify. The API and database-backed generation pipeline are hosted separately.

## Technology

The versions are defined in `package.json`:

- Next.js `16.3.4` with the App Router
- React `19.2.8`
- TypeScript `^5`
- Tailwind CSS `^4`

Next.js supplies routing and the production server, React supplies client state for interactive flows, TypeScript keeps API contracts explicit, and Tailwind provides responsive utility styling without putting backend concerns in the browser.

## Features

### Authentication

- Registration, login, logout, and session restoration
- HTTP-only cookie authentication through the backend
- Protected dashboard, kit, builder, and practice routes
- Redirect to `/login` when signed out; signed-in users entering `/` are sent to `/dashboard`

### Kit workflow

The UI supports:

1. Creating a kit from a job description, company URL, and 1-60 preparation days.
2. Starting the canonical generation pipeline.
3. Viewing progress, warnings, partial research, failures, and retry actions.
4. Viewing the company brief, extracted role and requirements, categorized questions, answer outlines, coverage, flashcards, and study schedule.
5. Reopening and deleting owned kits from the dashboard.

The detail page polls every two seconds during active generation, so a refresh can recover the server-owned progress state.

### Builder and regeneration

The protected builder provides explicit Save/Cancel editing for:

- Company brief summary and `what_they_do`
- Question prompt, answer outline, category, difficulty, and requirement references
- Flashcard front, back, and requirement references
- Adding and deleting questions and flashcards
- Pinning items and reordering questions
- Regenerating the company brief, an individual question category, or the deterministic schedule

Mutations are sent only after an explicit action. The backend returns the updated revision and builder state; the frontend replaces its local state atomically. Revision conflicts and provider failures are shown as errors.

Question and flashcard editor metadata is separate from the Appendix A-shaped kit data. The backend metadata uses `origin`, `edited`, `pinned`, `order`, and stable internal IDs. Regeneration preserves user-created, edited, and pinned questions; untouched generated items may be replaced.

### Practice mode

`/kits/[id]/practice` presents one flashcard at a time. The user can reveal the answer, choose `Needs work`, `Getting there`, or `Confident`, and continue through the session. Confidence and practice counts are persisted by the backend. Later sessions prioritize unpracticed and weaker cards. Space/Enter reveals a card and keys 1, 2, and 3 record confidence after reveal.

### Responsive and accessible behavior

The UI uses responsive grid and flex layouts for phone and laptop widths, native form controls, semantic headings, `role="status"` loading states, `role="alert"` errors, disabled states, focus-visible outlines, and keyboard handling in practice mode. There is no separate automated browser test suite in this repository; domain and API behavior is tested in the backend repository.

## Architecture

```text
src/
  app/
    (site)/                 App Router pages and protected workflows
  components/
    layout/                 Header, shell, and shared application chrome
  features/
    auth/                   AuthProvider, forms, and route protection
    kits/                   Kit creation and builder interactions
  lib/
    api/                    Typed HTTP client and kit/health requests
    env.ts                  Browser-safe API base URL resolution
    uiCopy.ts               API error presentation text
  types/
    api.ts                  Frontend copies of API-facing data contracts
```

`AuthProvider` owns session state. `RequireAuth` protects client routes. `src/lib/api/client.ts` is the only reusable HTTP boundary and sends `credentials: "include"` for cross-origin cookies. The frontend does not access MongoDB, the LLM, crawlers, retrieval, coverage logic, scheduling logic, or evaluator code.

## Local Setup

```bash
git clone https://github.com/darsh1125/prepforge-frontend.git
cd prepforge-frontend
npm ci
```

Create `.env.local` from `.env.example`:

Windows:

```powershell
copy .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Open http://localhost:3000. Run the backend separately on port 5000. `NEXT_PUBLIC_API_URL` is the backend origin without a trailing slash; it is the only frontend environment variable required.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

## Deployment

Deploy this repository as a Next.js site on Netlify. Set this production environment variable in Netlify:

```env
NEXT_PUBLIC_API_URL=https://prepforge-backend-pha6.onrender.com
```

Do not place `MONGODB_URI`, `SESSION_SECRET`, `LLM_API_KEY`, or `SEARCH_API_KEY` in the frontend environment. Those belong only in the backend host configuration. The backend must set `WEB_ORIGIN=https://prepforge-frontend.netlify.app` and allow credentialed requests from that exact origin.

## Known Limitations

- Public interview research is optional and can produce warnings when no search key is configured or sources cannot be fetched.
- Render free-tier cold starts can make the first API request slow.
- There is no frontend end-to-end test runner in this repository.
- The batch evaluator is intentionally backend-only and is documented in the backend README.
