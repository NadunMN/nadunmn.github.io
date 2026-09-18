import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the top on route changes, or to the element named by the hash
 * (e.g. /#work), waiting briefly for the target section to mount.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let attempts = 0;
    let timer: number;

    const scroll = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      } else if (attempts++ < 20) {
        timer = window.setTimeout(scroll, 50);
      }
    };

    const frame = requestAnimationFrame(scroll);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname, hash, key]);

  return null;
}
