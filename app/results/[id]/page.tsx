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
  History,
} from "lucide-react";
import type { AnalysisResult } from "@/types";
import { ScoreRing } from "@/components/ScoreRing";
import { CategoryBars } from "@/components/CategoryBars";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExportMenu } from "@/components/ExportMenu";
import { getResult, saveResult } from "@/lib/localHistory";
import { ResultTabs, type TabId } from "@/components/results/ResultTabs";
import { PreviewsTab } from "@/components/results/PreviewsTab";
import { BasicTab } from "@/components/results/BasicTab";
import { OpenGraphTab } from "@/components/results/OpenGraphTab";
import { TwitterTab } from "@/components/results/TwitterTab";
import { ImagesTab } from "@/components/results/ImagesTab";
import { RawTab } from "@/components/results/RawTab";
import { ScoreTab } from "@/components/results/ScoreTab";

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("previews");
  const [reanalyzing, setReanalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const scoreCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = getResult(params.id);
    if (cached) {
      setResult(cached);
    } else {
      setError(
        "We couldn't find this result in your browser's history. It may have been cleared, or opened on a different device."
      );
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6 rise-in">
        <p className="text-muted max-w-sm">{error}</p>
        <button onClick={() => router.push("/")} className="text-accent hover:underline text-sm">
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

  const errorCount = result.checks.filter((c) => c.status === "error").length;
  const warningCount = result.checks.filter((c) => c.status === "warning").length;
  const passCount = result.checks.filter((c) => c.status === "pass").length;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/60 sticky top-0 z-30 bg-background/80 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => router.push("/")} className="text-muted hover:text-fg transition-colors">
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
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-fg transition-colors disabled:opacity-60"
          >
            {reanalyzing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Re-analyze
          </button>
          <button
            onClick={share}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-fg transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            {copied ? "Copied" : "Share"}
          </button>
          <ExportMenu result={result} captureRef={scoreCardRef} />
          <button
            onClick={() => router.push("/history")}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-fg transition-colors"
          >
            <History size={14} />
            History
          </button>
          <ThemeToggle />
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 h-9 px-3 rounded-md bg-fg text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={14} /> New Analysis
          </button>
        </div>
      </header>

      {error && (
        <div className="px-6 pt-4 tab-panel">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}

      <main className="px-6 py-8 max-w-6xl mx-auto">
        <div ref={scoreCardRef} className="rounded-xl border border-border bg-surface p-6 mb-8 rise-in">
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
              <span className="flex items-center gap-1.5 text-emerald-400">✓ {passCount}</span>
              <span className="flex items-center gap-1.5 text-amber-400">⚠ {warningCount}</span>
              <span className="flex items-center gap-1.5 text-red-400">✕ {errorCount}</span>
            </div>
          </div>
          <CategoryBars categories={result.categoryScores} />
        </div>

        <ResultTabs active={tab} onChange={setTab} />

        <div key={tab} className="tab-panel">
          {tab === "previews" && <PreviewsTab result={result} />}
          {tab === "basic" && <BasicTab result={result} />}
          {tab === "opengraph" && <OpenGraphTab result={result} />}
          {tab === "twitter" && <TwitterTab result={result} />}
          {tab === "images" && <ImagesTab result={result} />}
          {tab === "raw" && <RawTab result={result} />}
          {tab === "score" && <ScoreTab result={result} />}
        </div>
      </main>
    </div>
  );
}
