import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/data/posts";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Motion";

export function PostRow({ post }: { post: (typeof blogPosts)[number] }) {
  return (
    <li className="group border-b border-fg/15">
      <Link
        to={`/blog/${post.slug}`}
        className="grid grid-cols-12 items-baseline gap-x-[var(--gutter)] gap-y-3 py-7 transition-colors duration-500 hover:bg-fg/[0.03] md:py-9"
      >
        <span className="label col-span-12 text-fg/50 md:col-span-3">
          {post.date} · {post.category}
        </span>
        <span className="col-span-11 text-balance text-[clamp(1.375rem,2.4vw,2.25rem)] font-medium leading-[1.1] tracking-[-0.035em] transition-transform duration-700 ease-editorial group-hover:translate-x-2 md:col-span-7">
          {post.title}
        </span>
        <span className="label hidden whitespace-nowrap text-fg/50 md:col-span-1 md:block">{post.readTime}</span>
        <ArrowUpRight
          aria-hidden
          className="col-span-1 h-5 w-5 justify-self-end transition-transform duration-500 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal"
        />
      </Link>
    </li>
  );
}

export function Blog() {
  return (
    <section id="blog" className="theme-ink py-24 md:py-36">
      <div className="shell">
        <SectionHeader index="07" label="Writing" aside="Infrastructure & security" />

        <Reveal className="mt-10 flex items-end justify-between gap-6 md:mt-14">
          <h2 className="text-[clamp(2rem,4.6vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            Field notes
          </h2>
          <Link to="/blog" className="label link-underline flex items-center gap-2 pb-2">
            All articles <ArrowRight aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </Reveal>

        <ul className="mt-10 border-t border-paper/15">
          {blogPosts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </ul>
      </div>
    </section>
  );
}
