import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "@/data/profile";
import { SectionHeader } from "@/components/site/SectionHeader";
import { LineReveal, Reveal } from "@/components/site/Motion";
import { StatusDot } from "@/components/site/StatusDot";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    ...profile.socials.filter((s) => s.label !== "Instagram"),
    { label: "Email", href: `mailto:${profile.email}` },
  ];

  return (
    <section id="contact" className="theme-ink pb-10 pt-24 md:pt-36">
      <div className="shell">
        <SectionHeader
          index="08"
          label="Contact"
          aside={
            <span className="inline-flex items-center gap-3">
              <StatusDot /> {profile.availability}
            </span>
          }
        />

        <h2 className="display mt-14 text-[clamp(2.75rem,15.5vw,14rem)] md:mt-24">
          <LineReveal
            lines={[
              "Let's build",
              <>
                Something<span className="text-signal">.</span>
              </>,
            ]}
          />
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-x-[var(--gutter)] gap-y-12 md:mt-24">
          <Reveal className="col-span-12 md:col-span-5">
            <p className="max-w-[24ch] text-balance text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.15] tracking-[-0.025em]">
              Have a project, opportunity, or interesting problem?
            </p>
          </Reveal>

          <Reveal className="col-span-12 md:col-span-7" delay={0.1}>
            <p className="label mb-4 text-paper/45">Write to me</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-paper/20 pb-5">
              <a
                href={`mailto:${profile.email}`}
                className="break-all text-[clamp(1.5rem,3.4vw,3.25rem)] font-medium leading-none tracking-[-0.04em] transition-colors duration-300 hover:text-signal"
              >
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="label ml-auto inline-flex items-center gap-2 border border-paper/25 px-3 py-2.5 transition-colors hover:border-paper"
              >
                {copied ? (
                  <Check aria-hidden className="h-3.5 w-3.5 text-signal" />
                ) : (
                  <Copy aria-hidden className="h-3.5 w-3.5" />
                )}
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <ul className="mt-2">
              {links.map((link) => (
                <li key={link.label} className="group border-b border-paper/15">
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="flex items-center justify-between py-5 text-xl tracking-[-0.02em] md:text-2xl"
                  >
                    <span className="transition-transform duration-700 ease-editorial group-hover:translate-x-2">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="h-5 w-5 transition-transform duration-500 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal"
                    />
                  </a>
                </li>
              ))}
              <li className="group border-b border-paper/15">
                <a
                  href={profile.cv}
                  download
                  className="flex items-center justify-between py-5 text-xl tracking-[-0.02em] md:text-2xl"
                >
                  <span className="transition-transform duration-700 ease-editorial group-hover:translate-x-2">
                    Download CV
                  </span>
                  <ArrowDown
                    aria-hidden
                    className="h-5 w-5 transition-transform duration-500 ease-editorial group-hover:translate-y-1 group-hover:text-signal"
                  />
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
