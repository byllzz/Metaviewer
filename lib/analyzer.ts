import type {
  AnalysisResult,
  CategoryScore,
  CheckCategory,
  ExtractedMeta,
  Grade,
  MetaCheck,
} from "@/types";
import { CHECK_FIXES } from "@/lib/checkFixes";

interface CheckDef {
  id: string;
  label: string;
  category: CheckCategory;
  weight: number; // points if passed
  evaluate: (meta: ExtractedMeta) => Omit<MetaCheck, "id" | "label" | "category">;
}

const CATEGORY_LABELS: Record<CheckCategory, string> = {
  essential: "Essential",
  opengraph: "Open Graph",
  twitter: "Twitter/X",
  images: "Images",
  technical: "Technical",
  extras: "Extras",
};

function statusFrom(
  pass: boolean,
  message: string,
  value?: string
): Omit<MetaCheck, "id" | "label" | "category"> {
  return { status: pass ? "pass" : "error", message, value };
}

const CHECKS: CheckDef[] = [
  // ---- Essential (25 pts) ----
  {
    id: "title-present",
    label: "Title tag present",
    category: "essential",
    weight: 5,
    evaluate: (m) =>
      statusFrom(!!m.title, m.title ? "Title tag found." : "Missing <title> tag.", m.title),
  },
  {
    id: "title-length",
    label: "Title length is optimal",
    category: "essential",
    weight: 4,
    evaluate: (m) => {
      const len = m.title?.length ?? 0;
      if (!m.title) return { status: "error", message: "No title to measure." };
      if (len >= 15 && len <= 60)
        return { status: "pass", message: `Title is ${len} characters — a good length.` };
      return {
        status: "warning",
        message: `Title is ${len} characters. Aim for 15–60 for best display.`,
      };
    },
  },
  {
    id: "description-present",
    label: "Meta description present",
    category: "essential",
    weight: 5,
    evaluate: (m) =>
      statusFrom(
        !!m.description,
        m.description ? "Meta description found." : "Missing meta description.",
        m.description
      ),
  },
  {
    id: "description-length",
    label: "Description length is optimal",
    category: "essential",
    weight: 3,
    evaluate: (m) => {
      const len = m.description?.length ?? 0;
      if (!m.description) return { status: "error", message: "No description to measure." };
      if (len >= 50 && len <= 160)
        return { status: "pass", message: `Description is ${len} characters — good length.` };
      return {
        status: "warning",
        message: `Description is ${len} characters. Aim for 50–160.`,
      };
    },
  },
  {
    id: "canonical-present",
    label: "Canonical URL present",
    category: "essential",
    weight: 3,
    evaluate: (m) =>
      statusFrom(!!m.canonical, m.canonical ? "Canonical URL set." : "Missing canonical link tag.", m.canonical),
  },
  {
    id: "favicon-present",
    label: "Favicon present",
    category: "essential",
    weight: 2,
    evaluate: (m) => statusFrom(!!m.favicon, "Favicon reference found.", m.favicon),
  },
  {
    id: "lang-present",
    label: "HTML lang attribute set",
    category: "essential",
    weight: 1,
    evaluate: (m) =>
      statusFrom(!!m.lang, m.lang ? `Language set to "${m.lang}".` : "Missing lang attribute on <html>.", m.lang),
  },
  {
    id: "viewport-present",
    label: "Viewport meta tag present",
    category: "essential",
    weight: 2,
    evaluate: (m) => statusFrom(!!m.viewport, "Viewport tag found.", m.viewport),
  },

  // ---- Open Graph (20 pts) ----
  {
    id: "og-title",
    label: "og:title present",
    category: "opengraph",
    weight: 4,
    evaluate: (m) => statusFrom(!!m.og["og:title"], m.og["og:title"] ? "og:title present." : "Missing og:title.", m.og["og:title"]),
  },
  {
    id: "og-description",
    label: "og:description present",
    category: "opengraph",
    weight: 3,
    evaluate: (m) =>
      statusFrom(!!m.og["og:description"], m.og["og:description"] ? "og:description present." : "Missing og:description.", m.og["og:description"]),
  },
  {
    id: "og-image",
    label: "og:image present",
    category: "opengraph",
    weight: 5,
    evaluate: (m) =>
      statusFrom(!!m.og["og:image"], m.og["og:image"] ? "og:image present." : "Missing og:image — most platforms need this for a rich preview.", m.og["og:image"]),
  },
  {
    id: "og-url",
    label: "og:url present",
    category: "opengraph",
    weight: 2,
    evaluate: (m) => statusFrom(!!m.og["og:url"], m.og["og:url"] ? "og:url present." : "Missing og:url.", m.og["og:url"]),
  },
  {
    id: "og-type",
    label: "og:type present",
    category: "opengraph",
    weight: 2,
    evaluate: (m) => statusFrom(!!m.og["og:type"], m.og["og:type"] ? `og:type is "${m.og["og:type"]}".` : "Missing og:type.", m.og["og:type"]),
  },
  {
    id: "og-site-name",
    label: "og:site_name present",
    category: "opengraph",
    weight: 2,
    evaluate: (m) =>
      statusFrom(!!m.og["og:site_name"], m.og["og:site_name"] ? "og:site_name present." : "Missing og:site_name.", m.og["og:site_name"]),
  },
  {
    id: "og-locale",
    label: "og:locale present",
    category: "opengraph",
    weight: 1,
    evaluate: (m) => statusFrom(!!m.og["og:locale"], m.og["og:locale"] ? "og:locale present." : "Missing og:locale (optional).", m.og["og:locale"]),
  },
  {
    id: "og-image-dims",
    label: "og:image width/height declared",
    category: "opengraph",
    weight: 1,
    evaluate: (m) => {
      const has = !!m.og["og:image:width"] && !!m.og["og:image:height"];
      return statusFrom(has, has ? "Image dimensions declared." : "Declare og:image:width/height to avoid layout shift on some platforms.");
    },
  },

  // ---- Twitter / X (15 pts) ----
  {
    id: "twitter-card",
    label: "twitter:card present",
    category: "twitter",
    weight: 5,
    evaluate: (m) =>
      statusFrom(!!m.twitter["twitter:card"], m.twitter["twitter:card"] ? `twitter:card is "${m.twitter["twitter:card"]}".` : "Missing twitter:card — X will fall back to a plain link.", m.twitter["twitter:card"]),
  },
  {
    id: "twitter-title",
    label: "twitter:title present",
    category: "twitter",
    weight: 3,
    evaluate: (m) => {
      const value = m.twitter["twitter:title"] || m.og["og:title"];
      return statusFrom(!!value, value ? "Twitter title resolved (from twitter:title or og:title)." : "Missing twitter:title and og:title fallback.", value);
    },
  },
  {
    id: "twitter-description",
    label: "twitter:description present",
    category: "twitter",
    weight: 3,
    evaluate: (m) => {
      const value = m.twitter["twitter:description"] || m.og["og:description"];
      return statusFrom(!!value, value ? "Twitter description resolved." : "Missing twitter:description and og:description fallback.", value);
    },
  },
  {
    id: "twitter-image",
    label: "twitter:image present",
    category: "twitter",
    weight: 3,
    evaluate: (m) => {
      const value = m.twitter["twitter:image"] || m.og["og:image"];
      return statusFrom(!!value, value ? "Twitter image resolved." : "Missing twitter:image and og:image fallback.", value);
    },
  },
  {
    id: "twitter-site",
    label: "twitter:site present",
    category: "twitter",
    weight: 1,
    evaluate: (m) => statusFrom(!!m.twitter["twitter:site"], m.twitter["twitter:site"] ? "twitter:site present." : "Missing twitter:site (optional attribution).", m.twitter["twitter:site"]),
  },

  // ---- Images (20 pts) ----
  {
    id: "image-loads",
    label: "og:image is reachable",
    category: "images",
    weight: 8,
    evaluate: (m) => {
      if (!m.og["og:image"]) return { status: "error", message: "No og:image to check." };
      const ok = !!m.ogImage;
      return statusFrom(ok, ok ? "Image loaded successfully." : "Image URL could not be fetched.", m.ogImage?.url);
    },
  },
  {
    id: "image-size",
    label: "Image file size is reasonable",
    category: "images",
    weight: 4,
    evaluate: (m) => {
      const bytes = m.ogImage?.bytes;
      if (!bytes) return { status: "warning", message: "Couldn't determine image file size." };
      const kb = Math.round(bytes / 1024);
      if (kb <= 5000) return { status: "pass", message: `Image is ${kb} KB.` };
      return { status: "warning", message: `Image is ${kb} KB — consider compressing (5MB is the practical limit for most platforms).` };
    },
  },
  {
    id: "image-aspect-ratio",
    label: "Image aspect ratio near 1.91:1",
    category: "images",
    weight: 4,
    evaluate: (m) => {
      const { width, height } = m.ogImage ?? {};
      if (!width || !height) return { status: "warning", message: "Image dimensions unknown — declare og:image:width/height." };
      const ratio = width / height;
      const target = 1.91;
      if (Math.abs(ratio - target) < 0.25)
        return { status: "pass", message: `Aspect ratio ${ratio.toFixed(2)}:1 is close to the recommended 1.91:1.` };
      return { status: "warning", message: `Aspect ratio ${ratio.toFixed(2)}:1 differs from the recommended 1.91:1 and may be cropped.` };
    },
  },
  {
    id: "image-min-size",
    label: "Image meets minimum recommended size",
    category: "images",
    weight: 4,
    evaluate: (m) => {
      const { width, height } = m.ogImage ?? {};
      if (!width || !height) return { status: "warning", message: "Image dimensions unknown." };
      const ok = width >= 600 && height >= 315;
      return statusFrom(ok, ok ? `${width}×${height} meets the 600×315 minimum.` : `${width}×${height} is below the recommended 600×315 minimum.`);
    },
  },

  // ---- Technical (11 pts) ----
  {
    id: "https",
    label: "Served over HTTPS",
    category: "technical",
    weight: 4,
    evaluate: (m) => statusFrom(m.finalUrl.startsWith("https://"), m.finalUrl.startsWith("https://") ? "Site is served over HTTPS." : "Site is not served over HTTPS."),
  },
  {
    id: "charset",
    label: "Charset declared",
    category: "technical",
    weight: 2,
    evaluate: (m) => statusFrom(!!m.charset, m.charset ? `Charset declared as ${m.charset}.` : "No charset declared."),
  },
  {
    id: "robots-not-blocking",
    label: "Not blocked by robots meta",
    category: "technical",
    weight: 3,
    evaluate: (m) => {
      const blocked = /noindex/i.test(m.robots ?? "");
      return statusFrom(!blocked, blocked ? "Page is marked noindex — some crawlers may skip preview generation." : "Page is indexable.");
    },
  },
  {
    id: "theme-color",
    label: "theme-color present",
    category: "technical",
    weight: 2,
    evaluate: (m) => statusFrom(!!m.themeColor, m.themeColor ? "theme-color present (used by Discord embeds)." : "No theme-color set.", m.themeColor),
  },
  {
    id: "no-redirect-chain",
    label: "No redirect chain",
    category: "technical",
    weight: 2,
    evaluate: (m) =>
      statusFrom(!m.redirected, m.redirected ? "URL redirects before resolving — point tags at the final URL." : "URL resolves directly without redirects."),
  },
  {
    id: "response-time",
    label: "Fast response time",
    category: "technical",
    weight: 2,
    evaluate: (m) => {
      if (m.loadTimeMs <= 800) return { status: "pass", message: `Page responds quickly (${m.loadTimeMs}ms).` };
      if (m.loadTimeMs <= 2000) return { status: "warning", message: `Page took ${m.loadTimeMs}ms to respond.` };
      return { status: "error", message: `Page took ${m.loadTimeMs}ms to respond — slow crawlers may time out.` };
    },
  },
  {
    id: "sitemap",
    label: "sitemap.xml found",
    category: "technical",
    weight: 1,
    evaluate: (m) =>
      statusFrom(!!m.sitemap.found, m.sitemap.found ? `Sitemap found${m.sitemap.urlCount ? ` (${m.sitemap.urlCount} URLs)` : ""}.` : "No sitemap.xml found at the root."),
  },
  {
    id: "security-headers",
    label: "Security headers present",
    category: "technical",
    weight: 2,
    evaluate: (m) => {
      const values = Object.values(m.securityHeaders);
      const count = values.filter(Boolean).length;
      if (count === values.length) return { status: "pass", message: "Good security headers (SSL)." };
      if (count === 0) return { status: "warning", message: "No common security headers detected." };
      return { status: "warning", message: `${count}/${values.length} common security headers detected.` };
    },
  },

  // ---- Extras (10 pts) ----
  {
    id: "og-image-alt",
    label: "og:image:alt present",
    category: "extras",
    weight: 3,
    evaluate: (m) => statusFrom(!!m.og["og:image:alt"], m.og["og:image:alt"] ? "og:image:alt present — good for accessibility." : "Missing og:image:alt.", m.og["og:image:alt"]),
  },
  {
    id: "twitter-image-alt",
    label: "twitter:image:alt present",
    category: "extras",
    weight: 2,
    evaluate: (m) =>
      statusFrom(!!m.twitter["twitter:image:alt"], m.twitter["twitter:image:alt"] ? "twitter:image:alt present." : "Missing twitter:image:alt.", m.twitter["twitter:image:alt"]),
  },
  {
    id: "article-tags",
    label: "Article/OG extra metadata",
    category: "extras",
    weight: 2,
    evaluate: (m) => {
      const has = Object.keys(m.og).some((k) => k.startsWith("article:") || k.startsWith("product:"));
      return statusFrom(has, has ? "Extended Open Graph metadata found." : "No extended article/product metadata (optional).");
    },
  },
  {
    id: "twitter-creator",
    label: "twitter:creator present",
    category: "extras",
    weight: 1,
    evaluate: (m) => statusFrom(!!m.twitter["twitter:creator"], m.twitter["twitter:creator"] ? "twitter:creator present." : "Missing twitter:creator (optional).", m.twitter["twitter:creator"]),
  },
  {
    id: "author-present",
    label: "Author meta present",
    category: "extras",
    weight: 1,
    evaluate: (m) => statusFrom(!!m.author, m.author ? "Author meta tag found." : "No author meta — useful for content attribution.", m.author),
  },
  {
    id: "content-type-header",
    label: "Content-Type header set",
    category: "extras",
    weight: 1,
    evaluate: (m) => statusFrom(!!m.contentType, m.contentType ? `Content-Type header: ${m.contentType}.` : "No Content-Type response header detected."),
  },
  {
    id: "structured-data",
    label: "Structured data (JSON-LD) present",
    category: "extras",
    weight: 2,
    evaluate: (m) =>
      statusFrom(
        m.structuredData.found,
        m.structuredData.found
          ? `JSON-LD found (${m.structuredData.types.join(", ") || "unnamed type"}).`
          : "No JSON-LD structured data found — it can improve rich search results.",
        m.structuredData.types.join(", ") || undefined
      ),
  },
  {
    id: "duplicate-title-desc",
    label: "Title and description are distinct",
    category: "extras",
    weight: 2,
    evaluate: (m) => {
      if (!m.title || !m.description) return { status: "warning", message: "Can't compare — one is missing." };
      const same = m.title.trim().toLowerCase() === m.description.trim().toLowerCase();
      return statusFrom(!same, same ? "Title and description are identical — consider differentiating them." : "Title and description are distinct.");
    },
  },
];

