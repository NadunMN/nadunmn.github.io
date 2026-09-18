import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";
import { ProjectMedia } from "./ProjectMedia";
import { Reveal } from "./Motion";

const pad = (n: number) => String(n).padStart(2, "0");

interface ProjectBlockProps {
  project: Project;
  index: number;
  total: number;
}

/** Large editorial project entry: number, title, dominant media, then role / summary / stack. */
export function ProjectBlock({ project, index, total }: ProjectBlockProps) {
  const href = `/works/${project.slug}`;

  return (
    <article className="group relative">
      <Reveal>
        <div className="grid grid-cols-12 items-baseline gap-x-[var(--gutter)] gap-y-4 border-t border-fg/15 pt-5">
          <p className="label col-span-6 text-fg/50 md:col-span-2">
            {pad(index + 1)} / {pad(total)}
          </p>
          <p className="label col-span-6 text-right text-fg/50 md:order-3 md:col-span-2">{project.year}</p>
          <h3 className="col-span-12 text-balance text-[clamp(2.1rem,5.2vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] md:order-2 md:col-span-8">
            <Link
              to={href}
              className="block transition-transform duration-700 ease-editorial md:group-hover:translate-x-4"
            >
              {project.title}
            </Link>
          </h3>
        </div>
      </Reveal>

      <Reveal className="mt-8 md:mt-10">
        <div className="grid grid-cols-12 gap-x-[var(--gutter)]">
          <Link
            to={href}
            tabIndex={-1}
            aria-hidden
            data-cursor="View case"
            className="col-span-12 -mx-[var(--gutter)] block md:col-span-10 md:col-start-3 md:mx-0 [@media(pointer:fine)]:cursor-none"
          >
            <ProjectMedia project={project} index={index} className="aspect-[4/3] md:aspect-[16/9]" />
          </Link>
        </div>
      </Reveal>

      <Reveal className="mt-6 md:mt-8">
        <div className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-6">
          <p className="col-span-12 text-lg leading-relaxed text-fg/75 md:order-2 md:col-span-4 md:text-[1.0625rem]">
            {project.summary}
          </p>

          <dl className="col-span-6 space-y-2 md:order-1 md:col-span-3 md:col-start-3">
            <dt className="label text-fg/45">Role</dt>
            <dd className="text-[0.95rem] leading-snug">{project.role}</dd>
          </dl>

          <dl className="col-span-6 space-y-2 md:order-3 md:col-span-3">
            <dt className="label text-fg/45">Stack</dt>
            <dd>
              <ul className="font-mono text-[0.8125rem] leading-relaxed text-fg/80">
                {project.tech.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </dd>
          </dl>

          <div className="col-span-12 md:order-4 md:col-span-10 md:col-start-3">
            <Link
              to={href}
              className="inline-flex items-center gap-3 border-b border-fg/30 pb-1.5 text-[0.95rem] font-medium transition-colors hover:border-signal"
            >
              View project
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-x-1.5"
              />
              <span className="sr-only">— {project.title}</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </article>
  );
}

/** Compact row for secondary work. */
export function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <li className="group border-b border-fg/15">
      <Link
        to={`/works/${project.slug}`}
        className="grid grid-cols-12 items-baseline gap-x-[var(--gutter)] gap-y-1 py-6 transition-colors duration-500 hover:bg-fg/[0.03] md:py-7"
      >
        <span className="label col-span-2 text-fg/45 md:col-span-1">{pad(index + 1)}</span>
        <span className="col-span-10 text-[clamp(1.5rem,3vw,2.75rem)] font-semibold leading-none tracking-[-0.04em] transition-transform duration-700 ease-editorial group-hover:translate-x-3 md:col-span-5">
          {project.title}
        </span>
        <span className="label col-span-10 col-start-3 text-fg/55 md:col-span-3 md:col-start-auto">
          {project.category}
        </span>
        <span className="label hidden text-fg/55 md:col-span-2 md:block">{project.year}</span>
        <ArrowUpRight
          aria-hidden
          className="col-span-1 hidden h-5 w-5 justify-self-end transition-transform duration-500 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal md:block"
        />
      </Link>
    </li>
  );
}
