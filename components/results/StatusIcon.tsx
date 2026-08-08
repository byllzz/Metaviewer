import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { CheckStatus } from "@/types";

export function StatusIcon({ status, size = 16 }: { status: CheckStatus; size?: number }) {
  if (status === "pass") return <CheckCircle2 size={size} className="text-emerald-400" />;
  if (status === "warning") return <AlertTriangle size={size} className="text-amber-400" />;
  return <XCircle size={size} className="text-red-400" />;
}
