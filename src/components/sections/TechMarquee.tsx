import { marqueeItems } from "@/data/profile";
import { Marquee } from "@/components/site/Marquee";

export function TechMarquee() {
  return (
    <section aria-label="Core technologies" className="theme-ink border-y border-paper/15 py-6 md:py-8">
      <Marquee
        items={marqueeItems}
        duration={50}
        className="text-[clamp(1.75rem,4.6vw,4.25rem)] font-medium uppercase leading-none tracking-[-0.03em] text-paper/80"
      />
    </section>
  );
}
