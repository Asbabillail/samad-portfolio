"use client";

import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect } from "react";

/**
 * A deliberately restrained, editorial constellation of technologies.
 *
 * These are accurate, plain-text product references — NOT hand-drawn or
 * AI-generated imitations of third-party trademarks. The portfolio is
 * independent and does not claim brand sponsorship or endorsement.
 */
const TECHNOLOGIES = [
  { name: "Apple School Manager", group: "DEVICE ENROLLMENT", side: "left", top: "25%", tone: "emerald" },
  { name: "Jamf", group: "APPLE MANAGEMENT", side: "right", top: "28%", tone: "cyan" },
  { name: "Microsoft 365", group: "CLOUD PRODUCTIVITY", side: "left", top: "43%", tone: "cyan" },
  { name: "Entra ID", group: "IDENTITY & ACCESS", side: "right", top: "46%", tone: "emerald" },
  { name: "Cisco", group: "NETWORK INFRASTRUCTURE", side: "left", top: "62%", tone: "emerald" },
  { name: "Fortinet", group: "NETWORK SECURITY", side: "right", top: "64%", tone: "cyan" },
  { name: "Aruba", group: "WIRELESS NETWORKING", side: "left", top: "81%", tone: "cyan" },
  { name: "SMART Technologies", group: "INTERACTIVE DISPLAYS", side: "right", top: "82%", tone: "emerald" },
] as const;

function Signal({
  item,
  index,
  pointerX,
  pointerY,
}: {
  item: (typeof TECHNOLOGIES)[number];
  index: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const depth = 0.35 + (index % 3) * 0.17;
  const x = useTransform(pointerX, (value) => (reduced ? 0 : value * depth * (item.side === "left" ? 9 : -9)));
  const y = useTransform(pointerY, (value) => (reduced ? 0 : value * depth * 7);

  return (
    <motion.div
      aria-label={`${item.name}: ${item.group.toLowerCase()}`}
      className={[
        "absolute w-[clamp(9.25rem,12vw,11.5rem)]",
        item.side === "left" ? "left-[clamp(1rem,3vw,3rem)] text-left" : "right-[clamp(1rem,3vw,3rem)] text-right",
      ].join(" ")}
      style={{ top: item.top, x, y }}
      initial={reduced ? false : { opacity: 0, filter: "blur(8px)", scale: 0.92 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={reduced ? { duration: 0 } : { duration: 0.85, delay: 0.24 + index * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="relative overflow-hidden rounded-xl border border-white/[0.11] bg-[#071820]/40 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
        <span
          aria-hidden="true"
          className={`absolute inset-y-2 ${item.side === "left" ? "left-0" : "right-0"} w-px ${item.tone === "emerald" ? "bg-gradient-to-b from-transparent via-emerald-300/75 to-transparent" : "bg-gradient-to-b from-transparent via-cyan-300/75 to-transparent"}`}
        />
        <div className={`mb-1 flex items-center gap-2 ${item.side === "right" ? "justify-end" : ""}`}>
          {item.side === "left" && <span aria-hidden="true" className={`h-1 w-1 shrink-0 rounded-full ${item.tone === "emerald" ? "bg-emerald-300" : "bg-cyan-300"}`} />}
          <span className="truncate font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">{item.group}</span>
          {item.side === "right" && <span aria-hidden="true" className={`h-1 w-1 shrink-0 rounded-full ${item.tone === "emerald" ? "bg-emerald-300" : "bg-cyan-300"}`} />}
        </div>
        <span className="block text-[13px] font-semibold leading-tight tracking-tight text-white/90">
          {item.name}
        </span>
      </div>
    </motion.div>
  );
}

export default function TechConstellation({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const pointerX = useSpring(0, { stiffness: 45, damping: 22, mass: 1 });
  const pointerY = useSpring(0, { stiffness: 45, damping: 22, mass: 1 });
  const opacity = useTransform(scrollProgress, [0, 0.045, 0.075], [1, 0.55, 0]);
  const visibility = useTransform(scrollProgress, (progress) => progress >= 0.075 ? "hidden" : "visible");

  useEffect(() => {
    if (reduced) return;
    const move = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [pointerX, pointerY, reduced]);

  return (
    <motion.aside
      aria-label="Technologies used in professional work"
      className="pointer-events-none fixed inset-0 z-[9] hidden select-none overflow-hidden xl:block"
      style={{ opacity, visibility }}
    >
      {TECHNOLOGIES.map((item, index) => (
        <Signal
          key={item.name}
          item={item}
          index={index}
          pointerX={pointerX}
          pointerY={pointerY}
        />
      ))}
    </motion.aside>
  );
}
