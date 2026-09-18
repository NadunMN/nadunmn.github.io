import { Project } from "@/data/projects";

/**
 * Typographic system drawing used as a project cover when no screenshot exists.
 * Sized with container query units so it scales with its frame.
 */
export function Schematic({ project, index }: { project: Project; index: number }) {
  const { code, core, modules } = project.schematic;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-ink-soft text-paper [container-type:size]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--paper) / 0.045) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--paper) / 0.045) 1px, transparent 1px)",
        backgroundSize: "5cqw 5cqw",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-[4.5cqw] font-mono text-[max(9px,1.25cqw)] uppercase tracking-[0.12em] text-paper/55">
        <div className="flex justify-between gap-4">
          <span>fig. {String(index + 1).padStart(2, "0")} — system overview</span>
          <span className="hidden text-right sm:block">{project.category}</span>
        </div>

        {/* Diagram */}
        <div className="mx-auto flex w-[78cqw] flex-col items-center">
          <div className="flex items-center gap-[1.2cqw] border border-paper/60 bg-ink-soft px-[2.4cqw] py-[1.6cqw] text-paper">
            <span className="h-[max(6px,0.9cqw)] w-[max(6px,0.9cqw)] rounded-full bg-signal" />
            {core}
          </div>
          <div className="h-[5cqh] w-px bg-paper/40" />
          <div className="relative grid w-full" style={{ gridTemplateColumns: `repeat(${modules.length}, 1fr)` }}>
            <div
              className="absolute top-0 h-px bg-paper/40"
              style={{ left: `${50 / modules.length}%`, right: `${50 / modules.length}%` }}
            />
            {modules.map((module) => (
              <div key={module} className="flex flex-col items-center">
                <div className="h-[5cqh] w-px bg-paper/40" />
                <div className="w-[88%] border border-paper/30 bg-ink-soft py-[1.4cqw] text-center text-paper/80">
                  {module}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <span className="font-sans text-[9cqw] font-semibold leading-[0.8] tracking-[-0.05em] text-paper/90">
            {code}
          </span>
          <span className="hidden pb-[0.6cqw] sm:block">{project.year}</span>
        </div>
      </div>
    </div>
  );
}
