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
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { Faq } from "@/components/Faq";

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
    title: "Image Analysis",
    body: "Analyze OG image dimensions, file size, load time, aspect ratio, and see how it fits each platform.",
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

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="flex flex-col items-center text-center px-6 pt-20 pb-24">
        <span className="text-xs px-3 py-1 rounded-full border border-border text-muted mb-6">
          Free &amp; Open Source
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight max-w-3xl">
          Your link previews are broken.{" "}
          <span className="text-accent block sm:inline">
            Find out why in seconds
          </span>
        </h1>

        <div className="mt-10 w-full flex justify-center">
          <AnalyzeForm />
        </div>
      </section>

      <section className="px-6 pb-16 bg-grid">
        <p className="max-w-2xl mx-auto text-center text-muted mb-12">
          Metaview goes beyond basic meta tag checking. Get detailed
          analysis, actionable fixes, and beautiful previews.
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

      <section className="px-6 pb-24">
        <h2 className="text-center text-muted mb-8">
          Everything you need to know about Metaview.
        </h2>
        <div className="max-w-2xl mx-auto">
          <Faq />
        </div>
      </section>

      <footer className="mt-auto border-t border-border/60 px-8 py-10">
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent/20 text-accent text-sm">
                ◆
              </span>
              <span className="font-serif text-lg">Metaview</span>
            </div>
            <p className="text-sm text-muted max-w-xs">
              See what matters in your website, with clear, actionable
              insights.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted hover:text-fg"
            >
              <Github size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="h-9 w-9 flex items-center justify-center rounded-md border border-border text-muted hover:text-fg"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
        <p className="text-xs text-muted mt-10">
          © {new Date().getFullYear()} Metaview. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
