@AGENTS.md

# Project: Canada Trivia Generator (SaaS)

A fullstack SaaS app that streams AI-generated Canadian history trivia to authenticated users. Frontend is Next.js (Pages Router) deployed on Vercel; backend is a FastAPI serverless function at `api/index.py`, also hosted on Vercel.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16 — **Pages Router** (not App Router) |
| UI library | React 19, Tailwind CSS 4, `@tailwindcss/typography` |
| Auth | Clerk (`@clerk/nextjs` v6) |
| Streaming | Server-Sent Events via `@microsoft/fetch-event-source` |
| Markdown | `react-markdown` + `remark-gfm` + `remark-breaks` |
| Backend | FastAPI (Python), `fastapi-clerk-auth`, OpenAI SDK |
| AI model | OpenAI `gpt-4o-mini` (currently `gpt-5-nano` in code) |
| Deployment | Vercel (both Next.js and the FastAPI serverless function) |

## Project Structure

```
saas/
├── api/
│   └── index.py          # FastAPI backend — /api endpoint, SSE streaming, Clerk JWT auth
├── pages/
│   ├── _app.tsx          # ClerkProvider wraps the entire app
│   ├── _document.tsx     # <head> title and meta tags
│   ├── index.tsx         # Landing/sign-in page
│   └── product.tsx       # Authenticated product page — triggers SSE stream
├── styles/
│   └── globals.css       # Tailwind entry point + prose/markdown styles
├── requirements.txt      # Python deps for the FastAPI function
├── next.config.ts
└── tsconfig.json
```

## Key Patterns & Conventions

### Pages Router
This project uses the **Pages Router**, not the App Router. Do not use `app/` directory conventions, `use client`/`use server` directives, or App Router APIs (`next/navigation`, `metadata` exports, etc.).

### Authentication (Clerk)
- `<ClerkProvider>` is in `pages/_app.tsx` — do not add it elsewhere.
- Protect pages with Clerk's `<Protect>` component or `useAuth()` hook.
- The FastAPI backend validates the Clerk JWT sent as a `Bearer` token. On the frontend, retrieve the token with `await getToken()` from `useAuth()`.
- Token expiry is handled by catching HTTP 401 and refreshing via `getToken({ skipCache: true })`.

### SSE Streaming
- Frontend uses `fetchEventSource` (NOT native `EventSource`) so headers (Authorization) can be sent.
- Backend yields `data: ...\n\n` formatted chunks. Each `\n` in the AI stream is replaced with `<br>` before sending.

### Styling
- Tailwind CSS v4 — use the new CSS-first config (`@import "tailwindcss"` in globals.css, no `tailwind.config.js`).
- Markdown output is rendered inside a `prose` class container; custom prose styles live in `globals.css`.

### Environment Variables
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=   # exposed to browser
CLERK_SECRET_KEY=                    # server-side only
CLERK_JWKS_URL=                      # used by fastapi-clerk-auth to validate JWTs
OPENAI_API_KEY=                      # server-side only, used in api/index.py
```
Never commit `.env.local`. Add new server-side vars to Vercel project settings.

## Development

```bash
# Install JS deps
npm install

# Install Python deps (for local FastAPI testing)
pip install -r requirements.txt

# Run Next.js dev server (frontend only)
npm run dev

# Run FastAPI locally (separate terminal)
uvicorn api.index:app --reload
```

The Vercel CLI (`vercel dev`) runs both simultaneously and is the most accurate local environment.

## Deployment (Vercel)

- **Frontend:** auto-deployed from the `main` branch on push.
- **Backend:** `api/index.py` is picked up by Vercel as a Python serverless function automatically — no extra config needed.
- Set all environment variables (see above) in the Vercel project dashboard under Settings → Environment Variables.
- Do **not** hard-code secrets or API keys anywhere in the codebase.

## Before Writing Code

- Read `node_modules/next/dist/docs/` for the exact Next.js 16 API before using any Next.js feature.
- The FastAPI function runs in a serverless context — avoid global mutable state and long-lived connections.
- Keep the `api/index.py` endpoint stateless; any per-user persistence should use an external store.
