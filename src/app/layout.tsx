import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Health Analyst",
  description: "AI-powered health and fitness insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="nav-header">
          <Link href="/" className="nav-logo">
            🥗 AI Analyst
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Humans</Link>
            <Link href="/animals" className="nav-link">Animals</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
