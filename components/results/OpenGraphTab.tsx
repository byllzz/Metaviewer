"use client";

import { AlertOctagon, ImageIcon, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { AnalysisResult } from "@/types";
import { StatusIcon } from "@/components/results/StatusIcon";
import { CodeFixBlock } from "@/components/results/CodeFixBlock";

const REQUIRED: { key: string; label: string; desc: string }[] = [
  { key: "og:title", label: "og:title", desc: "The title of your content as it should appear in the preview." },
  { key: "og:description", label: "og:description", desc: "A brief description of the content." },
  { key: "og:image", label: "og:image", desc: "The URL of the image that represents your content." },
  { key: "og:url", label: "og:url", desc: "The canonical URL for your content." },
  { key: "og:type", label: "og:type", desc: "The type of content (website, article, product, etc.)." },
];

const OPTIONAL: { key: string; label: string; desc: string }[] = [
  { key: "og:site_name", label: "og:site_name", desc: "The name of the overall site." },
  { key: "og:locale", label: "og:locale", desc: "The locale of the content (e.g., en_US)." },
  { key: "og:image:width", label: "og:image:width", desc: "The width of the OG image in pixels." },
  { key: "og:image:height", label: "og:image:height", desc: "The height of the OG image in pixels." },
  { key: "og:image:alt", label: "og:image:alt", desc: "Alternative text for the image." },
  { key: "og:image:type", label: "og:image:type", desc: "The MIME type of the image." },
  { key: "og:video", label: "og:video", desc: "URL to a video file." },
  { key: "og:audio", label: "og:audio", desc: "URL to an audio file." },
  { key: "og:determiner", label: "og:determiner", desc: "The word before the title (a, an, the, etc.)." },
];

export function OpenGraphTab({ result }: { result: AnalysisResult }) {
  const { og } = result.meta;
  const [copied, setCopied] = useState(false);
  const missingRequired = REQUIRED.filter((t) => !og[t.key]);
  const requiredFound = REQUIRED.length - missingRequired.length;
  const optionalFound = OPTIONAL.filter((t) => !!og[t.key]).length;

  async function copyImage() {
    if (!og["og:image"]) return;
    await navigator.clipboard.writeText(og["og:image"]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const html = missingRequired.map((t) => `<meta property="${t.key}" content="Your ${t.key.split(":")[1]} here" />`).join("\n");
  const nextjs = `export const metadata = {\n  openGraph: {\n${missingRequired
    .map((t) => `    ${t.key.split(":")[1]}: 'Your ${t.key.split(":")[1]} here',`)
    .join("\n")}\n  },\n}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-6 rise-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-medium">Open Graph Summary</h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-md ${
                requiredFound === REQUIRED.length ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
              }`}
            >
              {requiredFound}/{REQUIRED.length} Required
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-fg/10 text-muted">
              {optionalFound}/{OPTIONAL.length} Optional
            </span>
          </div>
        </div>

        {missingRequired.length > 0 && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="flex items-center gap-2 text-sm text-red-400 font-medium">
              <AlertOctagon size={15} /> Missing required Open Graph tags:
            </p>
            <ul className="mt-2 text-sm text-red-400/90 list-disc list-inside">
              {missingRequired.map((t) => (
                <li key={t.key}>{t.key}</li>
              ))}
            </ul>
            <CodeFixBlock html={html} nextjs={nextjs} />
          </div>
        )}
      </div>

      {og["og:image"] && (
        <div className="rounded-xl border border-border bg-surface p-6 rise-in" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-muted" />
              <h3 className="font-medium">og:image Preview</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={copyImage} className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted hover:text-fg">
                {copied ? <StatusIcon status="pass" size={14} /> : <Copy size={14} />}
              </button>
              <a
                href={og["og:image"]}
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 flex items-center justify-center rounded-md border border-border text-muted hover:text-fg"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={og["og:image"]}
            alt="og:image preview"
            className="w-full max-h-96 object-contain rounded-lg border border-border bg-background"
          />
          <p className="text-xs text-muted mt-2 break-all font-mono">{og["og:image"]}</p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-6 rise-in" style={{ animationDelay: "120ms" }}>
        <h3 className="font-medium mb-1">Required Tags</h3>
        <div>
          {REQUIRED.map((t) => (
            <div key={t.key} className="py-4 border-b border-border/50 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-fg/10">{t.label}</span>
                <StatusIcon status={og[t.key] ? "pass" : "error"} />
              </div>
              <p className="text-xs text-muted mt-2">{t.desc}</p>
              <p className={`text-sm mt-1 ${og[t.key] ? "" : "text-red-400"}`}>{og[t.key] || "Missing"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 rise-in" style={{ animationDelay: "180ms" }}>
        <h3 className="font-medium mb-1">Optional Tags</h3>
        <div>
          {OPTIONAL.map((t) => (
            <div key={t.key} className="py-4 border-b border-border/50 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-fg/10">{t.label}</span>
                <StatusIcon status={og[t.key] ? "pass" : "warning"} />
              </div>
              <p className="text-xs text-muted mt-2">{t.desc}</p>
              <p className="text-sm mt-1">{og[t.key] || "Not set"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
