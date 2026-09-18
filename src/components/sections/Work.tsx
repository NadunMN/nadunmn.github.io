import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { featuredProjects, projects } from "@/data/projects";
import { SectionHeader } from "@/components/site/SectionHeader";
import { LineReveal, Reveal } from "@/components/site/Motion";
import { ProjectBlock, ProjectRow } from "@/components/site/ProjectBlock";

export function Work() {
  const moreWork = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="theme-ink py-24 md:py-36">
      <div className="shell">
        <SectionHeader index="03" label="Selected work" aside={`${featuredProjects.length} case studies`} />

        <div className="mt-14 grid grid-cols-12 items-end gap-x-[var(--gutter)] gap-y-8 md:mt-24">
          <h2 className="display col-span-12 text-[clamp(2.75rem,15.5vw,13rem)] lg:col-span-9">
            <LineReveal lines={["Selected", "Work"]} />
          </h2>
          <Reveal className="col-span-12 md:col-span-6 lg:col-span-3">
            <p className="max-w-[36ch] text-[1.0625rem] leading-relaxed text-paper/65">
              Systems built for real operations — from logistics platforms to developer tooling. Each one opens into a
              case study covering the problem, the build and the result.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 space-y-28 md:mt-32 md:space-y-44">
          {featuredProjects.map((project, i) => (
            <ProjectBlock key={project.slug} project={project} index={i} total={featuredProjects.length} />
          ))}
        </div>

        {moreWork.length > 0 && (
          <div className="mt-32 md:mt-44">
            <Reveal>
              <div className="flex items-end justify-between gap-6 pb-6">
                <h3 className="text-[clamp(1.75rem,3vw,2.75rem)] font-semibold tracking-[-0.04em]">More work</h3>
                <Link to="/works" className="label link-underline flex items-center gap-2 pb-1">
                  All work ({projects.length}) <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
            <ul className="border-t border-paper/15">
              {moreWork.map((project) => (
                <ProjectRow key={project.slug} project={project} index={projects.indexOf(project)} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
