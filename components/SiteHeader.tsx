import Link from "next/link";
import { Github } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-border/60">
      <Link href="/" className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/20 text-accent">
          ◆
        </span>
        <span className="font-serif text-xl tracking-wide">Metaviewer</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="h-9 flex items-center gap-2 px-3 rounded-md border border-border text-sm text-fg hover:bg-fg/5 transition-colors"
        >
          <Github size={16} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
