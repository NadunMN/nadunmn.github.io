import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { Schematic } from "./Schematic";

interface ProjectMediaProps {
  project: Project;
  index: number;
  className?: string;
  eager?: boolean;
}

/** Screenshot (or schematic) with gentle scroll parallax and a hover zoom driven by a parent `group`. */
export function ProjectMedia({ project, index, className, eager }: ProjectMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  // Schematics carry edge labels, so only screenshots get the oversized parallax frame
  const parallax = !reduceMotion && Boolean(project.image);

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-ink-soft", className)}>
      <motion.div
        className={cn("absolute inset-x-0", parallax ? "-inset-y-[6%]" : "inset-y-0")}
        style={parallax ? { y } : undefined}
      >
        <div className="h-full w-full transition-transform [transition-duration:1400ms] ease-editorial group-hover:scale-[1.035]">
          {project.image ? (
            <img
              src={project.image.src}
              width={project.image.width}
              height={project.image.height}
              alt={`${project.title} — interface screenshot`}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <Schematic project={project} index={index} />
          )}
        </div>
      </motion.div>
    </div>
  );
}
