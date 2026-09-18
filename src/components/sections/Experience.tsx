import { motion } from "framer-motion";
import { experiences, formatMonth } from "@/data/experience";
import { SectionHeader } from "@/components/site/SectionHeader";
import { LineReveal, Reveal } from "@/components/site/Motion";
import { ease } from "@/lib/motion";

const toMonths = (iso: string | null) => {
  const date = iso ? new Date(`${iso}-01T00:00:00`) : new Date();
  return date.getFullYear() * 12 + date.getMonth();
};

/** Horizontal axis showing how the roles overlap in time. */
function Timeline() {
  const start = Math.min(...experiences.map((e) => toMonths(e.start)));
  const end = toMonths(null) + 1;
  const span = end - start;
  const years = Array.from(
    { length: Math.floor(end / 12) - Math.ceil(start / 12) + 1 },
    (_, i) => Math.ceil(start / 12) + i,
  );

  return (
    <div aria-hidden className="relative mt-14 hidden md:block">
      <div className="relative h-5">
        <span className="label absolute left-0 top-0 text-ink/45">{formatMonth(experiences[0].start)}</span>
        <span className="label absolute right-0 top-0 text-ink/45">Today</span>
        {years.map((year) => (
          <span
            key={year}
            className="label absolute top-0 -translate-x-1/2 text-ink/45"
            style={{ left: `${((year * 12 - start) / span) * 100}%` }}
          >
            {year}
          </span>
        ))}
      </div>
      <div className="relative mt-3 space-y-2 border-y border-ink/15 py-4">
        {experiences.map((exp) => {
          const left = ((toMonths(exp.start) - start) / span) * 100;
          const width = ((toMonths(exp.end) + 1 - toMonths(exp.start)) / span) * 100;
          return (
            <div key={exp.company} className="relative h-7">
              <motion.div
                className="absolute inset-y-0 flex origin-left items-center justify-between gap-4 bg-ink px-3 text-paper"
                style={{ left: `${left}%`, width: `${width}%` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease }}
              >
                <span className="label whitespace-nowrap">{exp.company}</span>
                {!exp.end && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="theme-paper py-24 md:py-36">
      <div className="shell">
        <SectionHeader index="04" label="Experience" aside="Chronological" />

        <h2 className="display mt-14 text-[clamp(2.75rem,15.5vw,13rem)] md:mt-24">
          <LineReveal lines={["Experience"]} />
        </h2>

        <Timeline />

        <ol className="mt-12 border-t border-ink/15 md:mt-16">
          {experiences.map((exp, i) => (
            <li key={exp.company} className="group border-b border-ink/15">
              <Reveal className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-5 py-10 md:py-14">
                <div className="col-span-12 flex items-center justify-between gap-4 md:col-span-3 md:flex-col md:items-start md:justify-start">
                  <p className="label">
                    <time dateTime={exp.start}>{formatMonth(exp.start)}</time> —{" "}
                    {exp.end ? <time dateTime={exp.end}>{formatMonth(exp.end)}</time> : "Present"}
                  </p>
                  <p className="label text-ink/40">{String(i + 1).padStart(2, "0")}</p>
                </div>

                <div className="col-span-12 md:col-span-5">
                  <h3 className="text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] transition-transform duration-700 ease-editorial md:group-hover:translate-x-2">
                    {exp.company}
                  </h3>
                  <p className="mt-3 text-lg tracking-[-0.01em] text-ink/70">{exp.role}</p>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <p className="text-[1.0625rem] leading-relaxed text-ink/75">{exp.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                    {exp.stack.map((item) => (
                      <li key={item} className="font-mono text-[0.8125rem] text-ink/60">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
