import type { AnalysisResult } from "@/types";

// Simple in-memory store keyed by id. Results are also cached on the
// client, but this lets a freshly-generated share link resolve
// server-side within the same runtime instance.
// For production, swap this for Redis / a KV store / a database.

declare global {
  // eslint-disable-next-line no-var
  var __metaviewStore: Map<string, AnalysisResult> | undefined;
}

const store: Map<string, AnalysisResult> =
  global.__metaviewStore ?? new Map<string, AnalysisResult>();

if (!global.__metaviewStore) {
  global.__metaviewStore = store;
}

export function saveResult(result: AnalysisResult): void {
  store.set(result.id, result);
}

export function getResult(id: string): AnalysisResult | undefined {
  return store.get(id);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
