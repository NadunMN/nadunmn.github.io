import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { profile } from "@/data/profile";
import { ease } from "@/lib/motion";

const navItems = [
  { label: "Work", to: "/#work" },
  { label: "Experience", to: "/#experience" },
  { label: "About", to: "/#about" },
  { label: "Contact", to: "/#contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const location = useLocation();
  const { scrollY } = useScroll();

  // Tuck the bar away while reading downwards, bring it back on any upward scroll
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setAtTop(y < 80);
    setHidden(y > 400 && y > previous);
  });

  // Close the menu whenever navigation happens
  useEffect(() => setOpen(false), [location.key]);

  // The overlay is mobile-only; close it if the viewport grows past the breakpoint
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = () => desktop.matches && setOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 text-paper mix-blend-difference"
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="shell flex h-[var(--nav-height)] items-center justify-between gap-6">
          <Link
            to="/"
            className="pointer-events-auto text-[1.0625rem] font-semibold tracking-[-0.03em]"
            aria-label="Nadun Madusanka — home"
          >
            NADUN.
          </Link>

          <p
            className={`label hidden text-paper/60 transition-opacity duration-500 lg:block ${atTop ? "opacity-100" : "opacity-0"}`}
          >
            {profile.title} — {profile.location}
          </p>

          <nav aria-label="Primary" className="pointer-events-auto hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="label link-underline py-2">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Dialog.Trigger className="label pointer-events-auto -mr-3 p-3 md:hidden">Menu</Dialog.Trigger>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Content forceMount asChild aria-describedby={undefined}>
              <motion.div
                className="theme-ink fixed inset-0 z-[60] flex flex-col md:hidden"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.6, ease }}
              >
                <Dialog.Title className="sr-only">Site menu</Dialog.Title>
                <div className="shell flex h-[var(--nav-height)] items-center justify-between">
                  <Link to="/" className="text-[1.0625rem] font-semibold tracking-[-0.03em]">
                    NADUN.
                  </Link>
                  <Dialog.Close className="label -mr-3 p-3">Close</Dialog.Close>
                </div>

                <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-center">
                  <ul className="border-t border-paper/15">
                    {navItems.map((item, i) => (
                      <li key={item.label} className="overflow-hidden border-b border-paper/15">
                        <motion.div
                          initial={{ y: "100%" }}
                          animate={{ y: "0%" }}
                          transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.06 }}
                        >
                          <Link to={item.to} className="flex items-baseline justify-between py-4">
                            <span className="display text-[13vw]">{item.label}</span>
                            <span className="label text-paper/40">0{i + 1}</span>
                          </Link>
                        </motion.div>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="shell flex flex-wrap items-center gap-x-6 gap-y-3 pb-8 pt-6">
                  <a href={`mailto:${profile.email}`} className="label">
                    Email
                  </a>
                  {profile.socials.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="label">
                      {social.label}
                    </a>
                  ))}
                  <a href={profile.cv} download className="label ml-auto text-signal">
                    CV ↓
                  </a>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
