"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

/**
 * Cinematic storytelling layer for the SAMAD-OS portfolio.
 *
 * A pinned viewport holds the visitor inside the 3D corridor while
 * real portfolio information materializes, hangs briefly, and departs
 * as the scroll-driven world camera advances through its architecture.
 *
 * Actual working dashboards remain below this experience.
 */
const CHAPTERS = [
  {
    chapter: "01",
    category: "THE MISSION",
    first: "BUILD",
    second: "THE FUTURE.",
    highlight: "630+",
    unit: "active daily users",
    description:
      "Technology leadership across a connected learning environment. One vision, many systems, and meaningful operational impact.",
    details: ["TECHNOLOGY LEADERSHIP", "ENTERPRISE OPERATIONS"],
    color: "emerald",
  },
  {
    chapter: "02",
    category: "CLOUD & IDENTITY",
    first: "EVERY",
    second: "IDENTITY.",
    highlight: "1,050+",
    unit: "Microsoft 365 seats",
    description:
      "Cloud identity, permissions, Microsoft 365, and endpoint policy brought together as one governed ecosystem.",
    details: ["MICROSOFT 365", "ENTRA ID · INTUNE"],
    color: "cyan",
  },
  {
    chapter: "03",
    category: "APPLE & ENDPOINTS",
    first: "CONTROL",
    second: "AT SCALE.",
    highlight: "350+",
    unit: "Apple iPads",
    description:
      "An integrated device experience built around Apple School Manager, Jamf, and disciplined endpoint operations.",
    details: ["APPLE SCHOOL MANAGER", "JAMF · DEVICE LIFECYCLE"],
    color: "emerald",
  },
  {
    chapter: "04",
    category: "NETWORK ARCHITECTURE",
    first: "DESIGN",
    second: "FOR TRUST.",
    highlight: "60",
    unit: "wireless access points",
    description:
      "Secure connections across campus infrastructure, Fortinet perimeter protection, and Aruba wireless operations.",
    details: ["FORTINET", "ARUBA · CONNECTIVITY"],
    color: "sky",
  },
  {
    chapter: "05",
    category: "INNOVATION LABS",
    first: "IMAGINE",
    second: "WHAT'S NEXT.",
    highlight: "380+",
    unit: "STEM and lab assets",
    description:
      "Robotics, interactive learning technology, and immersive environments—organized to make innovation operational.",
    details: ["ROBOTICS & STEM", "VR · INTERACTIVE LEARNING"],
    color: "violet",
  },
] as const;

type Chapter = (typeof CHAPTERS)[number];

const COLORS = {
  emerald: {
    ink: "from-emerald-100 via-teal-200 to-emerald-400",
    glow: "bg-emerald-400/10",
    line: "from-emerald-300/75 via-teal-500/35 to-transparent",
    text: "text-emerald-200",
    border: "border-emerald-300/25",
  },
  cyan: {
    ink: "from-sky-100 via-cyan-200 to-teal-400",
    glow: "bg-cyan-400/10",
    line: "from-cyan-300/75 via-sky-500/35 to-transparent",
    text: "text-cyan-200",
    border: "border-cyan-300/25",
  },
  sky: {
    ink: "from-white via-sky-200 to-blue-400",
    glow: "bg-sky-400/10",
    line: "from-sky-300/75 via-blue-500/35 to-transparent",
    text: "text-sky-200",
    border: "border-sky-300/25",
  },
  violet: {
    ink: "from-white via-violet-200 to-fuchsia-400",
    glow: "bg-violet-400/10",
    line: "from-violet-300/75 via-fuchsia-500/35 to-transparent",
    text: "text-violet-200",
    border: "border-violet-300/25",
  },
} as const;

