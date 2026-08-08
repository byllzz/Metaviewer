import type { ExtractedMeta, PlatformId } from "@/types";
import type { BadgeStatus } from "@/components/StatusBadge";

export interface PlatformPreviewData {
  title: string;
  description?: string;
  image?: string;
  domain: string;
  issues: string[];
  status: BadgeStatus;
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function resolvePreview(
  platform: PlatformId,
  meta: ExtractedMeta
): PlatformPreviewData {
  const domain = domainOf(meta.finalUrl);
  const issues: string[] = [];

  const ogTitle = meta.og["og:title"];
  const ogDescription = meta.og["og:description"];
  const ogImage = meta.og["og:image"];
  const twitterCard = meta.twitter["twitter:card"];
  const twitterTitle = meta.twitter["twitter:title"];
  const twitterImage = meta.twitter["twitter:image"];

  switch (platform) {
    case "google": {
      if (!meta.title) issues.push("Missing <title>");
      if (!meta.description) issues.push("Missing meta description");
      return {
        title: meta.title ?? domain,
        description: meta.description ?? "No description available.",
        domain,
        issues,
        status: issues.length ? "warning" : "perfect",
      };
    }
    case "x": {
      if (!twitterCard) issues.push("Missing twitter:card");
      if (!twitterImage && !ogImage) issues.push("No image for preview");
      const status: BadgeStatus = !twitterCard
        ? "error"
        : issues.length
        ? "warning"
        : "perfect";
      return {
        title: twitterTitle ?? ogTitle ?? meta.title ?? domain,
        description: meta.twitter["twitter:description"] ?? ogDescription,
        image: twitterImage ?? ogImage,
        domain,
        issues,
        status,
      };
    }
    case "linkedin": {
      if (!ogTitle) issues.push("Missing og:title");
      if (!ogImage) issues.push("Missing og:image");
      return {
        title: ogTitle ?? meta.title ?? domain,
        description: ogDescription,
        image: ogImage,
        domain,
        issues,
        status: issues.length ? "warning" : "perfect",
      };
    }
    case "discord": {
      if (!meta.themeColor) issues.push("No theme-color set");
      if (!ogImage) issues.push("Missing og:image");
      return {
        title: ogTitle ?? meta.title ?? domain,
        description: ogDescription,
        image: ogImage,
        domain,
        issues,
        status: issues.length ? "warning" : "perfect",
      };
    }
    case "slack":
    case "whatsapp":
    case "telegram":
    case "facebook":
    case "imessage": {
      if (!ogTitle) issues.push("Missing og:title");
      if (!ogImage) issues.push("Missing og:image");
      return {
        title: ogTitle ?? meta.title ?? domain,
        description: ogDescription,
        image: ogImage,
        domain,
        issues,
        status: issues.length ? "warning" : "perfect",
      };
    }
    default:
      return {
        title: meta.title ?? domain,
        description: meta.description,
        domain,
        issues,
        status: "warning",
      };
  }
}
