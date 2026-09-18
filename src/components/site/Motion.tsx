import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Fades and lifts content in once it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

interface LineRevealProps {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** "load" plays immediately (hero), "view" waits for the element to scroll into view */
  trigger?: "load" | "view";
}

/** Slides each line up from behind a mask — used for display headings. */
export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  trigger = "view",
}: LineRevealProps) {
  // The wrapper is observed (not the masked lines, which start clipped and would never intersect)
  const play = trigger === "load" ? { animate: "shown" } : { whileInView: "shown" };

  return (
    <motion.span
      className={cn("block", className)}
      initial="hidden"
      {...play}
      viewport={{ once: true, amount: 0.3 }}
    >
      {lines.map((line, i) => (
        <span key={i} className={cn("block overflow-hidden pb-[0.08em] -mb-[0.08em]", lineClassName)}>
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: { y: "110%" },
              shown: { y: "0%", transition: { duration: 1.1, ease, delay: delay + i * stagger } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
