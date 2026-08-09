import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="flex items-center w-full max-w-[1100px] mx-auto justify-between px-4 sm:px-6 py-3 border-b border-border/60">
      <Link
        href="/"
        className="flex items-center gap-2"
        aria-label="Metaviewer home"
      >
        <Image
          src="/favicon.svg"
          alt=""
          width={22}
          height={22}
          className="text-accent"
        />
        <span className="font-serif text-xl tracking-wide">Metaviewer</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <a
          href="https://github.com/byllzz/Metaviewer"
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
