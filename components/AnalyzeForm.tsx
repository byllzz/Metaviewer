"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { saveResult } from "@/lib/localHistory";

const EXAMPLES = ["stripe.com", "vercel.com", "linear.app"];

export function AnalyzeForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(value: string) {
    const target = value.trim();
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }
      saveResult(data);
      router.push(`/results/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(url);
        }}
        className="flex items-center gap-3 w-full max-w-2xl"
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter any URL to analyze…"
          className="flex-1 h-12 rounded-lg bg-fg/5 border border-border px-4 text-sm placeholder:text-muted focus:outline-none focus:border-accent/60 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-12 shrink-0 px-5 rounded-lg bg-accent text-black font-medium text-sm flex items-center gap-2 hover:bg-accent-light transition-colors disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Analyze <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

      <div className="flex items-center gap-2 text-sm text-muted mt-4">
        <span>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => submit(ex)}
            className="text-accent hover:underline"
            type="button"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
