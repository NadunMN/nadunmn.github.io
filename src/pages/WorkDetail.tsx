import { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LineReveal, Reveal } from "@/components/site/Motion";
import { ProjectMedia } from "@/components/site/ProjectMedia";
import { ArchitectureDiagram } from "@/components/site/ArchitectureDiagram";
import { Prose } from "@/components/site/Prose";
import { usePageMeta } from "@/hooks/use-page-meta";
import NotFound from "./NotFound";

const pad = (n: number) => String(n).padStart(2, "0");

/** One numbered chapter of a case study: sticky label on the left, content on the right. */
function Chapter({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-12 gap-x-[var(--gutter)] gap-y-6 border-t border-paper/15 py-14 md:py-24">
      <div className="col-span-12 md:col-span-4">
        <div className="md:sticky md:top-[calc(var(--nav-height)+1.5rem)]">
          <p className="label text-paper/45">({pad(index)})</p>
          <h2 className="mt-3 text-[clamp(1.75rem,2.6vw,2.5rem)] font-semibold uppercase leading-none tracking-[-0.04em]">
            {title}
          </h2>
        </div>
      </div>
      <Reveal className="col-span-12 md:col-span-8">{children}</Reveal>
    </section>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="border-t border-paper/15">
      {items.map((item, i) => (
        <li
          key={item}
          className="grid grid-cols-[2.5rem_1fr] items-baseline border-b border-paper/15 py-5 text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug tracking-[-0.015em]"
        >
          <span className="label text-paper/40">{pad(i + 1)}</span>
          {item}
        </li>
      ))}
    </ol>
  );
}

const WorkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  usePageMeta(project?.title, project?.summary);

  if (!project) return <NotFound />;

  const next = projects[(index + 1) % projects.length];
  const { caseStudy } = project;

  return (
    <SiteLayout>
      <article className="theme-ink">
        <header className="shell pt-[calc(var(--nav-height)+2.5rem)] md:pt-[calc(var(--nav-height)+4rem)]">
          <div className="flex items-center justify-between gap-6 border-t border-paper/20 pt-4">
            <Link to="/works" className="label link-underline inline-flex items-center gap-2">
              <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
              All work
            </Link>
            <span className="label text-paper/45">
              Case study {pad(index + 1)} / {pad(projects.length)}
            </span>
          </div>

          <h1 className="mt-14 max-w-[16ch] text-balance text-[clamp(2.75rem,7.5vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] md:mt-20">
            <LineReveal trigger="load" delay={0.1} lines={[project.title]} />
          </h1>

          <Reveal className="mt-10 max-w-[44ch] text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.3] tracking-[-0.02em] text-paper/75 md:mt-14">
            {project.summary}
          </Reveal>

          <Reveal className="mt-14 md:mt-20">
            <dl className="grid grid-cols-2 border-t border-paper/15 md:grid-cols-4">
              {[
                ["Role", project.role],
                ["Year", project.year],
                ["Type", project.category],
                ["Stack", project.tech.join(", ")],
              ].map(([term, value]) => (
                <div key={term} className="border-b border-paper/15 py-5 pr-4 md:border-b-0">
                  <dt className="label text-paper/45">{term}</dt>
                  <dd className="mt-3 text-[0.9375rem] leading-snug">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </header>

        <div className="shell mt-6 md:mt-10">
          <ProjectMedia
            project={project}
            index={index}
            eager
            className="-mx-[var(--gutter)] aspect-[4/3] md:mx-0 md:aspect-[16/9]"
          />
        </div>

        <div className="shell mt-16 md:mt-28">
          <Chapter index={1} title="The problem">
            <p className="text-balance text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.2] tracking-[-0.03em]">
              {caseStudy.problem}
            </p>
          </Chapter>

          <Chapter index={2} title="The solution">
            <p className="text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.6] text-paper/80">{caseStudy.solution}</p>
            <div className="mt-10">
              <ArchitectureDiagram tiers={caseStudy.architecture} caption={`Architecture — ${project.title}`} />
            </div>
          </Chapter>

          <Chapter index={3} title="My role">
            <p className="label mb-5 text-paper/45">{project.role}</p>
            <NumberedList items={caseStudy.contributions} />
          </Chapter>

          <Chapter index={4} title="Technology">
            <ul className="flex flex-wrap gap-x-[0.5em] text-[clamp(2rem,4.4vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
              {project.tech.map((tech, i) => (
                <li key={tech}>
                  {tech}
                  {i < project.tech.length - 1 && <span className="text-paper/25"> /</span>}
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter index={5} title="Result">
            <NumberedList items={caseStudy.outcome} />
            {project.links && (
              <div className="mt-10 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex h-12 items-center gap-4 border border-paper/25 px-5 transition-colors hover:border-paper"
                  >
                    <span className="label">{link.label}</span>
                    <ArrowUpRight
                      aria-hidden
                      className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ))}
              </div>
            )}
          </Chapter>
        </div>

        {project.content && (
          <section className="theme-paper py-20 md:py-32">
            <div className="shell grid grid-cols-12 gap-x-[var(--gutter)] gap-y-10">
              <div className="col-span-12 md:col-span-4">
                <p className="label text-ink/45">(06)</p>
                <h2 className="mt-3 text-[clamp(1.75rem,2.6vw,2.5rem)] font-semibold uppercase leading-none tracking-[-0.04em]">
                  Technical notes
                </h2>
              </div>
              <div className="col-span-12 md:col-span-8">
                <Prose>{project.content}</Prose>
              </div>
            </div>
          </section>
        )}

        <Link to={`/works/${next.slug}`} className="group block border-t border-paper/15">
          <div className="shell py-16 md:py-28">
            <p className="label flex items-center justify-between text-paper/45">
              <span>Next project</span>
              <span>{pad(projects.indexOf(next) + 1)}</span>
            </p>
            <p className="mt-8 flex items-end justify-between gap-6">
              <span className="text-balance text-[clamp(2.5rem,7vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] transition-transform duration-700 ease-editorial group-hover:translate-x-3">
                {next.title}
              </span>
              <ArrowRight
                aria-hidden
                className="mb-2 h-10 w-10 shrink-0 transition-all duration-700 ease-editorial group-hover:translate-x-2 group-hover:text-signal md:h-16 md:w-16"
              />
            </p>
          </div>
        </Link>
      </article>
    </SiteLayout>
  );
};

export default WorkDetail;
