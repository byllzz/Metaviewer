# Metaview

Analyze and preview your website's link previews — Open Graph, Twitter Cards,
and meta tags — across 9+ platforms: Google, X, LinkedIn, Discord, Slack,
WhatsApp, Telegram, Facebook, and iMessage.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Features

- Enter any URL and get an instant score (A–F) across 6 categories
- 35+ individual quality checks (essential tags, Open Graph, Twitter/X,
  images, technical, extras)
- Platform-accurate preview cards showing exactly how the link will render
- Filter previews by Search / Social / Messaging
- Shareable result URLs (`/results/[id]`)
- Fully typed, extensible check engine (`lib/analyzer.ts`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx                 Home page (URL input + marketing sections)
  results/[id]/page.tsx    Results page (score + platform previews)
  api/analyze/route.ts     POST { url } -> fetches, extracts, scores
  api/results/[id]/route.ts GET a stored result (for shareable links)
components/                UI building blocks
lib/
  extract.ts                Fetches a URL and parses its meta tags (cheerio)
  analyzer.ts                Runs the 35+ weighted checks and computes score
  platforms.ts                Platform definitions (Google, X, LinkedIn, ...)
  platformPreview.ts           Resolves per-platform title/description/image
  store.ts                      In-memory result store (swap for a DB in prod)
types/index.ts               Shared TypeScript types
```

## How scoring works

Each check belongs to a category (Essential, Open Graph, Twitter/X, Images,
Technical, Extras) and carries a weight. A check's `pass` status contributes
its weight to that category's earned score. The total score is the earned
points divided by the possible points, mapped to a letter grade:

| Score | Grade |
| ----- | ----- |
| 90+   | A     |
| 75+   | B     |
| 60+   | C     |
| 40+   | D     |
| <40   | F     |

Add or tune checks in `lib/analyzer.ts` — each is a small, isolated function
that takes the extracted meta and returns a status + message.

## Notes on the in-memory store

`lib/store.ts` keeps analyzed results in memory for the life of the server
process, which is enough for local development and demos. For production,
swap it for Redis, Vercel KV, or a database so shareable links survive
restarts and work across multiple server instances.

## Deploying

Works out of the box on [Vercel](https://vercel.com):

```bash
npm run build
```

## License

MIT
