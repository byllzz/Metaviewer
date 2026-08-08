"use client";

import { useState } from "react";
import { Check, Copy, Wand2 } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { generateSnippet, type SnippetFramework } from "@/lib/fixSnippets";

const TABS: { id: SnippetFramework; label: string }[] = [
  { id: "html", label: "HTML" },
  { id: "nextjs", label: "Next.js" },
  { id: "astro", label: "Astro" },
  { id: "hugo", label: "Hugo" },
];

export function FixSnippets({ result }: { result: AnalysisResult }) {
  const [tab, setTab] = useState<SnippetFramework>("html");
  const [copied, setCopied] = useState(false);

  const snippet = generateSnippet(result, tab);
  const issueCount = result.checks.filter((c) => c.status !== "pass").length;

  async function copy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Wand2 size={16} className="text-accent" />
        <h2 className="font-medium">Copy-paste fixes</h2>
      </div>
      <p className="text-sm text-muted mb-4">
        {issueCount > 0
          ? `Ready-to-use tags for your framework — filled in with what we found, with sensible defaults for the ${issueCount} check${issueCount === 1 ? "" : "s"} that need attention.`
          : "Your tags already look solid. Here's the equivalent code for reference."}
      </p>

      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 h-8 rounded-md text-sm border transition-colors ${
              tab === t.id
                ? "bg-fg text-background border-fg"
                : "border-border text-muted hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={copy}
          className="ml-auto flex items-center gap-1.5 px-3 h-8 rounded-md text-sm border border-border text-muted hover:text-fg"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="rounded-lg bg-background border border-border p-4 overflow-x-auto text-xs leading-relaxed">
        <code>{snippet}</code>
      </pre>
    </div>
  );
}
