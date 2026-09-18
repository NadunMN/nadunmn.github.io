import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/** Markdown renderer styled for the paper surface. */
export function Prose({ children, className }: { children: string; className?: string }) {
  return (
    <article
      className={cn(
        "prose max-w-none break-words text-ink/80 md:prose-lg",
        "prose-headings:font-semibold prose-headings:tracking-[-0.03em] prose-headings:text-ink",
        "prose-h1:text-4xl prose-h2:text-3xl",
        "prose-p:leading-[1.75] prose-strong:text-ink prose-li:marker:text-ink/40",
        "prose-a:text-ink prose-a:decoration-signal prose-a:decoration-2 prose-a:underline-offset-4",
        "prose-code:rounded-sm prose-code:bg-ink/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:font-normal prose-code:text-ink prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:rounded-none prose-pre:bg-ink prose-pre:text-paper/90 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-paper/90",
        "prose-hr:border-ink/15 prose-th:font-mono prose-th:text-xs prose-th:uppercase prose-th:tracking-[0.12em] prose-th:text-ink/60",
        "prose-td:align-top prose-thead:border-ink/25 prose-tr:border-ink/10",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ node: _node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} />
            </div>
          ),
          a: ({ node: _node, href, ...props }) => (
            <a href={href} {...(href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})} {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </article>
  );
}
