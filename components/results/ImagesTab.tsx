"use client";

import { ImageIcon, ExternalLink } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { StatusIcon } from "@/components/results/StatusIcon";

const PLATFORM_FIT = [
  { name: "Google Search", w: 1200, h: 630 },
  { name: "X / Twitter", w: 1200, h: 628 },
  { name: "LinkedIn", w: 1200, h: 627 },
  { name: "Discord", w: 1200, h: 630 },
  { name: "Slack", w: 800, h: 418 },
  { name: "WhatsApp", w: 400, h: 400 },
  { name: "Telegram", w: 1200, h: 630 },
  { name: "Facebook", w: 1200, h: 630 },
  { name: "iMessage", w: 1200, h: 630 },
];

function Badge({ label, tone }: { label: string; tone: "good" | "warn" }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-md ${
        tone === "good" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
      }`}
    >
      {label}
    </span>
  );
}

function ImageCard({
  title,
  badge,
  src,
  url,
  dims,
  format,
  bytes,
  alt,
  dimsNote,
  issues,
}: {
  title: string;
  badge: { label: string; tone: "good" | "warn" };
  src?: string;
  url?: string;
  dims?: string;
  dimsNote?: string;
  format?: string;
  bytes?: string;
  alt?: string;
  issues?: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 rise-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ImageIcon size={16} className="text-muted" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <Badge label={badge.label} tone={badge.tone} />
      </div>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={title} className="w-full h-56 object-contain rounded-lg border border-border bg-background" />
      ) : (
        <div className="w-full h-56 rounded-lg border border-border bg-background flex items-center justify-center text-sm text-muted">
          Not available
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-sm">
        <div>
          <p className="text-xs text-muted">Dimensions</p>
          <p>{dims ?? "Unknown"}</p>
          {dimsNote && <p className="text-[11px] text-muted/70 mt-0.5">{dimsNote}</p>}
        </div>
        <div>
          <p className="text-xs text-muted">Format</p>
          <p>{format ?? "Unknown"}</p>
        </div>
        <div>
          <p className="text-xs text-muted">File Size</p>
          <p>{bytes ?? "Unknown"}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-muted">Alt Text</p>
          <p>{alt ?? "Missing"}</p>
        </div>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between mt-3 px-3 py-2 rounded-md border border-border bg-background text-xs text-muted hover:text-fg font-mono break-all"
        >
          <span className="truncate">{url}</span>
          <ExternalLink size={12} className="shrink-0 ml-2" />
        </a>
      )}
      {issues && issues.length > 0 && (
        <div className="mt-3 flex flex-col gap-1">
          {issues.map((issue) => (
            <p key={issue} className="flex items-center gap-1.5 text-xs text-amber-400">
              <StatusIcon status="warning" size={12} /> {issue}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function ImagesTab({ result }: { result: AnalysisResult }) {
  const { meta } = result;
  const img = meta.ogImage;
  const kb = img?.bytes ? Math.round(img.bytes / 1024) : undefined;

  const ogIssues: string[] = [];
  if (kb && kb > 100) ogIssues.push(`File size (${kb} KB) exceeds 100KB recommendation`);
  if (!meta.og["og:image:alt"]) ogIssues.push("Missing alt text");

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {meta.og["og:image"] && (
          <ImageCard
            title="OG Image"
            badge={ogIssues.length ? { label: "Needs Attention", tone: "warn" } : { label: "Good", tone: "good" }}
            src={meta.og["og:image"]}
            url={img?.url}
            dims={img?.width && img.height ? `${img.width} × ${img.height}` : undefined}
            dimsNote={img?.width && img.height ? (img.dimensionsDecoded ? "Decoded from image" : "From og:image:width/height") : undefined}
            format={img?.contentType?.split("/")[1]?.toUpperCase()}
            bytes={kb ? `${kb} KB` : undefined}
            alt={meta.og["og:image:alt"]}
            issues={ogIssues}
          />
        )}
        <ImageCard
          title="Favicon"
          badge={{ label: "Good", tone: "good" }}
          src={meta.favicon}
          url={meta.favicon}
          dims={meta.faviconInfo?.width && meta.faviconInfo.height ? `${meta.faviconInfo.width} × ${meta.faviconInfo.height}` : undefined}
          format={meta.faviconInfo?.contentType?.split("/")[1]?.toUpperCase()}
          bytes={meta.faviconInfo?.bytes ? `${Math.round(meta.faviconInfo.bytes / 1024)} KB` : undefined}
          alt={meta.favicon ? "Set" : undefined}
        />
        {meta.appleTouchIcon && (
          <ImageCard
            title="Apple Touch Icon"
            badge={{ label: "Good", tone: "good" }}
            src={meta.appleTouchIcon}
            url={meta.appleTouchIcon}
            dims={
              meta.appleTouchIconInfo?.width && meta.appleTouchIconInfo.height
                ? `${meta.appleTouchIconInfo.width} × ${meta.appleTouchIconInfo.height}`
                : undefined
            }
            format={meta.appleTouchIconInfo?.contentType?.split("/")[1]?.toUpperCase()}
            bytes={meta.appleTouchIconInfo?.bytes ? `${Math.round(meta.appleTouchIconInfo.bytes / 1024)} KB` : undefined}
            alt="Set"
          />
        )}
      </div>

      {img?.width && img.height && (
        <div className="rounded-xl border border-border bg-surface p-6 rise-in">
          <h3 className="font-medium mb-1">Platform Image Fit</h3>
          <p className="text-sm text-muted mb-4">How your OG image will appear on each platform based on their ideal dimensions.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border/60">
                  <th className="py-2 pr-4 font-normal">Platform</th>
                  <th className="py-2 pr-4 font-normal">Ideal Size</th>
                  <th className="py-2 pr-4 font-normal">Aspect Ratio</th>
                  <th className="py-2 font-normal">Your Image Fit</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORM_FIT.map((p) => {
                  const targetRatio = p.w / p.h;
                  const ratio = img.width! / img.height!;
                  const fits = Math.abs(ratio - targetRatio) < 0.35;
                  return (
                    <tr key={p.name} className="border-b border-border/40 last:border-0">
                      <td className="py-2.5 pr-4">{p.name}</td>
                      <td className="py-2.5 pr-4 text-muted">
                        {p.w}×{p.h}
                      </td>
                      <td className="py-2.5 pr-4 text-muted">{(p.w / p.h).toFixed(2)}:1</td>
                      <td className="py-2.5">
                        <span className={`flex items-center gap-1.5 ${fits ? "text-emerald-400" : "text-amber-400"}`}>
                          <StatusIcon status={fits ? "pass" : "warning"} size={13} />
                          {fits ? "Optimal size" : "May be cropped"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-6 rise-in">
        <h3 className="font-medium mb-3">Image Recommendations</h3>
        <ul className="flex flex-col gap-2 text-sm">
          {[
            "Use 1200×630 pixels for optimal display across all platforms.",
            "Keep file size under 100KB for fast loading.",
            "Use JPG or PNG format. WebP is not universally supported.",
            "Add og:image:alt for accessibility.",
            "Include og:image:width and og:image:height for faster rendering.",
            "Use absolute URLs (starting with https://) for all images.",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-muted">
              <StatusIcon status="pass" size={14} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
