import * as cheerio from "cheerio";
import type { ExtractedMeta, ImageInfo } from "@/types";

const USER_AGENT =
  "Mozilla/5.0 (compatible; MetaviewBot/1.0; +https://metaview.app/bot)";

export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

function normalizeUrl(input: string): string {
  let value = input.trim();
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }
  const parsed = new URL(value); // throws if invalid
  return parsed.toString();
}

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  if (/^127\./.test(h) || h === "0.0.0.0" || h === "::1") return true;
  if (/^10\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  return false;
}

async function fetchHead(url: string): Promise<ImageInfo | undefined> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const contentType = res.headers.get("content-type") ?? undefined;
    const len = res.headers.get("content-length");
    return {
      url,
      contentType,
      bytes: len ? Number(len) : undefined,
    };
  } catch {
    return undefined;
  }
}

export async function extractMeta(rawUrl: string): Promise<ExtractedMeta> {
  const url = normalizeUrl(rawUrl);
  const parsed = new URL(url);

  if (isPrivateHost(parsed.hostname)) {
    throw new FetchError(
      "Local or private network URLs can't be analyzed. Please use a publicly reachable URL."
    );
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    throw new FetchError(
      `Couldn't reach that URL. It may be down or blocking requests. (${
        (err as Error).message
      })`
    );
  }

  if (!res.ok) {
    throw new FetchError(`Site responded with HTTP ${res.status}.`);
  }

  const html = await res.text();
  const finalUrl = res.url || url;
  const $ = cheerio.load(html);

  const getMeta = (selector: string) =>
    $(selector).attr("content")?.trim() || undefined;

  const og: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr("property");
    const content = $(el).attr("content");
    if (prop && content) og[prop] = content.trim();
  });

  const twitter: Record<string, string> = {};
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr("name");
    const content = $(el).attr("content");
    if (name && content) twitter[name] = content.trim();
  });

  const title = $("title").first().text().trim() || undefined;
  const description = getMeta('meta[name="description"]');
  const canonicalHref = $('link[rel="canonical"]').attr("href");
  const canonical = canonicalHref
    ? new URL(canonicalHref, finalUrl).toString()
    : undefined;

  const iconHref =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    "/favicon.ico";
  const favicon = new URL(iconHref, finalUrl).toString();

  const themeColor = getMeta('meta[name="theme-color"]');
  const robots = getMeta('meta[name="robots"]');
  const lang = $("html").attr("lang")?.trim();
  const viewport = getMeta('meta[name="viewport"]');
  const charset =
    $("meta[charset]").attr("charset") ||
    getMeta('meta[http-equiv="Content-Type"]');

  let ogImage: ImageInfo | undefined;
  const ogImageUrl = og["og:image:secure_url"] || og["og:image"];
  if (ogImageUrl) {
    const absolute = new URL(ogImageUrl, finalUrl).toString();
    const head = await fetchHead(absolute);
    const width = og["og:image:width"] ? Number(og["og:image:width"]) : undefined;
    const height = og["og:image:height"]
      ? Number(og["og:image:height"])
      : undefined;
    ogImage = {
      url: absolute,
      width,
      height,
      bytes: head?.bytes,
      contentType: head?.contentType,
    };
  }

  return {
    url,
    finalUrl,
    title,
    description,
    canonical,
    favicon,
    themeColor,
    robots,
    lang,
    viewport,
    charset,
    og,
    twitter,
    ogImage,
  };
}
