import { blogPosts } from "@/data/posts";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageIntro } from "@/components/site/PageIntro";
import { PostRow } from "@/components/sections/Blog";
import { usePageMeta } from "@/hooks/use-page-meta";

const Blogs = () => {
  usePageMeta("Writing", "Articles and technical notes by Nadun Madusanka on infrastructure, networking and security.");

  return (
    <SiteLayout>
      <div className="theme-ink pb-24 md:pb-36">
        <PageIntro
          eyebrow={`Writing — ${blogPosts.length} articles`}
          title={["Field", "notes"]}
          description="Longer-form technical write-ups on infrastructure, networking and security — step by step, from configuration to verification."
        />
        <div className="shell">
          <ul className="border-t border-paper/15">
            {blogPosts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
        </div>
      </div>
    </SiteLayout>
  );
};

export default Blogs;
