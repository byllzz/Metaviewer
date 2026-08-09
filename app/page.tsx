import {
  Eye,
  Target,
  Wand2,
  ImageIcon,
  FileJson,
  Share2,
  Download,
  Zap,
  History,
  Github,
  Twitter,
  Link2,
  ScanSearch,
  ListChecks,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { RecentAnalysis } from "@/components/RecentAnalysis";
import { Faq } from "@/components/Faq";
import { PLATFORMS } from "@/lib/platforms";

const FEATURES = [
  {
    icon: Eye,
    title: "9+ Platform Previews",
    body: "See exactly how your links appear on Google, X, LinkedIn, Discord, Slack, WhatsApp, Telegram, Facebook, and iMessage.",
  },
  {
    icon: Target,
    title: "35+ Quality Checks",
    body: "Comprehensive scoring across essential tags, Open Graph, Twitter Cards, images, technical SEO, and more.",
  },
  {
    icon: Wand2,
    title: "Copy-Paste Fixes",
    body: "Get framework-specific code snippets for Next.js, Astro, Hugo, and plain HTML. Just copy and paste.",
  },
  {
    icon: ImageIcon,
    title: "Real Image Analysis",
    body: "Decoded image dimensions, file size, aspect ratio, and how it fits each platform - not just declared meta tags.",
  },
  {
    icon: FileJson,
    title: "Raw Data Export",
    body: "View and download all meta tags as JSON, CSV, or raw HTML. Perfect for documentation and debugging.",
  },
  {
    icon: Share2,
    title: "Shareable Results",
    body: "Every result has a unique URL. Share your score with your team or on social media.",
  },
  {
    icon: Download,
    title: "Export as PNG",
    body: "Generate beautiful score report cards to share on X and impress your followers.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    body: "Optimized for performance. Get results in seconds, not minutes.",
  },
  {
    icon: History,
    title: "Local History",
    body: "All your checks are saved locally. Track improvements over time without any account.",
  },
];

const STEPS = [
  {
    icon: Link2,
    title: "Paste a URL",
    body: "Drop in any public link - your homepage, a blog post, a product page.",
  },
  {
    icon: ScanSearch,
    title: "We analyze it",
    body: "Metaviewer fetches the page and runs 35+ checks across meta tags, images, and technical setup.",
  },
  {
    icon: ListChecks,
    title: "Get a scored report",
    body: "See your grade, exactly what's missing, and copy-paste fixes for every platform preview.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="flex flex-col items-center text-center px-6 pt-16 pb-14">
        <span className="text-xs px-3 py-1 rounded-full border border-border text-muted mb-6">
          Free &amp; Open Source
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl leading-tightest tracking-tight max-w-3xl">
          Your link previews are broken.{" "}
          <span className="text-accent block sm:inline">
            Find out why in seconds
          </span>
        </h1>

        <div
          id="analyze"
          className="mt-9 w-full flex justify-center scroll-mt-24"
        >
          <AnalyzeForm />
        </div>
      </section>

      <RecentAnalysis />

      <section className="px-6 py-24 border-t border-border/60">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative text-center sm:text-left">
              <div className="flex items-center gap-3 sm:flex-col sm:items-start justify-center sm:justify-start">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-accent sm:mb-4">
                  <step.icon size={18} />
                </span>
                <span className="text-xs text-muted font-mono sm:hidden">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-medium mt-3 sm:mt-0">
                <span className="hidden sm:inline text-muted font-mono text-xs mr-2">
                  0{i + 1}
                </span>
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mt-1.5">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-14 bg-grid border-t border-border/60">
        <p className="max-w-2xl mx-auto text-center text-muted mb-10">
          Metaviewer goes beyond basic meta tag checking. Get detailed analysis,
          actionable fixes, and beautiful previews.
        </p>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-background p-6">
              <f.icon size={20} className="text-muted mb-6" />
              <h3 className="font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-14 border-t border-border/60">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-muted mb-8">
            Checked against every major platform
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5">
            {PLATFORMS.map((p) => (
              <span
                key={p.id}
                className="px-3.5 py-2 rounded-lg border border-border bg-surface text-sm text-muted"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <h2 className="text-center text-muted mb-8">
          Everything you need to know about Metaviewer.
        </h2>
        <div className="max-w-2xl mx-auto">
          <Faq />
        </div>
      </section>


      <footer className="mt-auto w-full max-w-[1150px] mx-auto border-t border-border/60 px-8 py-10">
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent/20 text-accent text-sm">
                ◆
              </span>
              <span className="font-serif text-lg">Metaviewer</span>
            </div>
            <p className="text-sm text-muted max-w-xs">
              See what matters in your website, with clear, actionable insights.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://github.com/byllzz/Metaviewer"
              target="_blank"
              rel="noreferrer"
              className="h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted hover:text-fg transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href="https://twitter.com/bilalmlkdev"
              target="_blank"
              rel="noreferrer"
              className="h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted hover:text-fg transition-colors"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
        <div
          className="flex items-center justify-center pointer-events-none select-none leading-[1]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 40%, transparent 90%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 40%, transparent 90%)",
          }}
        >
          <span className="text-[80px] sm:text-[120px] md:text-[200px] font-extrabold font-DM tracking-tighter text-gray-200">
            Metaviewer
          </span>
        </div>
        <p className="text-xs text-muted mt-6">
          © {new Date().getFullYear()} Metaviewer. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
