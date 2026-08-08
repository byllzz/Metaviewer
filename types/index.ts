export type CheckStatus = "pass" | "warning" | "error";

export type CheckCategory =
  | "essential"
  | "opengraph"
  | "twitter"
  | "images"
  | "technical"
  | "extras";

export interface MetaCheck {
  id: string;
  label: string;
  category: CheckCategory;
  status: CheckStatus;
  message: string;
  value?: string;
}

export interface CategoryScore {
  category: CheckCategory;
  label: string;
  earned: number;
  possible: number;
}

export interface ImageInfo {
  url: string;
  width?: number;
  height?: number;
  bytes?: number;
  contentType?: string;
}

export interface SecurityHeaders {
  hsts: boolean;
  xContentTypeOptions: boolean;
  xFrameOptions: boolean;
  csp: boolean;
}

export interface RobotsTxtInfo {
  checked: boolean;
  found: boolean;
  allowsIndexing: boolean;
}

export interface SitemapInfo {
  checked: boolean;
  found: boolean;
  urlCount?: number;
}

export interface RawTag {
  type: "title" | "meta" | "link" | "og" | "twitter";
  name: string;
  value: string;
}

export interface ExtractedMeta {
  url: string;
  finalUrl: string;
  title?: string;
  description?: string;
  canonical?: string;
  favicon?: string;
  appleTouchIcon?: string;
  themeColor?: string;
  robots?: string;
  lang?: string;
  viewport?: string;
  charset?: string;
  author?: string;
  keywords?: string;
  generator?: string;

  og: Record<string, string>;
  twitter: Record<string, string>;

  ogImage?: ImageInfo;

  httpStatus: number;
  loadTimeMs: number;
  contentType?: string;
  server?: string;
  redirected: boolean;
  securityHeaders: SecurityHeaders;
  robotsTxt: RobotsTxtInfo;
  sitemap: SitemapInfo;
  rawTags: RawTag[];
}

export type Grade = "A" | "B" | "C" | "D" | "F";

export interface AnalysisResult {
  id: string;
  requestedUrl: string;
  finalUrl: string;
  fetchedAt: string;
  meta: ExtractedMeta;
  checks: MetaCheck[];
  categoryScores: CategoryScore[];
  totalScore: number;
  maxScore: number;
  grade: Grade;
  summary: string;
}

export type PlatformId =
  | "google"
  | "x"
  | "linkedin"
  | "discord"
  | "slack"
  | "whatsapp"
  | "telegram"
  | "facebook"
  | "imessage";

export type PlatformGroup = "search" | "social" | "messaging";

export interface PlatformDef {
  id: PlatformId;
  name: string;
  group: PlatformGroup;
  usesFields: string[];
}