function toGrade(pct: number): Grade {
  if (pct >= 90) return "A";
  if (pct >= 75) return "B";
  if (pct >= 60) return "C";
  if (pct >= 40) return "D";
  return "F";
}

function summaryFor(grade: Grade): string {
  switch (grade) {
    case "A":
      return "Excellent. Your link previews should look great almost everywhere.";
    case "B":
      return "Good coverage, with a few gaps worth closing.";
    case "C":
      return "Partial coverage. Several platforms will show incomplete previews.";
    case "D":
      return "Weak coverage. Most previews will be missing key elements.";
    case "F":
    default:
      return "Critical issues. Most previews will look broken.";
  }
}

export function analyze(meta: ExtractedMeta, id: string): AnalysisResult {
  const checks: MetaCheck[] = CHECKS.map((def) => {
    const result = def.evaluate(meta);
    return {
      id: def.id,
      label: def.label,
      category: def.category,
      ...result,
      fix: result.status !== "pass" ? CHECK_FIXES[def.id] : undefined,
    };
  });

  const categories: CheckCategory[] = [
    "essential",
    "opengraph",
    "twitter",
    "images",
    "technical",
    "extras",
  ];

  const categoryScores: CategoryScore[] = categories.map((category) => {
    const defsInCat = CHECKS.filter((c) => c.category === category);
    const possible = defsInCat.reduce((sum, c) => sum + c.weight, 0);
    const earned = defsInCat.reduce((sum, c) => {
      const check = checks.find((chk) => chk.id === c.id);
      return sum + (check?.status === "pass" ? c.weight : 0);
    }, 0);
    return { category, label: CATEGORY_LABELS[category], earned, possible };
  });

  const totalScore = categoryScores.reduce((s, c) => s + c.earned, 0);
  const maxScore = categoryScores.reduce((s, c) => s + c.possible, 0);
  const pct = maxScore === 0 ? 0 : (totalScore / maxScore) * 100;
  const grade = toGrade(pct);

  return {
    id,
    requestedUrl: meta.url,
    finalUrl: meta.finalUrl,
    fetchedAt: new Date().toISOString(),
    meta,
    checks,
    categoryScores,
    totalScore: Math.round(pct),
    maxScore: 100,
    grade,
    summary: summaryFor(grade),
  };
}
