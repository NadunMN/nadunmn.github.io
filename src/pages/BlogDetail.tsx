import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/data/posts";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LineReveal, Reveal } from "@/components/site/Motion";
import { Prose } from "@/components/site/Prose";
import { usePageMeta } from "@/hooks/use-page-meta";
import NotFound from "./NotFound";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);
  usePageMeta(post?.title, post?.excerpt);

  if (!post) return <NotFound />;

  return (
    <SiteLayout>
      <article>
        <header className="theme-ink">
          <div className="shell pb-16 pt-[calc(var(--nav-height)+2.5rem)] md:pb-24 md:pt-[calc(var(--nav-height)+4rem)]">
            <div className="flex items-center justify-between gap-6 border-t border-paper/20 pt-4">
              <Link to="/blog" className="label link-underline inline-flex items-center gap-2">
                <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
                All articles
              </Link>
              <span className="label text-paper/45">{post.category}</span>
            </div>

            <h1 className="mt-14 max-w-[20ch] text-balance text-[clamp(2.5rem,6vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] md:mt-20">
              <LineReveal trigger="load" delay={0.1} lines={[post.title]} />
            </h1>

            <Reveal className="mt-12 grid gap-8 border-t border-paper/15 pt-6 md:grid-cols-12">
              <p className="max-w-[52ch] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-relaxed text-paper/70 md:col-span-7">
                {post.excerpt}
              </p>
              <dl className="flex gap-10 md:col-span-4 md:col-start-9 md:justify-end">
                <div>
                  <dt className="label text-paper/45">Published</dt>
                  <dd className="mt-2">{post.date}</dd>
                </div>
                <div>
                  <dt className="label text-paper/45">Reading</dt>
                  <dd className="mt-2">{post.readTime}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </header>

        <div className="theme-paper py-16 md:py-28">
          <div className="shell">
            <Prose className="mx-auto max-w-[72ch]">{post.content}</Prose>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
};

export default BlogDetail;
