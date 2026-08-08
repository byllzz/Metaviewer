"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ArrowLeft, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getHistory, removeFromHistory, clearHistory, type HistoryEntry } from "@/lib/localHistory";

function gradeColor(grade: string) {
  if (grade === "A") return "text-emerald-400";
  if (grade === "B") return "text-lime-400";
  if (grade === "C") return "text-amber-400";
  if (grade === "D") return "text-orange-400";
  return "text-red-400";
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="px-6 py-10 max-w-3xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted hover:text-fg">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-serif text-2xl">History</h1>
          </div>
          {entries.length > 0 && (
            <button
              onClick={() => {
                clearHistory();
                setEntries([]);
              }}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-red-400"
            >
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>

        {loaded && entries.length === 0 && (
          <div className="text-center py-24 text-muted">
            <p className="mb-4">No checks yet. Everything you analyze is saved here, in your browser only.</p>
            <Link href="/" className="text-accent hover:underline text-sm">
              Run your first check
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {entries.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3"
            >
              <Link href={`/results/${e.id}`} className="flex items-center gap-4 min-w-0 flex-1">
                <span className={`font-serif text-lg w-6 text-center shrink-0 ${gradeColor(e.grade)}`}>
                  {e.grade}
                </span>
                <div className="min-w-0">
                  <p className="text-sm truncate">{e.finalUrl.replace(/^https?:\/\//, "")}</p>
                  <p className="text-xs text-muted">
                    {new Date(e.fetchedAt).toLocaleString()} · Score {e.score}/100
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={e.finalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 flex items-center justify-center rounded-md text-muted hover:text-fg"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => {
                    removeFromHistory(e.id);
                    setEntries((prev) => prev.filter((x) => x.id !== e.id));
                  }}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-muted hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
