import type { AnalysisResult } from "@/types";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function slug(result: AnalysisResult): string {
  try {
    return new URL(result.finalUrl).hostname.replace(/\./g, "-");
  } catch {
    return "metaview";
  }
}

export function exportAsJson(result: AnalysisResult) {
  download(`metaview-${slug(result)}.json`, JSON.stringify(result, null, 2), "application/json");
}

export function exportAsCsv(result: AnalysisResult) {
  const rows = [["Category", "Check", "Status", "Message", "Value"]];
  result.checks.forEach((c) => {
    rows.push([c.category, c.label, c.status, c.message, c.value ?? ""]);
  });
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  download(`metaview-${slug(result)}.csv`, csv, "text/csv");
}

export function exportAsHtml(result: AnalysisResult) {
  const tags: string[] = [];
  if (result.meta.title) tags.push(`<title>${escapeHtml(result.meta.title)}</title>`);
  if (result.meta.description)
    tags.push(`<meta name="description" content="${escapeHtml(result.meta.description)}">`);
  if (result.meta.canonical)
    tags.push(`<link rel="canonical" href="${escapeHtml(result.meta.canonical)}">`);
  if (result.meta.viewport) tags.push(`<meta name="viewport" content="${escapeHtml(result.meta.viewport)}">`);
  if (result.meta.themeColor)
    tags.push(`<meta name="theme-color" content="${escapeHtml(result.meta.themeColor)}">`);
  if (result.meta.robots) tags.push(`<meta name="robots" content="${escapeHtml(result.meta.robots)}">`);
  Object.entries(result.meta.og).forEach(([k, v]) => {
    tags.push(`<meta property="${escapeHtml(k)}" content="${escapeHtml(v)}">`);
  });
  Object.entries(result.meta.twitter).forEach(([k, v]) => {
    tags.push(`<meta name="${escapeHtml(k)}" content="${escapeHtml(v)}">`);
  });
  download(`metaview-${slug(result)}.html`, tags.join("\n"), "text/html");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function exportAsPng(node: HTMLElement, result: AnalysisResult) {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    backgroundColor: getComputedStyle(document.documentElement)
      .getPropertyValue("--color-background")
      ? `rgb(${getComputedStyle(document.documentElement).getPropertyValue("--color-background")})`
      : "#0a0a0a",
  });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `metaview-${slug(result)}-score.png`;
  a.click();
}
