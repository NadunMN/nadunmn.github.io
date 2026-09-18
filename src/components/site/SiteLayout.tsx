import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="label sr-only z-[80] bg-signal px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
