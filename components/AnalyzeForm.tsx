"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

const EXAMPLES = ["stripe.com", "vercel.com", "linear.app"];

export function AnalyzeForm() {
  const [url, setUrl] = useState("");
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();

  function submit(value: string) {
    const target = value.trim();
    if (!target || navigating) return;
    setNavigating(true);
    router.push(`/analyzing?url=${encodeURIComponent(target)}`);
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
          disabled={navigating}
          className="h-12 shrink-0 px-5 rounded-lg bg-accent text-black font-medium text-sm flex items-center gap-2 hover:bg-accent-light transition-colors disabled:opacity-60"
        >
          {navigating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              Analyze <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-2 text-sm text-muted mt-4">
        <span>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => submit(ex)}
            className="text-accent hover:underline"
            type="button"
            disabled={navigating}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
