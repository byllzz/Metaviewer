import clsx from "clsx";
import type { Grade } from "@/types";

const GRADE_COLOR: Record<Grade, string> = {
  A: "#4ade80",
  B: "#a3e635",
  C: "#f0b27a",
  D: "#fb923c",
  F: "#f87171",
};

export function ScoreRing({ score, grade }: { score: number; grade: Grade }) {
  const color = GRADE_COLOR[grade];
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none" style={{ color }}>
          {score}
        </span>
        <span
          className={clsx("text-xs font-semibold mt-0.5")}
          style={{ color }}
        >
          {grade}
        </span>
      </div>
    </div>
  );
}
