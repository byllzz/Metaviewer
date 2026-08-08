"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is Metaview really free?",
    a: "Yes. Metaview is free and open source. Run it yourself or use the hosted version with no account required.",
  },
  {
    q: "Do you store or track my URLs?",
    a: "Checks are processed to generate your report and results are kept only long enough to render your shareable link. Your history is saved locally in your browser, not tied to an account.",
  },
  {
    q: "How accurate are the platform previews?",
    a: "Previews are built from each platform's documented behavior for resolving Open Graph and Twitter Card tags. Actual rendering can vary slightly as platforms update their crawlers.",
  },
  {
    q: "Why can't I check localhost URLs?",
    a: "Metaview needs to reach your site the same way an external crawler would, so local or private-network URLs can't be analyzed. Deploy a preview or use a tunnel like ngrok first.",
  },
  {
    q: "What's a good score?",
    a: "80 and above (B or better) usually means previews will render correctly across major platforms. Anything below 60 typically means broken or missing previews somewhere.",
  },
  {
    q: "How is the score calculated?",
    a: "Metaview runs 35+ checks across six categories — essential tags, Open Graph, Twitter/X, images, technical setup, and extras — each weighted by how much it affects preview quality.",
  },
  {
    q: "Can I use this in my CI/CD pipeline?",
    a: "Yes, the underlying checks are exposed as an API you can call from a script or pipeline step to fail a build when your score drops below a threshold.",
  },
  {
    q: "How do I contribute?",
    a: "Metaview is open source — check the GitHub repository for contribution guidelines, open issues, and the roadmap.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border/60 border-t border-border/60">
      {FAQS.map((item, i) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left"
          >
            <span className="font-medium text-fg">{item.q}</span>
            <ChevronDown
              size={18}
              className={`text-muted transition-transform ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <p className="text-sm text-muted pb-4 pr-8">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
