"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Share2,
  Download,
  Moon,
  Plus,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { AnalysisResult } from "@/types";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformPreviewCard } from "@/components/PlatformPreviewCard";
import { ScoreRing } from "@/components/ScoreRing";
import { CategoryBars } from "@/components/CategoryBars";

type GroupFilter = "all" | "search" | "social" | "messaging";

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<GroupFilter>("all");

  useEffect(() => {
    const cached = sessionStorage.getItem(`metaview:${params.id}`);
    if (cached) {
      setResult(JSON.parse(cached));
      return;
    }
    fetch(`/api/results/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
      })
      .then((data) => {
        setResult(data);
        sessionStorage.setItem(`metaview:${params.id}`, JSON.stringify(data));
      })
      .catch((err) => setError(err.message ?? "Result not found."));
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-muted">{error}</p>
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
          <button onClick={() => router.push("/")} className="text-muted hover:text-white">
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
            onClick={() => router.refresh()}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-white"
          >
            <RefreshCw size={14} /> Re-analyze
          </button>
          <button className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-white">
            <Share2 size={14} /> Share
          </button>
          <button className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-white">
            <Download size={14} /> Export
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted hover:text-white">
            <Moon size={15} />
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 h-9 px-3 rounded-md bg-white text-black text-sm font-medium"
          >
            <Plus size={14} /> New Analysis
          </button>
        </div>
      </header>

      <main className="px-6 py-8 max-w-6xl mx-auto">
        <div className="rounded-xl border border-border bg-surface p-6 mb-8">
          <div className="flex flex-wrap items-center gap-6 justify-between">
            <div className="flex items-center gap-5">
              <ScoreRing score={result.totalScore} grade={result.grade} />
              <p className="text-lg">{result.summary}</p>
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
                  ? "bg-white text-black border-white"
                  : "border-border text-muted hover:text-white"
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
