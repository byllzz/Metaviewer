"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, ScanSearch, ListChecks, AlertCircle } from "lucide-react";
import { saveResult } from "@/lib/localHistory";

const STEPS = [
  { icon: Globe, label: "Fetching the page" },
  { icon: ScanSearch, label: "Parsing meta tags" },
  { icon: ListChecks, label: "Scoring & building previews" },
];

function AnalyzingScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const url = params.get("url") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!url) {
      router.replace("/");
      return;
    }
    if (started.current) return;
    started.current = true;

    const stepTimer = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 900);

    (async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Something went wrong.");
          return;
        }
        saveResult(data);
        router.replace(`/results/${data.id}`);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        clearInterval(stepTimer);
      }
    })();

    return () => clearInterval(stepTimer);
  }, [url, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertCircle size={22} />
        </span>
        <p className="text-muted max-w-sm">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="text-accent hover:underline text-sm"
        >
          Back to homepage
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 text-center px-6">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-accent">
          <ScanSearch size={22} />
        </div>
      </div>

      <div>
        <p className="text-lg">
          Analyzing <span className="text-accent">{url.replace(/^https?:\/\//, "")}</span>
        </p>
        <p className="text-sm text-muted mt-1">
          Metaviewer servers are fetching and scoring this page — just a moment.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={s.label}
              className={`flex items-center gap-3 text-sm transition-colors ${
                done || active ? "text-fg" : "text-muted/50"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  done
                    ? "bg-accent border-accent text-black"
                    : active
                      ? "border-accent text-accent"
                      : "border-border"
                }`}
              >
                <s.icon size={13} />
              </span>
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyzingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AnalyzingScreen />
    </Suspense>
  );
}
