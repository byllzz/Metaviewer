# Metaview

Link preview / meta tag analyzer (Open Graph, Twitter Cards, SEO tags).

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, cheerio.

## Architecture

- **No backend database.** The one API route (`app/api/analyze/route.ts`) only
  fetches a URL server-side and parses/scores its meta tags — that hop is
  required because browsers block cross-origin `fetch` of arbitrary HTML
  (CORS). It returns the result and stores nothing.
- **All persistence is client-side**, in `lib/localHistory.ts`, backed by
  `localStorage`: every analyzed result, your check history, and your theme
  preference. Every function in that file is a thin wrapper (`saveResult`,
  `getResult`, `getHistory`, …) so swapping in Supabase later is a matter of
  replacing the bodies of those functions — the rest of the app doesn't need
  to change.
  - Known limitation: results are only visible in the browser that ran the
    check. A shared `/results/[id]` link won't resolve on another
    device/browser until you wire up real storage.

## Features

1. Homepage (`app/page.tsx`) — URL input, examples, feature grid, FAQ
2. Analyze API (`app/api/analyze/route.ts`) — fetch + parse + score, no persistence
3. Meta extraction (`lib/extract.ts`) — title, description, canonical, favicon, OG/Twitter tags, OG image HEAD check, blocks localhost/private IPs
4. Scoring engine (`lib/analyzer.ts`) — 35+ checks across 6 categories, 0–100 score + A–F grade
5. Results page (`app/results/[id]/page.tsx`) — score ring, category bars, filterable platform preview grid
6. Platform previews (`components/PlatformPreviewCard.tsx`, `lib/platformPreview.ts`) — 9 platforms
7. Local history (`lib/localHistory.ts`, `app/history/page.tsx`) — every check saved in localStorage, no account needed
8. Copy-paste fix snippets (`components/FixSnippets.tsx`, `lib/fixSnippets.ts`) — Next.js, Astro, Hugo, plain HTML
9. Export (`components/ExportMenu.tsx`, `lib/exportResult.ts`) — JSON, CSV, raw HTML tags, and a PNG score card
10. Share button — copies the result URL to the clipboard
11. Re-analyze — re-runs the check against the same URL and swaps in the fresh result
12. Dark/light theme toggle (`components/ThemeToggle.tsx`) — persisted, no flash on load

## Run locally

```bash
npm install
npm run dev
```

## Key files

- `types/index.ts` — shared types
- `lib/analyzer.ts` — scoring checks
- `lib/platforms.ts` — platform list
- `lib/localHistory.ts` — client-side persistence layer (swap for Supabase here)
- `components/PlatformPreviewCard.tsx` — platform preview UI
