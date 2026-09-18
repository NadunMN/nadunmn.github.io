import { education } from "@/data/profile";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Motion";

export function Education() {
  return (
    <section id="education" className="theme-paper pb-24 md:pb-36">
      <div className="shell">
        <SectionHeader index="06" label="Education" />

        <Reveal className="mt-10 grid grid-cols-12 items-end gap-x-[var(--gutter)] gap-y-6 md:mt-14">
          <h3 className="col-span-12 text-balance text-[clamp(2rem,4.6vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] md:col-span-8">
            {education.institution}
          </h3>
          <div className="col-span-12 flex items-end justify-between gap-6 border-t border-ink/15 pt-4 md:col-span-4 md:border-0 md:pt-0">
            <p className="text-lg tracking-[-0.01em]">{education.degree}</p>
            <p className="label flex items-center gap-2 whitespace-nowrap pb-1">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ink" />
              {education.status}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
