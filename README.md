# Metaviewer

Link preview / meta tag analyzer (Open Graph, Twitter Cards, SEO tags) — see
how your links will actually look before you share them.

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

1. Homepage (`app/page.tsx`) — URL input, recent-analysis section, how-it-works,
   feature grid, supported-platforms list, CTA, and FAQ
2. Analyze API (`app/api/analyze/route.ts`) — fetch + parse + score, no persistence
3. Meta extraction (`lib/extract.ts`) — title, description, canonical, favicon,
   OG/Twitter tags, real decoded image dimensions (`lib/imageDimensions.ts`),
   robots.txt/sitemap.xml checks, security headers, JSON-LD structured data,
   blocks localhost/private IPs
4. Scoring engine (`lib/analyzer.ts`) — 40+ checks across 6 categories, 0–100
   score + A–F grade, with a per-check fix suggestion (`lib/checkFixes.ts`)
5. Results page (`app/results/[id]/page.tsx`) — animated tabs: Previews, Basic,
   Open Graph, X/Twitter, Images, Raw, Score
6. Platform previews (`components/PlatformPreviewCard.tsx`, `lib/platformPreview.ts`) — 9 platforms
7. Local history (`lib/localHistory.ts`, `app/history/page.tsx`,
   `components/RecentAnalysis.tsx`) — every check saved in localStorage, no
   account needed; recent checks also surface on the homepage
8. Copy-paste fix snippets — inline in the Open Graph and X/Twitter result
   tabs (`components/results/CodeFixBlock.tsx`) for missing required tags
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
- `lib/checkFixes.ts` — fix suggestion text per check
- `lib/extract.ts` — server-side fetch + parse
- `lib/imageDimensions.ts` — dependency-free image header parser
- `lib/platforms.ts` — platform list
- `lib/localHistory.ts` — client-side persistence layer (swap for Supabase here)
- `components/PlatformPreviewCard.tsx` — platform preview UI
- `components/results/` — one file per results-page tab

See `AI_HANDOFF.md` for a fuller architecture write-up and known gaps.
