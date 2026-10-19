'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, Braces, Layers3, Workflow } from 'lucide-react';

/** Decorative CSS 3D glass stack. Pointer-driven transforms are done without React rerenders. */
export default function LiquidGlassHero() {
  const stack = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stack.current;
    if (!el) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0, cx = 0, cy = 0, tx = 0, ty = 0;
    const tick = () => {
      cx += (tx - cx) * 0.075;
      cy += (ty - cy) * 0.075;
      el.style.transform = `perspective(1100px) rotateX(${cy.toFixed(2)}deg) rotateY(${cx.toFixed(2)}deg)`;
      if (Math.abs(cx - tx) + Math.abs(cy - ty) > 0.05) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const move = (e: PointerEvent) => {
      tx = Math.max(-12, Math.min(12, (e.clientX / innerWidth - .5) * 19));
      ty = Math.max(-10, Math.min(10, (.5 - e.clientY / innerHeight) * 14));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const setup = () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(frame); frame = 0;
      if (!motion.matches && pointer.matches) window.addEventListener('pointermove', move, { passive: true });
      else { cx = cy = tx = ty = 0; el.style.transform = 'none'; }
    };
    setup();
    motion.addEventListener('change', setup);
    pointer.addEventListener('change', setup);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      motion.removeEventListener('change', setup);
      pointer.removeEventListener('change', setup);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute right-[2%] top-1/2 hidden aspect-square w-[min(45vw,610px)] -translate-y-[47%] lg:block">
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(144,195,255,.28),rgba(177,126,255,.11)_43%,transparent_74%)] blur-[30px]" />
      <div ref={stack} className="relative h-full w-full" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
        <div className="absolute inset-[10%] -rotate-12 rounded-[48px] border border-[#c9bbff]/35 bg-[linear-gradient(130deg,rgba(218,227,255,.23),rgba(172,146,246,.09)_43%,rgba(101,176,235,.12))] shadow-[0_35px_90px_rgba(53,45,112,.27),inset_0_1px_2px_rgba(255,255,255,.52)] backdrop-blur-xl" style={{ transform: 'translateZ(-75px)' }} />
        <div className="absolute inset-[15%] rotate-[10deg] rounded-[46px] border border-white/35 bg-[linear-gradient(120deg,rgba(221,234,255,.34),rgba(151,177,255,.07)_45%,rgba(213,159,255,.15))] shadow-[0_24px_80px_rgba(0,0,0,.28),inset_0_2px_2px_rgba(255,255,255,.5)] backdrop-blur-2xl" style={{ transform: 'translateZ(22px)' }} />
        <div className="absolute inset-x-[20%] inset-y-[22%] -rotate-6 overflow-hidden rounded-[36px] border border-white/40 bg-[linear-gradient(137deg,rgba(234,233,255,.41),rgba(107,116,190,.18)_53%,rgba(142,240,239,.14))] p-8 shadow-[0_28px_100px_rgba(49,34,91,.36),inset_0_2px_1px_rgba(255,255,255,.7)] backdrop-blur-3xl" style={{ transform: 'translateZ(100px)' }}>
          <div className="absolute -right-16 -top-20 size-64 rounded-full bg-[#c9b8ff]/25 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex gap-1.5"><span className="size-2 rounded-full bg-white/80"/><span className="size-2 rounded-full bg-white/40"/><span className="size-2 rounded-full bg-white/30"/></div>
            <span className="font-mono text-[9px] tracking-[.3em] text-[#efeaff]">SAMAD / OS</span>
          </div>
          <div className="relative mt-[23%]">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/40 bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,.6)]"><Layers3 className="size-7 text-white"/></div>
            <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#f7f3ff]">Business DNA</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-.06em] text-white">Engineering<br/>Mind.</p>
            <div className="mt-7 h-px w-full bg-gradient-to-r from-white/60 to-transparent" />
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] text-[#f0edff]"><span>IDEAS INTO IMPACT</span><ArrowUpRight className="size-4"/></div>
          </div>
        </div>
        <div className="absolute left-[5%] top-[17%] flex items-center gap-2 rounded-2xl border border-white/40 bg-[#dedbff]/20 px-4 py-3 shadow-[0_20px_50px_rgba(42,30,89,.28),inset_0_1px_rgba(255,255,255,.6)] backdrop-blur-2xl" style={{ transform: 'translateZ(155px)' }}><Workflow className="size-5 text-[#e2d2ff]"/><span className="text-xs font-medium text-white">STRATEGY</span></div>
        <div className="absolute bottom-[16%] right-[1%] flex items-center gap-2 rounded-2xl border border-white/40 bg-[#bddff9]/20 px-4 py-3 shadow-[0_20px_50px_rgba(42,30,89,.28),inset_0_1px_rgba(255,255,255,.6)] backdrop-blur-2xl" style={{ transform: 'translateZ(170px)' }}><Braces className="size-5 text-[#cdeaff]"/><span className="text-xs font-medium text-white">BUILD</span></div>
      </div>
    </div>
  );
}
