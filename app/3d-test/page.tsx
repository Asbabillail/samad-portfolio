"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const SamadWorld = dynamic(() => import("@/components/background/SamadWorld"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#01080c]" />,
});

const CHAPTERS = [
  {
    number: "00",
    eyebrow: "THE ENTRY",
    title: "STEP INSIDE",
    accent: "THE GLASS PASSAGE",
    description: "A world beyond the screen. Scroll forward to pass through its architecture.",
  },
  {
    number: "01",
    eyebrow: "FOUNDATION",
    title: "ARCHITECT",
    accent: "THE FUTURE",
    description: "Technology leadership is about building systems that endure.",
  },
  {
    number: "02",
    eyebrow: "INFRASTRUCTURE",
    title: "ENGINEER",
    accent: "THE INVISIBLE",
    description: "Behind every seamless experience is an intentional architecture.",
  },
  {
    number: "03",
    eyebrow: "INNOVATION",
    title: "IGNITE",
    accent: "POSSIBILITY",
    description: "The environment evolves as you continue the journey.",
  },
  {
    number: "04",
    eyebrow: "ECOSYSTEM",
    title: "CONNECT",
    accent: "EVERYTHING",
    description: "From cloud identity to connected learning environments.",
  },
  {
    number: "05",
    eyebrow: "THE HORIZON",
    title: "BEYOND",
    accent: "THE FRAME",
    description: "This is just the beginning of SAMAD-OS.",
  },
] as const;

export default function ThreeDTestPage() {
  return (
    <main className="relative min-h-screen bg-[#01080c] text-white">
      <SamadWorld preview />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.18)_0%,transparent_60%)]" />

      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-black/35 px-5 py-4 backdrop-blur-lg sm:px-9">
        <div className="text-xs font-semibold tracking-[0.2em] sm:text-sm">
          SAMAD-OS <span className="text-emerald-300">/ THE GLASS PASSAGE</span>
        </div>
        <Link
          href="/"
          className="rounded-full border border-emerald-400/35 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-100 transition hover:bg-emerald-400/20"
        >
          Return to portfolio
        </Link>
      </header>

      <div className="relative z-10">
        {CHAPTERS.map((chapter, index) => (
          <section
            key={chapter.number}
            className="flex min-h-[100svh] flex-col items-center justify-center px-5 py-28 text-center"
            aria-label={chapter.eyebrow}
          >
            <div className="pointer-events-none max-w-4xl">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.48em] text-teal-200/80">
                {chapter.number} / {chapter.eyebrow}
              </p>
              <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.85)] sm:text-7xl lg:text-8xl">
                {chapter.title}
                <span className="mt-1 block bg-gradient-to-r from-emerald-200 via-teal-300 to-sky-300 bg-clip-text text-transparent">
                  {chapter.accent}
                </span>
              </h1>
              <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-slate-200 drop-shadow-[0_3px_14px_rgba(0,0,0,1)] sm:text-lg">
                {chapter.description}
              </p>
            </div>
            {index === 0 && (
              <div className="absolute bottom-10 flex flex-col items-center gap-3 text-xs uppercase tracking-[0.35em] text-teal-200/70">
                <span>Scroll to enter</span>
                <span aria-hidden="true" className="text-2xl animate-bounce">↓</span>
              </div>
            )}
          </section>
        ))}
      </div>
      <footer className="relative z-20 border-t border-emerald-400/20 bg-black/60 px-5 py-8 text-center text-sm text-emerald-100/60 backdrop-blur-md">
        End of the passage · <Link href="/" className="text-emerald-200 underline underline-offset-4">Explore the full SAMAD-OS portfolio</Link>
      </footer>
    </main>
  );
}
