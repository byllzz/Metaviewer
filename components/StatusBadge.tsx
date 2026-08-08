import clsx from "clsx";

export type BadgeStatus = "perfect" | "warning" | "error";

const LABEL: Record<BadgeStatus, string> = {
  perfect: "Perfect",
  warning: "Warning",
  error: "Error",
};

const STYLE: Record<BadgeStatus, string> = {
  perfect: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  error: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span
      className={clsx(
        "text-xs font-medium px-2 py-0.5 rounded-md border",
        STYLE[status]
      )}
    >
      {LABEL[status]}
    </span>
  );
}
