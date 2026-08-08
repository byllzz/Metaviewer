import clsx from "clsx";
import type { CategoryScore } from "@/types";

function barColor(pct: number): string {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 50) return "bg-accent";
  if (pct > 0) return "bg-orange-600";
  return "bg-red-500/70";
}

export function CategoryBars({ categories }: { categories: CategoryScore[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-6 pt-6 border-t border-border/60">
      {categories.map((c) => {
        const pct = c.possible === 0 ? 0 : (c.earned / c.possible) * 100;
        return (
          <div key={c.category}>
            <div className="text-sm text-muted mb-1">{c.label}</div>
            <div className="text-base font-medium mb-2">
              {c.earned}/{c.possible}
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={clsx("h-full rounded-full", barColor(pct))}
                style={{ width: `${Math.max(pct, 3)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
