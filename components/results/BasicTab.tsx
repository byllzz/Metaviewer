"use client";

import { FileText, Globe, Server, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { AnalysisResult } from "@/types";
import { StatusIcon } from "@/components/results/StatusIcon";

function LengthBar({
  length,
  min,
  max,
  ideal,
}: {
  length: number;
  min: number;
  max: number;
  ideal: number;
}) {
  const pct = Math.min(100, Math.max(0, ((length - min) / (max - min)) * 100));
  const idealPct = ((ideal - min) / (max - min)) * 100;
  const good = length >= min + (ideal - min) * 0.4 && length <= max - (max - ideal) * 0.4;
  const diff = length < ideal ? `${ideal - length} short of ideal` : length > ideal ? `${length - ideal} over ideal` : "Good length";

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-muted mb-1.5">
        <span>{length} characters</span>
        <span className={good ? "text-emerald-400" : "text-amber-400"}>{good ? "Good length" : diff}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-fg/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${good ? "bg-emerald-500" : "bg-amber-500"}`}
          style={{ width: `${pct}%` }}
        />
        <div className="absolute top-0 bottom-0 w-px bg-emerald-400/70" style={{ left: `${idealPct}%` }} />
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted mt-1">
        <span>{min}</span>
        <span className="text-emerald-400">{ideal} ideal</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function MetaRow({ label, value, status }: { label: string; value?: string; status: "pass" | "warning" }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted mt-0.5">{value || "Not set"}</p>
      </div>
      <StatusIcon status={value ? "pass" : status} />
    </div>
  );
}

function ConfigStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-background">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-accent/15 text-accent">{value}</span>
    </div>
  );
}

export function BasicTab({ result }: { result: AnalysisResult }) {
  const { meta } = result;
  const [robotsOpen, setRobotsOpen] = useState(false);
  const [sitemapOpen, setSitemapOpen] = useState(false);
  const sh = meta.securityHeaders;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-6 rise-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-muted" />
            <h3 className="font-medium">Title Tag</h3>
          </div>
          <StatusIcon status={meta.title && meta.title.length >= 15 && meta.title.length <= 60 ? "pass" : "warning"} />
        </div>
        <p className="text-lg mt-3">{meta.title || "No title tag found."}</p>
        <LengthBar length={meta.title?.length ?? 0} min={30} max={60} ideal={50} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 rise-in" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-muted" />
            <h3 className="font-medium">Meta Description</h3>
          </div>
          <StatusIcon status={meta.description && meta.description.length >= 120 && meta.description.length <= 160 ? "pass" : "warning"} />
        </div>
        <p className="text-sm text-muted mt-3">{meta.description || "No meta description found."}</p>
        <LengthBar length={meta.description?.length ?? 0} min={120} max={160} ideal={155} />
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 rise-in" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center gap-2 mb-1">
          <Globe size={16} className="text-muted" />
          <h3 className="font-medium">Other Meta Tags</h3>
        </div>
        <div>
          <MetaRow label="Canonical URL" value={meta.canonical} status="warning" />
          <MetaRow label="Favicon" value={meta.favicon} status="warning" />
          <MetaRow label="Apple Touch Icon" value={meta.appleTouchIcon} status="warning" />
          <MetaRow label="Language" value={meta.lang} status="warning" />
          <MetaRow label="Charset" value={meta.charset} status="warning" />
          <MetaRow label="Viewport" value={meta.viewport} status="warning" />
          <MetaRow label="Theme Color" value={meta.themeColor} status="warning" />
          <MetaRow label="Author" value={meta.author} status="warning" />
          <MetaRow label="Keywords" value={meta.keywords} status="warning" />
          <MetaRow label="Generator" value={meta.generator} status="pass" />
          <MetaRow label="Robots" value={meta.robots || "Not set (index, follow)"} status="pass" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 rise-in" style={{ animationDelay: "180ms" }}>
        <div className="flex items-center gap-2 mb-4">
          <Server size={16} className="text-muted" />
          <h3 className="font-medium">Site Configuration</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ConfigStat label="HTTPS" value={meta.finalUrl.startsWith("https://") ? "Enabled" : "Disabled"} />
          <ConfigStat label="HTTP Status" value={String(meta.httpStatus)} />
          <ConfigStat label="Load Time" value={`${meta.loadTimeMs}ms`} />
          <ConfigStat label="Content-Type" value={meta.contentType?.split(";")[0] ?? "Unknown"} />
          <ConfigStat label="Server" value={meta.server ?? "Unknown"} />
          <ConfigStat label="Redirect Chain" value={meta.redirected ? "Redirected" : "None"} />
        </div>

        <button
          onClick={() => setRobotsOpen((v) => !v)}
          className="w-full flex items-center justify-between mt-3 px-4 py-3 rounded-lg border border-border bg-background text-sm"
        >
          <span className="flex items-center gap-2">
            <StatusIcon status={meta.robotsTxt.found ? "pass" : "warning"} />
            robots.txt
            <span className="text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent">
              {meta.robotsTxt.found ? (meta.robotsTxt.allowsIndexing ? "Allows indexing" : "Blocks indexing") : "Not found"}
            </span>
          </span>
          <ChevronDown size={15} className={`text-muted transition-transform ${robotsOpen ? "rotate-180" : ""}`} />
        </button>
        {robotsOpen && (
          <p className="text-xs text-muted px-4 py-2 tab-panel">
            {meta.robotsTxt.found
              ? `Found at ${new URL(meta.finalUrl).origin}/robots.txt.`
              : "No robots.txt was found at the site root — crawlers will assume everything is allowed."}
          </p>
        )}

        <button
          onClick={() => setSitemapOpen((v) => !v)}
          className="w-full flex items-center justify-between mt-2 px-4 py-3 rounded-lg border border-border bg-background text-sm"
        >
          <span className="flex items-center gap-2">
            <StatusIcon status={meta.sitemap.found ? "pass" : "warning"} />
            sitemap.xml
            <span className="text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent">
              {meta.sitemap.found ? `${meta.sitemap.urlCount ?? "?"} URLs` : "Not found"}
            </span>
          </span>
          <ChevronDown size={15} className={`text-muted transition-transform ${sitemapOpen ? "rotate-180" : ""}`} />
        </button>
        {sitemapOpen && (
          <p className="text-xs text-muted px-4 py-2 tab-panel">
            {meta.sitemap.found
              ? `Found at ${new URL(meta.finalUrl).origin}/sitemap.xml.`
              : "No sitemap.xml was found at the site root."}
          </p>
        )}

        <div className="flex items-center justify-between mt-2 px-4 py-3 rounded-lg border border-border bg-background text-sm">
          <span className="flex items-center gap-2">
            <StatusIcon status={meta.structuredData.found ? "pass" : "warning"} />
            Structured data (JSON-LD)
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-accent/15 text-accent">
            {meta.structuredData.found ? meta.structuredData.types.join(", ") || "Found" : "Not found"}
          </span>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Security Headers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            <span className="flex items-center gap-1.5">
              <StatusIcon status={sh.hsts ? "pass" : "warning"} size={13} /> Strict-Transport-Security
            </span>
            <span className="flex items-center gap-1.5">
              <StatusIcon status={sh.xContentTypeOptions ? "pass" : "warning"} size={13} /> X-Content-Type-Options
            </span>
            <span className="flex items-center gap-1.5">
              <StatusIcon status={sh.xFrameOptions ? "pass" : "warning"} size={13} /> X-Frame-Options
            </span>
            <span className="flex items-center gap-1.5">
              <StatusIcon status={sh.csp ? "pass" : "warning"} size={13} /> Content-Security-Policy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
