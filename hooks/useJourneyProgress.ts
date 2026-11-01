"use client";

import { useMotionValue } from "framer-motion";
import { useEffect } from "react";

/** One coordinate convention for the camera and the HTML chapters. */
export function useJourneyProgress() {
  const progress = useMotionValue(0);
  useEffect(() => {
    let start = 0;
    let travel = 1;
    let frame = 0;
    const update = () => {
      frame = 0;
      progress.set(Math.max(0, Math.min(1, (window.scrollY - start) / travel)));
    };
    const measure = () => {
      const journey = Array.from(document.querySelectorAll<HTMLElement>("[data-samad-journey]")).find((element) => element.getBoundingClientRect().height > 0);
      const rect = journey?.getBoundingClientRect();
      start = rect ? window.scrollY + rect.top : 0;
      travel = Math.max(1, (rect?.height ?? document.documentElement.scrollHeight) - window.innerHeight);
      update();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    const journey = document.querySelector("[data-samad-journey]");
    if (journey) observer.observe(journey);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [progress]);
  return progress;
}
