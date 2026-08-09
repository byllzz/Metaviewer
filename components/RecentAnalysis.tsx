"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, ExternalLink, Zap } from "lucide-react";
import { getHistory, clearHistory, type HistoryEntry } from "@/lib/localHistory";
import { timeAgo } from "@/lib/timeAgo";

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "text-emerald-400 bg-emerald-500/10";
  if (grade.startsWith("B")) return "text-amber-400 bg-amber-500/10";
  if (grade.startsWith("C")) return "text-amber-400 bg-amber-500/10";
  if (grade.startsWith("D")) return "text-orange-400 bg-orange-500/10";
  return "text-red-400 bg-red-500/10";
}

export function RecentAnalysis() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(getHistory().slice(0, 4));
    setLoaded(true);
  }, []);

  // Nothing saved yet in this browser — don't show an empty section on a
  // fresh visit or in server-rendered markup.
  if (!loaded || entries.length === 0) return null;

  return (
    <section className="px-6 pb-16 rise-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted">
              <History size={16} />
            </span>
            <div>
              <h2 className="font-medium">Recent Analysis</h2>
              <p className="text-xs text-muted">Your latest checks</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearHistory();
              setEntries([]);
            }}
            className="text-sm text-muted hover:text-fg transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry, i) => (
            <Link
              key={entry.id}
              href={`/results/${entry.id}`}
              className="rounded-xl border border-border bg-surface p-5 hover:border-accent/40 transition-colors rise-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`flex items-baseline gap-1 px-2.5 py-1 rounded-md font-serif text-lg ${gradeColor(entry.grade)}`}>
                  {entry.score}
                  <span className="text-xs font-sans font-medium">{entry.grade}</span>
                </span>
                <Zap size={14} className="text-sky-400" />
              </div>
              <p className="flex items-center gap-1.5 text-sm truncate mb-3">
                {entry.finalUrl.replace(/^https?:\/\//, "")}
                <ExternalLink size={12} className="text-muted shrink-0" />
              </p>
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-3">
                  <span className="text-emerald-400">✓ {entry.passCount}</span>
                  <span className="text-amber-400">⚠ {entry.warningCount}</span>
                  <span className="text-red-400">✕ {entry.errorCount}</span>
                </span>
                <span>{timeAgo(entry.fetchedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
