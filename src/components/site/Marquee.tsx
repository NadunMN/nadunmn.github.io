import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  /** Seconds per full loop */
  duration?: number;
}

/** Continuously scrolling line of type. Pauses on hover, stops for reduced motion. */
export function Marquee({ items, className, duration = 45 }: MarqueeProps) {
  const sequence = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <Fragment key={item}>
          <span className="whitespace-nowrap px-[0.35em]">{item}</span>
          <span className="px-[0.35em] font-mono text-signal/90" aria-hidden>
            //
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <p className="sr-only">{items.join(", ")}</p>
      <div
        aria-hidden
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {sequence(false)}
        {sequence(true)}
      </div>
    </div>
  );
}
