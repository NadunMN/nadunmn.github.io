import { projects } from "@/data/projects";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { ProjectBlock } from "@/components/site/ProjectBlock";
import { usePageMeta } from "@/hooks/use-page-meta";

const Works = () => {
  usePageMeta(
    "Work",
    "Case studies and projects by Nadun Madusanka — backend systems, platforms, infrastructure and developer tools.",
  );

  return (
    <SiteLayout>
      <div className="theme-ink pb-24 md:pb-36">
        <PageIntro
          eyebrow={`Index — ${projects.length} projects`}
          title={["All work"]}
          description="Products, platforms and experiments — each with the problem it addresses, how it was built, and what came out of it."
        />
        <div className="shell space-y-28 md:space-y-44">
          {projects.map((project, i) => (
            <ProjectBlock key={project.slug} project={project} index={i} total={projects.length} />
          ))}
        </div>
      </div>
    </SiteLayout>
  );
};

export default Works;
