# Canada Trivia Generator

A fullstack SaaS app that streams AI-generated Canadian history trivia to authenticated users in real time.

## Tech Stack

- **Frontend:** Next.js 16 (Pages Router), React 19, Tailwind CSS 4
- **Auth:** Clerk
- **Backend:** FastAPI (Python) — serverless function at `api/index.py`
- **AI:** OpenAI API with streaming
- **Streaming:** Server-Sent Events (SSE)
- **Deployment:** Vercel

## Project Structure

```
saas/
├── api/
│   └── index.py          # FastAPI backend — /api, SSE streaming, Clerk JWT auth
├── pages/
│   ├── _app.tsx          # ClerkProvider
│   ├── _document.tsx     # <head> / meta tags
│   ├── index.tsx         # Landing + sign-in page
│   └── product.tsx       # Authenticated product page (SSE consumer)
├── styles/
│   └── globals.css       # Tailwind + markdown/prose styles
└── requirements.txt      # Python dependencies
```

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.10+
- A [Clerk](https://clerk.com) account
- An OpenAI API key

### Setup

1. **Install dependencies**

   ```bash
   npm install
   pip install -r requirements.txt
   ```

2. **Configure environment variables**

   Create a `.env.local` file at the project root:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   CLERK_JWKS_URL=https://<your-clerk-domain>/.well-known/jwks.json
   OPENAI_API_KEY=sk-...
   ```

3. **Run the dev server**

   Use the Vercel CLI for the most accurate local environment (runs Next.js + FastAPI together):

   ```bash
   vercel dev
   ```

   Or run them separately:

   ```bash
   # Terminal 1 — Next.js
   npm run dev

   # Terminal 2 — FastAPI
   uvicorn api.index:app --reload
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. User signs in via Clerk on the landing page.
2. On the product page, the frontend requests a Clerk JWT and opens an SSE connection to `GET /api` with an `Authorization: Bearer <token>` header.
3. The FastAPI backend validates the JWT, extracts the user ID, and streams an OpenAI response chunk-by-chunk back to the client.
4. The frontend renders each chunk as it arrives using `react-markdown`.

## Deployment

This project is deployed on Vercel.

- The Next.js frontend is deployed automatically on push to `main`.
- `api/index.py` is automatically detected by Vercel as a Python serverless function — no extra configuration required.
- Add all environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

## Available Scripts

```bash
npm run dev      # Start Next.js development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
