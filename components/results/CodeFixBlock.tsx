"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const TABS = ["HTML", "Next.js"] as const;

export function CodeFixBlock({ html, nextjs }: { html: string; nextjs: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("HTML");
  const [copied, setCopied] = useState(false);
  const code = tab === "HTML" ? html : nextjs;

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-medium mb-2">Fix suggestions</p>
      <div className="rounded-lg border border-border bg-background overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
          <div className="flex items-center gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-2.5 h-7 rounded-md text-xs transition-colors ${
                  tab === t ? "bg-fg/10 text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs text-muted hover:text-fg"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="p-3 text-xs overflow-x-auto leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
