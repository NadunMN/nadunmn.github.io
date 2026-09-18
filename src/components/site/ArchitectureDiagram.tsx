import { ArchitectureTier } from "@/data/projects";
import { Reveal } from "./Motion";

/** Tiered architecture drawing: labelled layers joined by a single request path. */
export function ArchitectureDiagram({ tiers, caption }: { tiers: ArchitectureTier[]; caption: string }) {
  return (
    <figure className="border border-fg/15 bg-fg/[0.02] p-5 sm:p-8">
      <ol className="relative">
        {tiers.map((tier, i) => (
          <li key={tier.label}>
            <Reveal delay={i * 0.08} y={16}>
              <div className="grid gap-3 sm:grid-cols-[8.5rem_1fr] sm:items-center sm:gap-6">
                <span className="label text-fg/50">
                  {String(i + 1).padStart(2, "0")} · {tier.label}
                </span>
                <ul className="flex flex-wrap gap-2">
                  {tier.nodes.map((node, n) => (
                    <li
                      key={node}
                      className={
                        n === 0
                          ? "flex items-center gap-2 border border-fg/70 px-3 py-2 font-mono text-[0.8125rem]"
                          : "border border-fg/25 px-3 py-2 font-mono text-[0.8125rem] text-fg/75"
                      }
                    >
                      {n === 0 && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" />}
                      {node}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            {i < tiers.length - 1 && (
              <div aria-hidden className="grid sm:grid-cols-[8.5rem_1fr] sm:gap-6">
                <div className="hidden sm:block" />
                <div className="ml-6 flex h-8 flex-col items-start">
                  <span className="h-full w-px bg-fg/30" />
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="label mt-6 border-t border-fg/15 pt-4 text-fg/45">{caption}</figcaption>
    </figure>
  );
}
