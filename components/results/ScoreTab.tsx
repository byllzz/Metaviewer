"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AnalysisResult, CheckCategory, MetaCheck } from "@/types";
import { StatusIcon } from "@/components/results/StatusIcon";

const CATEGORY_ICONS: Record<CheckCategory, string> = {
  essential: "◆",
  opengraph: "⇄",
  twitter: "𝕏",
  images: "▣",
  technical: "⚙",
  extras: "✦",
};

function CheckRow({ check }: { check: MetaCheck }) {
  const [open, setOpen] = useState(false);
  const hasFix = check.status !== "pass";

  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        onClick={() => hasFix && setOpen((v) => !v)}
        className={`w-full flex items-start justify-between gap-4 py-3.5 text-left ${hasFix ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <StatusIcon status={check.status} />
          <div className="min-w-0">
            <p className="text-sm font-medium">{check.label}</p>
            <p className="text-sm text-muted mt-0.5">{check.message}</p>
            {check.value && <p className="text-xs text-muted/70 mt-1 font-mono truncate">{check.value}</p>}
          </div>
        </div>
        {hasFix && (
          <ChevronDown size={15} className={`text-muted shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>
      {open && hasFix && (
        <div className="pb-4 pl-7 tab-panel">
          <div className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted">
            <span className="text-fg font-medium">How to fix: </span>
            {check.fix ?? check.message}
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({
  label,
  checks,
  defaultOpen,
}: {
  label: string;
  checks: MetaCheck[];
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const passed = checks.filter((c) => c.status === "pass").length;
  const warnings = checks.filter((c) => c.status === "warning").length;
  const errors = checks.filter((c) => c.status === "error").length;
  const points = checks.length;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden rise-in">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-accent">{CATEGORY_ICONS[checks[0]?.category ?? "essential"]}</span>
          <div className="text-left">
            <h3 className="font-medium">{label}</h3>
            <p className="text-xs text-muted">{points} checks</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <StatusIcon status="pass" size={12} /> {passed}
          </span>
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <StatusIcon status="warning" size={12} /> {warnings}
          </span>
          <span className="flex items-center gap-1 text-xs text-red-400">
            <StatusIcon status="error" size={12} /> {errors}
          </span>
          <ChevronDown size={16} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="px-6 pb-2 border-t border-border/60 tab-panel">
          {checks.map((c) => (
            <CheckRow key={c.id} check={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ScoreTab({ result }: { result: AnalysisResult }) {
  const [statusFilter, setStatusFilter] = useState<"all" | "pass" | "warning" | "error">("all");

  const passed = result.checks.filter((c) => c.status === "pass").length;
  const warnings = result.checks.filter((c) => c.status === "warning").length;
  const errors = result.checks.filter((c) => c.status === "error").length;

  const filtered = statusFilter === "all" ? result.checks : result.checks.filter((c) => c.status === statusFilter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            ["all", `All (${result.checks.length})`],
            ["pass", `Passed (${passed})`],
            ["warning", `Warnings (${warnings})`],
            ["error", `Failed (${errors})`],
          ] as [typeof statusFilter, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-3 h-8 rounded-md text-sm border transition-colors ${
              statusFilter === value ? "bg-fg text-background border-fg" : "border-border text-muted hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {result.categoryScores.map((cat, i) => {
        const checks = filtered.filter((c) => c.category === cat.category);
        if (checks.length === 0) return null;
        return (
          <div key={cat.category} style={{ animationDelay: `${i * 50}ms` }}>
            <CategorySection label={`${cat.label} · ${cat.earned}/${cat.possible} points`} checks={checks} defaultOpen={i < 2} />
          </div>
        );
      })}
    </div>
  );
}
