import { expertise } from "@/data/profile";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Motion";

export function Expertise() {
  return (
    <section id="expertise" className="theme-paper pb-24 md:pb-36">
      <div className="shell">
        <SectionHeader index="05" label="Technical expertise" aside={`${expertise.length} disciplines`} />

        <ul className="mt-12 border-t border-ink/15 md:mt-16">
          {expertise.map((group, i) => (
            <li key={group.area}>
              <Reveal y={16} delay={i * 0.04}>
                <div className="group grid grid-cols-12 items-baseline gap-x-[var(--gutter)] gap-y-3 border-b border-ink/15 py-6 md:py-9">
                  <span className="label col-span-2 text-ink/40 transition-colors duration-500 group-hover:text-signal md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="col-span-10 text-[clamp(1.75rem,4.4vw,4.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.045em] transition-transform duration-700 ease-editorial group-hover:translate-x-2 md:col-span-5">
                    {group.area}
                  </h3>
                  <p className="col-span-10 col-start-3 text-[clamp(1.0625rem,1.6vw,1.5rem)] leading-snug tracking-[-0.015em] text-ink/70 md:col-span-6 md:col-start-auto md:text-right">
                    {group.items.join(" · ")}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
