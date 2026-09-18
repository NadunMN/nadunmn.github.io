import { profile } from "@/data/profile";
import { SectionHeader } from "@/components/site/SectionHeader";
import { LineReveal, Reveal } from "@/components/site/Motion";

const focusAreas = [
  "Backend development",
  "Enterprise systems",
  "Cloud infrastructure",
  "DevOps",
  "AI-powered applications",
];

export function About() {
  return (
    <section id="about" className="theme-paper py-24 md:py-36">
      <div className="shell">
        <SectionHeader index="01" label="About" aside="Who I am" />

        <h2 className="mt-14 text-[clamp(2.75rem,8.4vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.05em] md:mt-24">
          <LineReveal
            lines={[
              "I build software",
              <>
                that solves <span className="editorial-italic tracking-[-0.02em]">real problems.</span>
              </>,
            ]}
          />
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-x-[var(--gutter)] gap-y-12 md:mt-28">
          <Reveal className="col-span-12 sm:col-span-8 md:col-span-4">
            <figure className="group">
              <div className="overflow-hidden bg-paper-dim">
                <img
                  src={profile.portrait.src}
                  srcSet={profile.portrait.srcSet}
                  sizes="(min-width: 768px) 30vw, 70vw"
                  width={profile.portrait.width}
                  height={profile.portrait.height}
                  alt="Portrait of Nadun Madusanka"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover object-top grayscale transition-all [transition-duration:1200ms] ease-editorial group-hover:scale-[1.02] group-hover:grayscale-0"
                />
              </div>
              <figcaption className="label mt-3 flex justify-between text-ink/50">
                <span>{profile.name}</span>
                <span>{profile.location}</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <Reveal>
              <p className="text-balance text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.2] tracking-[-0.025em]">
                I'm Nadun — a Computer Science graduate from the University of Colombo School of Computing, and a
                software engineer focused on the backend: the APIs, data models and infrastructure that keep real
                systems running.
              </p>
            </Reveal>

            <Reveal className="mt-10 grid gap-6 text-[1.0625rem] leading-[1.7] text-ink/70 lg:grid-cols-2 lg:gap-10">
              <p>
                At JDNBrothers I build a transport and logistics management platform with Spring Boot, React and
                PostgreSQL, shipped to AWS through Docker and GitHub Actions. Alongside that, I work on enterprise
                systems as an ERP technical consultant at Altria Consulting, developing in SAP ABAP.
              </p>
              <p>
                I'm increasingly drawn to AI-powered software — using models as a practical tool inside real products.
                Away from the keyboard I hike and explore nature, and that same curiosity shapes how I approach
                problems: look from a different angle, then build the simplest thing that works.
              </p>
            </Reveal>

            <Reveal className="mt-14">
              <p className="label mb-4 text-ink/45">Focus</p>
              <ul className="border-t border-ink/15">
                {focusAreas.map((area, i) => (
                  <li
                    key={area}
                    className="flex items-baseline justify-between border-b border-ink/15 py-3.5 text-lg tracking-[-0.01em]"
                  >
                    {area}
                    <span className="label text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
