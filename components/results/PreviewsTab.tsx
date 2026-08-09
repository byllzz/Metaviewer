"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/types";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformPreviewCard } from "@/components/PlatformPreviewCard";

type GroupFilter = "all" | "search" | "social" | "messaging";

export function PreviewsTab({ result }: { result: AnalysisResult }) {
  const [filter, setFilter] = useState<GroupFilter>("all");
  const platforms = filter === "all" ? PLATFORMS : PLATFORMS.filter((p) => p.group === filter);

  return (
    <div>
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
            className={`px-3 h-8 rounded-md text-sm border transition-colors ${
              filter === value
                ? "bg-fg text-background border-fg"
                : "border-border text-muted hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
        {platforms.map((p, i) => (
          <div key={p.id} className="break-inside-avoid rise-in" style={{ animationDelay: `${i * 40}ms` }}>
            <PlatformPreviewCard platform={p.id} meta={result.meta} />
          </div>
        ))}
      </div>
    </div>
  );
}