function StoryFrame({
  chapter,
  index,
  progress,
}: {
  chapter: Chapter;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = index / CHAPTERS.length;
  const end = (index + 1) / CHAPTERS.length;
  const stops = [start, start + 0.065, end - 0.055, end];
  const opacity = useTransform(progress, stops, [0, 1, 1, 0]);
  const titleX = useTransform(progress, stops, [index % 2 ? 90 : -90, 0, 0, index % 2 ? -65 : 65]);
  const titleY = useTransform(progress, stops, [65, 0, 0, -44]);
  const scale = useTransform(progress, stops, [0.86, 1, 1, 1.07]);
  const headingBlur = useTransform(progress, stops, ["blur(12px)", "blur(0px)", "blur(0px)", "blur(9px)"]);
  const detailOpacity = useTransform(
    progress,
    [start, start + 0.088, end - 0.07, end],
    [0, 1, 1, 0]
  );
  const sideY = useTransform(progress, stops, [80, 0, 0, -65]);
  const palette = COLORS[chapter.color];

  return (
    <motion.article
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-5 pt-24 pb-16 md:px-10"
      style={{ opacity }}
      aria-label={chapter.category}
    >
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.12)_58%,transparent_100%)]`}
        aria-hidden="true"
      />
      <div
        className={`absolute left-1/2 top-1/2 -z-10 h-[min(64vw,36rem)] w-[min(64vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] ${palette.glow}`}
        aria-hidden="true"
      />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.42fr)] lg:gap-16">
        <motion.div style={{ x: titleX, y: titleY, scale, filter: headingBlur }}>
          <div className={`mb-7 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.36em] ${palette.text} sm:text-xs`}>
            <span className={`inline-block h-2 w-2 rounded-full bg-current shadow-[0_0_18px_currentColor]`} />
            <span>CHAPTER {chapter.chapter} / {chapter.category}</span>
          </div>
          <h2 className="text-[clamp(3.2rem,8.4vw,8.5rem)] font-black uppercase leading-[0.89] tracking-[-0.075em] text-white drop-shadow-[0_10px_36px_rgba(0,0,0,0.9)]">
            <span className="block">{chapter.first}</span>
            <span
              className={`mt-2 block bg-gradient-to-r bg-clip-text text-transparent ${palette.ink}`}
            >
              {chapter.second}
            </span>
          </h2>
          <div className={`my-7 h-px w-full max-w-lg bg-gradient-to-r ${palette.line}`} />
          <motion.p
            className="max-w-xl text-sm leading-relaxed text-slate-200 drop-shadow-[0_5px_14px_rgba(0,0,0,1)] sm:text-lg"
            style={{ opacity: detailOpacity }}
          >
            {chapter.description}
          </motion.p>
          <motion.div className="mt-7 flex flex-wrap gap-2" style={{ opacity: detailOpacity }}>
            {chapter.details.map((detail) => (
              <span
                key={detail}
                className={`border-l pl-3 pr-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 ${palette.border}`}
              >
                {detail}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mt-4 flex flex-col items-start lg:mt-0 lg:items-end lg:text-right"
          style={{ opacity: detailOpacity, y: sideY }}
        >
          <span className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] text-white/50">
            LIVE SYSTEM SCALE
          </span>
          <span className={`bg-gradient-to-r bg-clip-text text-transparent ${palette.ink} text-[clamp(3.5rem,7vw,7rem)] font-black leading-none tracking-[-0.06em]`}>
            {chapter.highlight}
          </span>
          <span className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
            {chapter.unit}
          </span>
          <div className={`mt-8 h-px w-32 bg-gradient-to-r ${palette.line}`} />
          <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            SAMAD-OS / {chapter.chapter}
          </span>
        </motion.div>
      </div>
    </motion.article>
  );
}

function ChapterTick({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const scaleX = useTransform(
    progress,
    [index / CHAPTERS.length, (index + 1) / CHAPTERS.length],
    [0, 1]
  );
  return (
    <div className="relative h-px w-9 bg-white/20">
      <motion.div
        className="absolute inset-y-0 left-0 origin-left bg-emerald-300"
        style={{ scaleX }}
      />
    </div>
  );
}

/** Reduced-motion visitors get an accessible linear story, without pinned animations. */
function ReducedMotionStory() {
  return (
    <section aria-label="Technology leadership story" className="relative z-20 space-y-12 px-6 py-24">
      {CHAPTERS.map((chapter) => (
        <article key={chapter.chapter} className="mx-auto max-w-4xl border-b border-emerald-300/20 pb-12">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
            {chapter.chapter} / {chapter.category}
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            {chapter.first} <span className="text-emerald-300">{chapter.second}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-slate-300">{chapter.description}</p>
          <p className="mt-4 text-2xl font-bold text-emerald-200">
            {chapter.highlight} <span className="text-base font-normal text-slate-200">{chapter.unit}</span>
          </p>
        </article>
      ))}
    </section>
  );
}

export default function ScrollStory() {
  const target = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });

  if (reducedMotion) return <ReducedMotionStory />;

  return (
    <section
      ref={target}
      aria-label="Journey through SAMAD-OS technology portfolio"
      className="relative z-20 h-[550svh]"
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#010b10]/40 via-transparent to-[#010b10]/35" />

        {CHAPTERS.map((chapter, index) => (
          <StoryFrame
            key={chapter.chapter}
            chapter={chapter}
            index={index}
            progress={scrollYProgress}
          />
        ))}

        <div className="pointer-events-none absolute bottom-7 left-6 right-6 z-20 flex items-end justify-between gap-6 sm:left-12 sm:right-12">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-200/75">
              SCROLL TO EXPLORE
            </span>
            <span className="text-[10px] text-slate-400">Your journey through the systems</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex" aria-hidden="true">
            {CHAPTERS.map((chapter, index) => (
              <ChapterTick key={chapter.chapter} index={index} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
