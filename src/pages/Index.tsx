import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { About } from "@/components/sections/About";
import { Numbers } from "@/components/sections/Numbers";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Expertise } from "@/components/sections/Expertise";
import { Education } from "@/components/sections/Education";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { usePageMeta } from "@/hooks/use-page-meta";

const Index = () => {
  usePageMeta();

  return (
    <SiteLayout>
      <Hero />
      <TechMarquee />
      <About />
      <Numbers />
      <Work />
      <Experience />
      <Expertise />
      <Education />
      <Blog />
      <Contact />
    </SiteLayout>
  );
};

export default Index;
