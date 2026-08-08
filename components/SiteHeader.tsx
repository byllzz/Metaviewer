import Link from "next/link";
import { Github, Moon } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border/60">
      <Link href="/" className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/20 text-accent">
          ◆
        </span>
        <span className="font-serif text-xl tracking-wide">Metaview</span>
      </Link>
      <div className="flex items-center gap-2">
        <button
          aria-label="Toggle theme"
          className="h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted hover:text-white transition-colors"
        >
          <Moon size={16} />
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="h-9 flex items-center gap-2 px-3 rounded-md border border-border text-sm text-white hover:bg-white/5 transition-colors"
        >
          <Github size={16} />
          GitHub
        </a>
      </div>
    </header>
  );
}
