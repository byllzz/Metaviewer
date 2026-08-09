"use client";

import { Twitter as TwitterIcon, AlertOctagon } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { StatusIcon } from "@/components/results/StatusIcon";
import { CodeFixBlock } from "@/components/results/CodeFixBlock";

const REQUIRED: { key: string; label: string; desc: string; fallback?: string }[] = [
  { key: "twitter:card", label: "twitter:card", desc: "The card type - summary or summary_large_image." },
  { key: "twitter:title", label: "twitter:title", desc: "Falls back to og:title if not set.", fallback: "og:title" },
  { key: "twitter:description", label: "twitter:description", desc: "Falls back to og:description if not set.", fallback: "og:description" },
  { key: "twitter:image", label: "twitter:image", desc: "Falls back to og:image if not set.", fallback: "og:image" },
];

const OPTIONAL: { key: string; label: string; desc: string }[] = [
  { key: "twitter:site", label: "twitter:site", desc: "The @username of the website." },
  { key: "twitter:creator", label: "twitter:creator", desc: "The @username of the content creator." },
  { key: "twitter:image:alt", label: "twitter:image:alt", desc: "Alternative text for the image, for accessibility." },
];

export function TwitterTab({ result }: { result: AnalysisResult }) {
  const { twitter, og } = result.meta;

  function resolved(key: string, fallback?: string) {
    return twitter[key] || (fallback ? og[fallback] : undefined);
  }

  const missing = REQUIRED.filter((t) => !resolved(t.key, t.fallback));
  const foundCount = REQUIRED.length - missing.length;

  const html = missing.map((t) => `<meta name="${t.key}" content="Your ${t.key.split(":")[1]} here" />`).join("\n");
  const nextjs = `export const metadata = {\n  twitter: {\n${missing
    .map((t) => `    ${t.key.split(":")[1]}: 'Your ${t.key.split(":")[1]} here',`)
    .join("\n")}\n  },\n}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-6 rise-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <TwitterIcon size={16} className="text-muted" />
            <h3 className="font-medium">X / Twitter Card Summary</h3>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-md ${
              foundCount === REQUIRED.length ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
            }`}
          >
            {foundCount}/{REQUIRED.length} Required
          </span>
        </div>

        {missing.length > 0 && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="flex items-center gap-2 text-sm text-red-400 font-medium">
              <AlertOctagon size={15} /> Missing required Twitter Card tags:
            </p>
            <ul className="mt-2 text-sm text-red-400/90 list-disc list-inside">
              {missing.map((t) => (
                <li key={t.key}>{t.key}</li>
              ))}
            </ul>
            <CodeFixBlock html={html} nextjs={nextjs} />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 rise-in" style={{ animationDelay: "60ms" }}>
        <h3 className="font-medium mb-1">Required Tags</h3>
        <div>
          {REQUIRED.map((t) => {
            const value = resolved(t.key, t.fallback);
            return (
              <div key={t.key} className="py-4 border-b border-border/50 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-fg/10">{t.label}</span>
                  <StatusIcon status={value ? "pass" : "error"} />
                </div>
                <p className="text-xs text-muted mt-2">{t.desc}</p>
                <p className={`text-sm mt-1 ${value ? "" : "text-red-400"}`}>{value || "Missing"}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 rise-in" style={{ animationDelay: "120ms" }}>
        <h3 className="font-medium mb-1">Optional Tags</h3>
        <div>
          {OPTIONAL.map((t) => (
            <div key={t.key} className="py-4 border-b border-border/50 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-fg/10">{t.label}</span>
                <StatusIcon status={twitter[t.key] ? "pass" : "warning"} />
              </div>
              <p className="text-xs text-muted mt-2">{t.desc}</p>
              <p className="text-sm mt-1">{twitter[t.key] || "Not set"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
