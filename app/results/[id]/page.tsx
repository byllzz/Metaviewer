"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Share2,
  Plus,
  ExternalLink,
  Loader2,
  Check,
} from "lucide-react";
import type { AnalysisResult } from "@/types";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformPreviewCard } from "@/components/PlatformPreviewCard";
import { ScoreRing } from "@/components/ScoreRing";
import { CategoryBars } from "@/components/CategoryBars";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExportMenu } from "@/components/ExportMenu";
import { FixSnippets } from "@/components/FixSnippets";
import { getResult, saveResult } from "@/lib/localHistory";

type GroupFilter = "all" | "search" | "social" | "messaging";

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<GroupFilter>("all");
  const [reanalyzing, setReanalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const scoreCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = getResult(params.id);
    if (cached) {
      setResult(cached);
    } else {
      // Metaview stores results in this browser only (no backend yet — see
      // lib/localHistory.ts). A link opened on a different device/browser
      // won't resolve until that's wired up to a real database.
      setError("We couldn't find this result in your browser's history. It may have been cleared, or opened on a different device.");
    }
  }, [params.id]);

  async function reanalyze() {
    if (!result) return;
    setReanalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: result.finalUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Re-analysis failed.");
      saveResult(data);
      router.replace(`/results/${data.id}`);
      setResult(data);
    } catch (err) {
      // Keep the current result on screen; surface the error briefly.
      setError(err instanceof Error ? err.message : "Re-analysis failed.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setReanalyzing(false);
    }
  }

  async function share() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  if (error && !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-muted max-w-sm">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="text-accent hover:underline text-sm"
        >
          Run a new analysis
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted" />
      </div>
    );
  }

  const platforms =
    filter === "all"
      ? PLATFORMS
      : PLATFORMS.filter((p) => p.group === filter);

  const errorCount = result.checks.filter((c) => c.status === "error").length;
  const warningCount = result.checks.filter((c) => c.status === "warning").length;
  const passCount = result.checks.filter((c) => c.status === "pass").length;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/60">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => router.push("/")} className="text-muted hover:text-fg">
            <ArrowLeft size={18} />
          </button>
          <a
            href={result.finalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm truncate hover:underline"
          >
            {result.finalUrl.replace(/^https?:\/\//, "")}
            <ExternalLink size={13} className="shrink-0" />
          </a>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={reanalyze}
            disabled={reanalyzing}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-fg disabled:opacity-60"
          >
            {reanalyzing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Re-analyze
          </button>
          <button
            onClick={share}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-fg"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            {copied ? "Copied" : "Share"}
          </button>
          <ExportMenu result={result} captureRef={scoreCardRef} />
          <ThemeToggle />
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 h-9 px-3 rounded-md bg-fg text-background text-sm font-medium"
          >
            <Plus size={14} /> New Analysis
          </button>
        </div>
      </header>

      {error && (
        <div className="px-6 pt-4">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}

      <main className="px-6 py-8 max-w-6xl mx-auto">
        <div ref={scoreCardRef} className="rounded-xl border border-border bg-surface p-6 mb-8">
          <div className="flex flex-wrap items-center gap-6 justify-between">
            <div className="flex items-center gap-5">
              <ScoreRing score={result.totalScore} grade={result.grade} />
              <div>
                <p className="text-lg">{result.summary}</p>
                <p className="text-xs text-muted mt-1">
                  {result.finalUrl.replace(/^https?:\/\//, "")} · checked {new Date(result.fetchedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-400">
                ✓ {passCount}
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                ⚠ {warningCount}
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                ✕ {errorCount}
              </span>
            </div>
          </div>
          <CategoryBars categories={result.categoryScores} />
        </div>

        <FixSnippets result={result} />

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(
            [
              ["all", "All"],
              ["search", "Search"],
              ["social", "Social"],
              ["messaging", "Messaging"],
            ] as [GroupFilter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 h-8 rounded-md text-sm border ${
                filter === value
                  ? "bg-fg text-background border-fg"
                  : "border-border text-muted hover:text-fg"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {platforms.map((p) => (
            <PlatformPreviewCard key={p.id} platform={p.id} meta={result.meta} />
          ))}
        </div>
      </main>
    </div>
  );
}
