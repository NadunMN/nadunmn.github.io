import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { usePageMeta } from "@/hooks/use-page-meta";

const NotFound = () => {
  usePageMeta("Page not found");

  return (
    <SiteLayout>
      <section className="theme-ink flex min-h-[100svh] flex-col justify-end pb-16 pt-[var(--nav-height)]">
        <div className="shell">
          <p className="label text-paper/45">Error — 404</p>
          <h1 className="display mt-6 text-[clamp(6rem,30vw,28rem)]">404</h1>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-paper/15 pt-6">
            <p className="max-w-[32ch] text-xl leading-snug text-paper/70">
              This page doesn't exist — it may have moved, or the link is incorrect.
            </p>
            <Link
              to="/"
              className="group inline-flex h-14 items-center gap-4 bg-paper px-5 text-ink transition-colors hover:bg-signal"
            >
              <ArrowLeft aria-hidden className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="label">Back home</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NotFound;
