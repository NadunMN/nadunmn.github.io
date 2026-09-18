import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { LineReveal } from "@/components/site/Motion";
import { ease } from "@/lib/motion";
import { StatusDot } from "@/components/site/StatusDot";

// Sized so "MADUSANKA" spans the content width of the page shell
const nameSize = "min(calc((100vw - 2 * var(--gutter)) / 6.15), calc((1680px - 6rem) / 6.15))";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease, delay },
});

export function Hero() {
  return (
    <section id="hero" className="theme-ink relative flex min-h-[100svh] flex-col pt-[var(--nav-height)]">
      <div className="shell flex flex-1 flex-col">
        <motion.div {...fadeUp(0.1)} className="flex items-center justify-between gap-4 pt-6 md:pt-10">
          <p className="label flex items-center gap-3">
            <StatusDot />
            {profile.availability}
          </p>
          <p className="label hidden text-paper/50 sm:block">Portfolio — {new Date().getFullYear()}</p>
        </motion.div>

        <div className="flex flex-1 flex-col justify-end pb-8 pt-16 md:pb-10">
          <h1 className="display" style={{ fontSize: nameSize }}>
            <span className="sr-only">
              {profile.name}, {profile.title}
            </span>
            <span aria-hidden className="flex items-end justify-between gap-[0.2em]">
              <LineReveal trigger="load" delay={0.2} lines={["Nadun"]} />
              <motion.span
                {...fadeUp(0.75)}
                className="editorial-italic hidden pb-[0.12em] text-[0.3em] leading-none text-paper/85 md:block"
              >
                Software Engineer
              </motion.span>
            </span>
            <span aria-hidden className="-ml-[0.04em] block">
              <LineReveal trigger="load" delay={0.3} lines={["Madusanka"]} />
            </span>
          </h1>

          <motion.p
            {...fadeUp(0.7)}
            aria-hidden
            className="editorial-italic mt-3 text-[clamp(2rem,9vw,3rem)] leading-none text-paper/85 md:hidden"
          >
            Software Engineer
          </motion.p>
        </div>

        <motion.div
          aria-hidden
          className="h-px origin-left bg-paper/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, ease, delay: 0.5 }}
        />

        <motion.div
          {...fadeUp(0.9)}
          className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-8 pb-8 pt-6 md:pb-10 md:pt-8"
        >
          <p className="col-span-12 max-w-[34ch] text-balance text-[clamp(1.375rem,2.2vw,2rem)] font-normal leading-[1.2] tracking-[-0.02em] md:col-span-6 lg:col-span-5">
            {profile.statement}
          </p>

          <ul className="col-span-12 flex flex-wrap gap-x-3 gap-y-2 md:col-span-3 md:flex-col md:gap-2 lg:col-span-3 lg:col-start-7">
            {profile.tagline.map((item, i) => (
              <li key={item} className="label text-paper/55">
                {item}
                {i < profile.tagline.length - 1 && <span className="md:hidden"> ·</span>}
              </li>
            ))}
          </ul>

          <div className="col-span-12 flex flex-col gap-3 sm:flex-row md:col-span-3 md:flex-col md:items-stretch lg:col-start-10">
            <Link
              to="/#work"
              className="group flex h-14 items-center justify-between gap-6 bg-paper px-5 text-ink transition-colors duration-300 hover:bg-signal sm:flex-1 md:flex-none"
            >
              <span className="label">View my work</span>
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-x-1"
              />
            </Link>
            <a
              href={profile.cv}
              download={profile.cvFileName}
              className="group flex h-14 items-center justify-between gap-6 border border-paper/25 px-5 transition-colors duration-300 hover:border-paper sm:flex-1 md:flex-none"
            >
              <span className="label">Download CV</span>
              <ArrowDown
                aria-hidden
                className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-y-0.5"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
