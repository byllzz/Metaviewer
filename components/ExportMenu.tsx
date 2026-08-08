"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileJson, FileSpreadsheet, FileCode, Image as ImageIcon } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { exportAsJson, exportAsCsv, exportAsHtml, exportAsPng } from "@/lib/exportResult";

export function ExportMenu({
  result,
  captureRef,
}: {
  result: AnalysisResult;
  captureRef: React.RefObject<HTMLElement>;
}) {
  const [open, setOpen] = useState(false);
  const [exportingPng, setExportingPng] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handlePng() {
    if (!captureRef.current) return;
    setExportingPng(true);
    try {
      await exportAsPng(captureRef.current, result);
    } finally {
      setExportingPng(false);
      setOpen(false);
    }
  }

  const items = [
    { label: "JSON", icon: FileJson, onClick: () => exportAsJson(result) },
    { label: "CSV", icon: FileSpreadsheet, onClick: () => exportAsCsv(result) },
    { label: "Raw meta tags (HTML)", icon: FileCode, onClick: () => exportAsHtml(result) },
    { label: exportingPng ? "Generating PNG…" : "Score card (PNG)", icon: ImageIcon, onClick: handlePng },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-sm text-muted hover:text-fg"
      >
        <Download size={14} /> Export
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-surface shadow-xl z-20 py-1">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                if (item.label !== items[3].label) setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted hover:text-fg hover:bg-fg/5 text-left"
            >
              <item.icon size={14} /> {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
