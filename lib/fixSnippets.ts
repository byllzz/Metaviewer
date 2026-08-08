import type { AnalysisResult, ExtractedMeta } from "@/types";

export type SnippetFramework = "html" | "nextjs" | "astro" | "hugo";

function domainOf(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

interface Tag {
  title: string;
  description: string;
  canonical: string;
  themeColor: string;
  ogImage: string;
  twitterCard: string;
  siteName: string;
}

function resolveTags(meta: ExtractedMeta): Tag {
  const origin = domainOf(meta.finalUrl);
  return {
    title: meta.title ?? "Your page title here",
    description: meta.description ?? "A concise, compelling description of this page (under 160 characters).",
    canonical: meta.canonical ?? meta.finalUrl,
    themeColor: meta.themeColor ?? "#0a0a0a",
    ogImage: meta.og["og:image"] ?? `${origin}/og-image.png`,
    twitterCard: meta.twitter["twitter:card"] ?? "summary_large_image",
    siteName: meta.og["og:site_name"] ?? "",
  };
}

export function generateSnippet(result: AnalysisResult, framework: SnippetFramework): string {
  const t = resolveTags(result.meta);

  if (framework === "html") {
    return `<title>${t.title}</title>
<meta name="description" content="${t.description}" />
<link rel="canonical" href="${t.canonical}" />
<meta name="theme-color" content="${t.themeColor}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${t.title}" />
<meta property="og:description" content="${t.description}" />
<meta property="og:image" content="${t.ogImage}" />
<meta property="og:url" content="${t.canonical}" />${t.siteName ? `\n<meta property="og:site_name" content="${t.siteName}" />` : ""}

<!-- Twitter Card -->
<meta name="twitter:card" content="${t.twitterCard}" />
<meta name="twitter:title" content="${t.title}" />
<meta name="twitter:description" content="${t.description}" />
<meta name="twitter:image" content="${t.ogImage}" />`;
  }

  if (framework === "nextjs") {
    return `// app/layout.tsx or app/page.tsx (App Router)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${t.title}",
  description: "${t.description}",
  alternates: {
    canonical: "${t.canonical}",
  },
  themeColor: "${t.themeColor}",
  openGraph: {
    type: "website",
    title: "${t.title}",
    description: "${t.description}",
    url: "${t.canonical}",
    images: ["${t.ogImage}"],${t.siteName ? `\n    siteName: "${t.siteName}",` : ""}
  },
  twitter: {
    card: "${t.twitterCard}",
    title: "${t.title}",
    description: "${t.description}",
    images: ["${t.ogImage}"],
  },
};`;
  }

  if (framework === "astro") {
    return `---
// src/layouts/BaseLayout.astro (frontmatter)
const title = "${t.title}";
const description = "${t.description}";
const canonical = "${t.canonical}";
const ogImage = "${t.ogImage}";
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<meta name="theme-color" content="${t.themeColor}" />

<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:url" content={canonical} />

<meta name="twitter:card" content="${t.twitterCard}" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />`;
  }

  // hugo
  return `<!-- layouts/partials/head.html -->
<title>{{ "${t.title}" }}</title>
<meta name="description" content="${t.description}">
<link rel="canonical" href="${t.canonical}">
<meta name="theme-color" content="${t.themeColor}">

<meta property="og:type" content="website">
<meta property="og:title" content="{{ .Title }}">
<meta property="og:description" content="${t.description}">
<meta property="og:image" content="${t.ogImage}">
<meta property="og:url" content="{{ .Permalink }}">

<meta name="twitter:card" content="${t.twitterCard}">
<meta name="twitter:title" content="{{ .Title }}">
<meta name="twitter:description" content="${t.description}">
<meta name="twitter:image" content="${t.ogImage}">`;
}
