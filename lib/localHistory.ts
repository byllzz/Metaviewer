"use client";

import type { AnalysisResult } from "@/types";

// All persistence for Metaviewer lives in the browser (localStorage) for now.
// There is no backend database — every function here is a thin wrapper
// around localStorage so it's a single, obvious place to swap in Supabase
// later (same function signatures, swap the body for `supabase.from(...)`).

const RESULT_PREFIX = "metaviewer:result:";
const HISTORY_KEY = "metaviewer:history";
const THEME_KEY = "metaviewer:theme";
const MAX_HISTORY = 50;

export interface HistoryEntry {
  id: string;
  url: string;
  finalUrl: string;
  score: number;
  grade: string;
  fetchedAt: string;
  passCount: number;
  warningCount: number;
  errorCount: number;
}

function isBrowser() {
  return typeof window !== "undefined";
}

/** Cache a full analysis result locally, keyed by its id. */
export function saveResult(result: AnalysisResult): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(RESULT_PREFIX + result.id, JSON.stringify(result));
  } catch {
    // localStorage full or unavailable — fail silently, history is best-effort.
  }
  addToHistory(result);
}

export function getResult(id: string): AnalysisResult | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(RESULT_PREFIX + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AnalysisResult;
  } catch {
    return null;
  }
}

function addToHistory(result: AnalysisResult): void {
  if (!isBrowser()) return;
  const list = getHistory().filter((h) => h.id !== result.id);
  list.unshift({
    id: result.id,
    url: result.requestedUrl,
    finalUrl: result.finalUrl,
    score: result.totalScore,
    grade: result.grade,
    fetchedAt: result.fetchedAt,
    passCount: result.checks.filter((c) => c.status === "pass").length,
    warningCount: result.checks.filter((c) => c.status === "warning").length,
    errorCount: result.checks.filter((c) => c.status === "error").length,
  });
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
  } catch {
    // ignore quota errors
  }
}

export function getHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function removeFromHistory(id: string): void {
  if (!isBrowser()) return;
  const list = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  localStorage.removeItem(RESULT_PREFIX + id);
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  const list = getHistory();
  list.forEach((h) => localStorage.removeItem(RESULT_PREFIX + h.id));
  localStorage.removeItem(HISTORY_KEY);
}

export function getStoredTheme(): "dark" | "light" | null {
  if (!isBrowser()) return null;
  return (localStorage.getItem(THEME_KEY) as "dark" | "light" | null) ?? null;
}

export function setStoredTheme(theme: "dark" | "light"): void {
  if (!isBrowser()) return;
  localStorage.setItem(THEME_KEY, theme);
}
