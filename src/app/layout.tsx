import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Analyst Dashboard — Intelligent Insights for Animals, Humans & More",
  description: "A premium AI-powered analyst dashboard delivering health, fitness, and structural insights through advanced vision models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
