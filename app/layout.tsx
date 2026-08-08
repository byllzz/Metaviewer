import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metaview – Your link previews are broken. Find out why.",
  description:
    "Analyze your website's Open Graph tags, Twitter Cards, and meta tags. See exactly how your links preview on Google, X, LinkedIn, Discord, Slack, WhatsApp, Telegram, Facebook, and iMessage.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
