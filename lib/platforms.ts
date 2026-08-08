import type { PlatformDef } from "@/types";

export const PLATFORMS: PlatformDef[] = [
  { id: "google", name: "Google Search", group: "search", usesFields: ["title", "description"] },
  { id: "x", name: "X / Twitter", group: "social", usesFields: ["twitter:card", "twitter:title"] },
  { id: "linkedin", name: "LinkedIn", group: "social", usesFields: ["og:title"] },
  { id: "discord", name: "Discord", group: "messaging", usesFields: ["theme-color"] },
  { id: "slack", name: "Slack", group: "messaging", usesFields: ["og:title"] },
  { id: "whatsapp", name: "WhatsApp", group: "messaging", usesFields: ["og:title"] },
  { id: "telegram", name: "Telegram", group: "messaging", usesFields: ["og:title"] },
  { id: "facebook", name: "Facebook", group: "social", usesFields: ["og:title"] },
  { id: "imessage", name: "iMessage", group: "messaging", usesFields: ["og:title"] },
];
