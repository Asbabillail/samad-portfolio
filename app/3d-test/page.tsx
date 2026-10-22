"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const SamadWorld = dynamic(() => import("@/components/background/SamadWorld"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#020809]" />,
});

export default function ThreeDTestPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020809] text-white">
      <SamadWorld preview />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/65" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center pointer-events-none">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.5em] text-emerald-300/90">SAMAD-OS / Experimental Environment</p>
        <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl md:text-8xl">
          THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-300 to-cyan-400">EMERALD</span> NEXUS
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          A cinematic fusion of crystalline architecture and a living energy reactor.
        </p>
        <div className="pointer-events-auto mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-100 backdrop-blur-md transition hover:bg-emerald-400/20">Return to portfolio</Link>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-10 text-center text-[10px] uppercase tracking-[0.28em] text-emerald-100/45">
        3D preview · Main portfolio unchanged
      </div>
    </main>
  );
}
