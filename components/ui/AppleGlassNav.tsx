"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Boxes,
  CircuitBoard,
  Compass,
  FlaskConical,
  Mail,
} from "lucide-react";
import { useEffect, useState, type PointerEvent } from "react";

const destinations = [
  { href: "#about", label: "About", icon: Compass },
  { href: "#metrics", label: "Metrics", icon: Activity },
  { href: "#suite", label: "Architecture", icon: Boxes },
  { href: "#labs", label: "Labs", icon: CircuitBoard },
  { href: "#ecosystem", label: "Ecosystem", icon: FlaskConical },
  { href: "#contact", label: "Contact", icon: Mail },
] as const;

type Destination = (typeof destinations)[number]["href"];

function useVisibleSection() {
  const [active, setActive] = useState<Destination>("#about");

  useEffect(() => {
    const ids = destinations.map((item) => item.href.slice(1));
    let frame = 0;

    const update = () => {
      // Tracking the section nearest the upper third of the viewport avoids
      // rapid bouncing when short sections touch the same intersection.
      const scan = window.scrollY + window.innerHeight * 0.37;
      let current: Destination = "#about";
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top + window.scrollY <= scan) {
          current = `#${id}` as Destination;
        }
      }
      setActive((previous) => (previous === current ? previous : current));
      frame = 0;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return active;
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  mode,
  reduced,
}: {
  href: Destination;
  label: string;
  icon: typeof Compass;
  active: boolean;
  mode: "desktop" | "mobile";
  reduced: boolean;
}) {
  return (
    <motion.a
      href={href}
      aria-current={active ? "location" : undefined}
      whileHover={reduced ? undefined : { y: -1.5 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={[
        "relative isolate flex shrink-0 items-center justify-center gap-2 rounded-full outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-emerald-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        mode === "desktop" ? "min-h-11 px-3.5 text-xs lg:text-[13px]" : "min-h-12 min-w-12 flex-col gap-1 px-2 py-2 text-[9px]",
        active ? "text-white" : "text-zinc-300 hover:text-white",
      ].join(" ")}
    >
      {active && (
        <motion.span
          layoutId={`nav-active-${mode}`}
          className="absolute inset-0 -z-10 rounded-full border border-white/20 bg-white/[0.11] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_20px_rgba(15,240,189,0.10)]"
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 410, damping: 34 }}
        />
      )}
      <Icon
        aria-hidden="true"
        className={mode === "desktop" ? "h-3.5 w-3.5" : "h-[17px] w-[17px]"}
        strokeWidth={1.8}
      />
      <span>{label}</span>
    </motion.a>
  );
}

/**
 * Floating navigation with a continuously moving focus capsule.
 * A CSS glass treatment is used for browsers; Apple's private native
 * Liquid Glass compositor cannot be embedded in a Next.js site.
 */
export default function AppleGlassNav() {
  const active = useVisibleSection();
  const reduced = !!useReducedMotion();

  const illuminate = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || reduced) return;
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    element.style.setProperty("--glass-light-x", `${event.clientX - bounds.left}px`);
    element.style.setProperty("--glass-light-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <>
      <nav
        aria-label="Primary portfolio sections"
        onPointerMove={illuminate}
        className="group relative hidden items-center gap-0.5 rounded-full border border-white/[0.17] bg-[#101a1e]/65 p-1 shadow-[0_10px_36px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.19)] backdrop-blur-2xl backdrop-saturate-150 lg:flex"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(175px circle at var(--glass-light-x,50%) var(--glass-light-y,50%),rgba(210,255,244,0.17),transparent 73%)" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent"
        />
        {destinations.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={active === item.href}
            mode="desktop"
            reduced={reduced}
          />
        ))}
      </nav>

      <nav
        aria-label="Mobile portfolio sections"
        className="fixed inset-x-2 bottom-[max(0.65rem,env(safe-area-inset-bottom))] z-[60] mx-auto flex max-w-[430px] items-center justify-around gap-0.5 rounded-[30px] border border-white/[0.21] bg-[#071316]/85 p-1.5 shadow-[0_15px_55px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-3xl backdrop-saturate-150 lg:hidden"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />
        {destinations.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={active === item.href}
            mode="mobile"
            reduced={reduced}
          />
        ))}
      </nav>
    </>
  );
}
