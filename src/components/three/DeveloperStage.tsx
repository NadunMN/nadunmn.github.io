import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ease } from "@/lib/motion";
import { beatAt, beats } from "./choreography";
import type { Pointer } from "./DeveloperModel";

// three.js is only downloaded once the About section is near the viewport
const DeveloperScene = lazy(() => import("./DeveloperScene"));

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-end p-4">
      <span className="label text-ink/40">{label}</span>
    </div>
  );
}

interface DeveloperStageProps {
  /** The row the stage is sticky within on desktop; its scroll-through drives the story */
  trackRef: RefObject<HTMLElement | null>;
}

// Desktop: the stage is sticky, so play the story across the row it sticks in —
// starting once the stage is well into view and ending as it is about to unpin.
// Mobile: nothing is sticky, so play it across the stage's own pass through the viewport.
const DESKTOP_OFFSET = ["start 65%", "end 75%"] as const;
const MOBILE_OFFSET = ["start 85%", "end 40%"] as const;

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 768px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop;
}

/**
 * Interactive 3D stand-in for the About portrait. The scene choreography is
 * driven by scroll; the head follows the pointer and a click makes the
 * developer wave.
 */
export function DeveloperStage({ trackRef }: DeveloperStageProps) {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef<Pointer>({ x: 0, y: 0, active: false });
  const waveAt = useRef(-Infinity);
  const reducedMotion = !!useReducedMotion();
  const desktop = useIsDesktop();

  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [supported, setSupported] = useState(true);
  const [beat, setBeat] = useState(0);

  const { scrollYProgress } = useScroll({
    target: desktop ? trackRef : container,
    offset: desktop ? [...DESKTOP_OFFSET] : [...MOBILE_OFFSET],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => setBeat(beatAt(p)));

  useEffect(() => {
    setSupported(webglAvailable());
    const el = container.current;
    if (!el) return;
    // Load early (a screen ahead), but only render frames while actually on screen
    const preload = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
    const onScreen = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    preload.observe(el);
    onScreen.observe(el);
    return () => {
      preload.disconnect();
      onScreen.disconnect();
    };
  }, []);

  const onPointerMove = (event: React.PointerEvent) => {
    const rect = container.current!.getBoundingClientRect();
    pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    pointer.current.active = event.pointerType === "mouse";
  };

  return (
    <div
      ref={container}
      role="img"
      aria-label="3D illustration of Nadun, a developer typing on a laptop at a desk. It animates as you scroll: the laptop opens, he codes, and he leans back once the build ships."
      data-cursor="Say hi"
      className="relative aspect-[4/5] w-full cursor-pointer touch-pan-y select-none overflow-hidden bg-paper-dim"
      onPointerMove={onPointerMove}
      onPointerLeave={() => (pointer.current.active = false)}
      onClick={() => (waveAt.current = performance.now())}
    >
      {/* Faint blueprint grid behind the scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--ink) / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink) / 0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 50% 55%, black 30%, transparent 75%)",
        }}
      />

      {!supported ? (
        <Placeholder label="3D preview needs WebGL" />
      ) : (
        near && (
          <SceneBoundary fallback={<Placeholder label="3D preview unavailable" />}>
            <Suspense fallback={<Placeholder label="Loading scene…" />}>
              <DeveloperScene
                progress={scrollYProgress}
                pointer={pointer}
                waveAt={waveAt}
                reducedMotion={reducedMotion}
                active={visible}
              />
            </Suspense>
          </SceneBoundary>
        )
      )}

      <div aria-hidden className="pointer-events-none absolute left-4 top-4 flex items-center gap-3">
        <span className="label tabular-nums text-ink/40">{String(beat + 1).padStart(2, "0")}/03</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={beat}
            className="label text-ink/70"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease }}
          >
            {beats[beat]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
