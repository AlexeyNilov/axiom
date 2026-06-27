import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Axiom",
  description: "Trace artwork observations into software design experiments.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="shell">
          <nav className="topbar" aria-label="Primary">
            <Link className="brand" href="/">
              Axiom
            </Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
