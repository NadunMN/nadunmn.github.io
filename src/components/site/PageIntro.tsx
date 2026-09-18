import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LineReveal, Reveal } from "./Motion";

interface PageIntroProps {
  eyebrow: string;
  title: string[];
  description?: ReactNode;
  backTo?: string;
  backLabel?: string;
}

/** Opening block for secondary pages (all work, writing). */
export function PageIntro({ eyebrow, title, description, backTo = "/", backLabel = "Home" }: PageIntroProps) {
  return (
    <header className="shell pb-16 pt-[calc(var(--nav-height)+2.5rem)] md:pb-24 md:pt-[calc(var(--nav-height)+4rem)]">
      <div className="flex items-center justify-between gap-6 border-t border-fg/20 pt-4">
        <Link to={backTo} className="label link-underline inline-flex items-center gap-2">
          <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
        <span className="label text-fg/45">{eyebrow}</span>
      </div>

      <h1 className="display mt-14 text-[clamp(3.5rem,13vw,13rem)] md:mt-20">
        <LineReveal trigger="load" delay={0.1} lines={title} />
      </h1>

      {description && (
        <Reveal className="mt-10 max-w-[48ch] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-relaxed text-fg/65 md:ml-auto md:mt-14">
          {description}
        </Reveal>
      )}
    </header>
  );
}
