import { ImageIcon, Globe } from "lucide-react";
import type { ExtractedMeta, PlatformId } from "@/types";
import { resolvePreview } from "@/lib/platformPreview";
import { StatusBadge } from "./StatusBadge";

const PLATFORM_LABEL: Record<PlatformId, string> = {
  google: "Google Search",
  x: "X / Twitter",
  linkedin: "LinkedIn",
  discord: "Discord",
  slack: "Slack",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  facebook: "Facebook",
  imessage: "iMessage",
};

const PLATFORM_USES: Record<PlatformId, string> = {
  google: "title + meta description",
  x: "title",
  linkedin: "title",
  discord: "theme-color",
  slack: "title",
  whatsapp: "title",
  telegram: "title",
  facebook: "title",
  imessage: "title",
};

function ImagePlaceholder({ tone = "gray" }: { tone?: "gray" | "teal" }) {
  return (
    <div
      className={
        tone === "teal"
          ? "h-16 w-16 rounded-md bg-teal-600/80 flex items-center justify-center shrink-0"
          : "aspect-[1.91/1] w-full rounded-t-md bg-gray-200/10 flex items-center justify-center"
      }
    >
      <ImageIcon className="text-gray-400" size={tone === "teal" ? 22 : 32} />
    </div>
  );
}

export function PlatformPreviewCard({
  platform,
  meta,
}: {
  platform: PlatformId;
  meta: ExtractedMeta;
}) {
  const data = resolvePreview(platform, meta);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 flex flex-col">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-medium text-fg">{PLATFORM_LABEL[platform]}</h3>
        <StatusBadge status={data.status} />
      </div>
      <p className="text-xs text-muted mb-3">Using: {PLATFORM_USES[platform]}</p>

      <div className="flex-1">
        {platform === "google" && (
          <div className="rounded-lg bg-fg text-background p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Globe size={14} />
              <span>
                {data.domain} <span className="text-gray-400">› Home</span>
              </span>
            </div>
            <div className="text-blue-700 text-lg leading-snug mb-1">
              {data.title}
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {data.description}
            </p>
          </div>
        )}

        {platform === "x" && (
          <div className="rounded-lg overflow-hidden border border-white/10 bg-fg text-background">
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.image}
                alt=""
                className="aspect-[1.91/1] w-full object-cover"
              />
            ) : (
              <ImagePlaceholder />
            )}
            <div className="p-3">
              <div className="text-xs text-gray-500">{data.domain}</div>
              <div className="font-semibold leading-snug">{data.title}</div>
              {data.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
                  {data.description}
                </p>
              )}
            </div>
          </div>
        )}

        {(platform === "linkedin" || platform === "facebook") && (
          <div className="rounded-lg overflow-hidden border border-white/10 bg-fg/5">
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.image}
                alt=""
                className="aspect-[1.91/1] w-full object-cover"
              />
            ) : (
              <ImagePlaceholder />
            )}
            <div className="p-3 bg-white/10">
              <div className="font-semibold text-sm leading-snug">
                {data.title}
              </div>
              <div className="text-xs text-muted uppercase mt-1">
                {data.domain}
              </div>
            </div>
          </div>
        )}

        {platform === "discord" && (
          <div className="rounded-md bg-fg/5 border-l-4 border-accent p-3">
            <div className="text-xs text-muted">{data.domain}</div>
            <div className="text-accent font-medium leading-snug">
              {data.title}
            </div>
            {data.description && (
              <p className="text-sm text-muted line-clamp-3 mt-1">
                {data.description}
              </p>
            )}
          </div>
        )}

        {platform === "slack" && (
          <div className="rounded-md bg-fg text-background border-l-4 border-blue-500 p-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
              <Globe size={12} />
              {data.domain}
            </div>
            <div className="text-blue-700 font-semibold leading-snug">
              {data.title}
            </div>
            {data.description && (
              <p className="text-sm text-gray-700 line-clamp-2 mt-0.5">
                {data.description}
              </p>
            )}
          </div>
        )}

        {platform === "whatsapp" && (
          <div className="rounded-md bg-teal-900/30 p-3 flex gap-3 items-start">
            <ImagePlaceholder tone="teal" />
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-snug">
                {data.title}
              </div>
              {data.description && (
                <p className="text-xs text-muted line-clamp-2 mt-0.5">
                  {data.description}
                </p>
              )}
              <div className="text-xs text-muted mt-1">{data.domain}</div>
            </div>
          </div>
        )}

        {platform === "telegram" && (
          <div className="rounded-md bg-emerald-900/30 border-l-4 border-emerald-500 p-3">
            <div className="font-semibold text-sm leading-snug">
              {data.title}
            </div>
            {data.description && (
              <p className="text-xs text-muted line-clamp-3 mt-0.5">
                {data.description}
              </p>
            )}
            <div className="text-xs text-emerald-400 mt-1">{data.domain}</div>
          </div>
        )}

        {platform === "imessage" && (
          <div className="rounded-md bg-fg/5 p-3">
            <div className="text-[10px] uppercase text-muted tracking-wide">
              {data.domain}
            </div>
            <div className="text-sm font-semibold leading-snug mt-0.5">
              {data.title}
            </div>
            {data.description && (
              <p className="text-xs text-muted line-clamp-2 mt-0.5">
                {data.description}
              </p>
            )}
          </div>
        )}
      </div>

      {data.issues.length > 0 && (
        <ul className="mt-3 space-y-1">
          {data.issues.map((issue) => (
            <li key={issue} className="text-xs text-amber-400 flex items-center gap-1">
              ⚠ {issue}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
