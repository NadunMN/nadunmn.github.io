import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

interface SectionHeaderProps {
  index: string;
  label: string;
  aside?: ReactNode;
}

/** Hairline + numbered label that opens every section. */
export function SectionHeader({ index, label, aside }: SectionHeaderProps) {
  return (
    <div className="relative">
      <motion.div
        aria-hidden
        className="h-px origin-left bg-fg/20"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease }}
      />
      <div className="flex items-center gap-6 pt-4">
        <span className="label text-fg/45">({index})</span>
        <span className="label">{label}</span>
        {aside && <span className="label ml-auto text-right text-fg/45">{aside}</span>}
      </div>
    </div>
  );
}
