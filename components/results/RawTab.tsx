"use client";

import { useState } from "react";
import { Table2, FileJson, Code2, Download } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { exportAsCsv } from "@/lib/exportResult";

type View = "table" | "json" | "html";

const TYPE_STYLE: Record<string, string> = {
  title: "bg-fg/10 text-fg",
  meta: "bg-fg/10 text-muted",
  og: "bg-accent/20 text-accent",
  twitter: "bg-sky-500/15 text-sky-400",
  link: "bg-fg/10 text-muted",
};

export function RawTab({ result }: { result: AnalysisResult }) {
  const [view, setView] = useState<View>("table");
  const tags = result.meta.rawTags;
  const basicCount = tags.filter((t) => t.type === "meta" || t.type === "title").length;
  const ogCount = tags.filter((t) => t.type === "og").length;
  const twitterCount = tags.filter((t) => t.type === "twitter").length;
  const linkCount = tags.filter((t) => t.type === "link").length;

  const htmlHead = tags
    .map((t) => {
      if (t.type === "title") return `<title>${t.value}</title>`;
      if (t.type === "link") return `<link rel="${t.name}" href="${t.value}">`;
      if (t.type === "og") return `<meta property="${t.name}" content="${t.value}">`;
      if (t.type === "twitter") return `<meta name="${t.name}" content="${t.value}">`;
      return `<meta name="${t.name}" content="${t.value}">`;
    })
    .join("\n");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-surface p-6 rise-in">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {(
              [
                ["table", "Table", Table2],
                ["json", "JSON", FileJson],
                ["html", "HTML Head", Code2],
              ] as [View, string, typeof Table2][]
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 px-3 h-8 rounded-md text-sm transition-colors ${
                  view === id ? "bg-fg text-background" : "text-muted hover:text-fg"
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => exportAsCsv(result)}
            className="flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-fg"
          >
            <Download size={14} /> Download CSV
          </button>
        </div>

        <h3 className="font-medium mb-4">All Meta Tags ({tags.length})</h3>

        {view === "table" && (
          <div className="overflow-x-auto tab-panel">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border/60">
                  <th className="py-2 pr-4 font-normal w-10">#</th>
                  <th className="py-2 pr-4 font-normal">Type</th>
                  <th className="py-2 pr-4 font-normal">Name</th>
                  <th className="py-2 font-normal">Value</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((t, i) => (
                  <tr key={`${t.type}-${t.name}-${i}`} className="border-b border-border/40 last:border-0 align-top">
                    <td className="py-2.5 pr-4 text-muted">{i + 1}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${TYPE_STYLE[t.type]}`}>{t.type}</span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs whitespace-nowrap">{t.name}</td>
                    <td className="py-2.5 text-muted break-all">{t.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "json" && (
          <pre className="rounded-lg bg-background border border-border p-4 overflow-x-auto text-xs leading-relaxed tab-panel">
            <code>{JSON.stringify(tags, null, 2)}</code>
          </pre>
        )}

        {view === "html" && (
          <pre className="rounded-lg bg-background border border-border p-4 overflow-x-auto text-xs leading-relaxed tab-panel">
            <code>{htmlHead}</code>
          </pre>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          [basicCount, "Basic Meta Tags"],
          [ogCount, "Open Graph Tags"],
          [twitterCount, "Twitter Tags"],
          [linkCount, "Link Tags"],
        ].map(([count, label], i) => (
          <div key={label as string} className="rounded-xl border border-border bg-surface p-5 rise-in" style={{ animationDelay: `${i * 50}ms` }}>
            <p className="text-2xl font-serif">{count}</p>
            <p className="text-sm text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
