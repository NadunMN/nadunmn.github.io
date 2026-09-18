import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * A small label that follows the pointer while it is over any element with a
 * `data-cursor="Label"` attribute. Only active on devices with a fine pointer.
 */
export function CursorLabel() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 450, damping: 40, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 450, damping: 40, mass: 0.5 });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = (event.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(target?.getAttribute("data-cursor") ?? null);
    };
    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ x: springX, y: springY }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="label flex h-24 w-24 items-center justify-center rounded-full bg-signal px-3 text-center leading-tight text-ink"
          initial={false}
          animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0 }}
          transition={{ duration: 0.35, ease }}
        >
          {label}
        </motion.div>
      </div>
    </motion.div>
  );
}
