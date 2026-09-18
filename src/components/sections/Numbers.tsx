import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { highlights } from "@/data/profile";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Motion";

/** Counts numeric values up from zero once visible; non-numeric values (e.g. ∞) render as-is. */
function Figure({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);
  const [display, setDisplay] = useState(
    match && !reduceMotion ? "0".padStart(match[1].length, "0") + match[2] : value,
  );

  useEffect(() => {
    if (!match || !inView || reduceMotion) return;
    const [, digits, suffix] = match;
    const controls = animate(0, Number(digits), {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setDisplay(String(Math.round(n)).padStart(digits.length, "0") + suffix),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden>{display}</span>
    </span>
  );
}

export function Numbers() {
  return (
    <section id="numbers" className="theme-paper pb-24 md:pb-36">
      <div className="shell">
        <SectionHeader index="02" label="By the numbers" />

        <ul className="mt-12 grid grid-cols-2 border-l border-t border-ink/15 md:mt-16 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <li key={item.label} className="border-b border-r border-ink/15">
              <Reveal
                delay={i * 0.08}
                className="flex h-full min-h-[15rem] flex-col justify-between gap-10 p-4 sm:p-6 md:min-h-[22rem]"
              >
                <span className="text-[clamp(4rem,11vw,10rem)] font-semibold leading-[0.8] tracking-[-0.06em]">
                  <Figure value={item.value} />
                </span>
                <span className="max-w-[26ch] text-[0.9375rem] leading-snug text-ink/65">{item.label}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
