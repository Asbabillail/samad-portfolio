'use client';

import { useEffect, useRef } from 'react';

/**
 * Decorative CSS-3D artwork for the hero.
 *
 * - Runs only for fine-pointer devices that allow motion.
 * - Schedules frames only while easing toward a new pointer position.
 * - Does not intercept interactions or expose operational data.
 * - Remains a static composition when reduced motion is requested.
 *
 * This is Phase 001's lightweight interaction prototype, not the final
 * Three.js / React Three Fiber experience.
 */
export default function CursorOrbit() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;
      scene.style.transform = `perspective(950px) rotateY(${currentX.toFixed(2)}deg) rotateX(${currentY.toFixed(2)}deg)`;

      if (Math.abs(targetX - currentX) > 0.03 || Math.abs(targetY - currentY) > 0.03) {
        frame = window.requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = ((event.clientX / window.innerWidth) * 2 - 1) * 12;
      targetY = (1 - (event.clientY / window.innerHeight) * 2) * 10;
      if (frame === 0) frame = window.requestAnimationFrame(tick);
    };

    const updateCapability = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.cancelAnimationFrame(frame);
      frame = 0;

      if (reducedMotion.matches || !finePointer.matches) {
        scene.style.transform = 'none';
        return;
      }
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    };

    updateCapability();
    reducedMotion.addEventListener('change', updateCapability);
    finePointer.addEventListener('change', updateCapability);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.cancelAnimationFrame(frame);
      reducedMotion.removeEventListener('change', updateCapability);
      finePointer.removeEventListener('change', updateCapability);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[2%] top-1/2 hidden aspect-square w-[min(44vw,520px)] -translate-y-1/2 select-none opacity-45 lg:block"
    >
      <div
        ref={sceneRef}
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-[18%] rounded-full bg-teal-400/20 blur-[76px]" />
        <div
          className="absolute inset-[10%] rounded-full border border-teal-300/40 shadow-[0_0_50px_rgba(80,215,189,0.14)]"
          style={{ transform: 'rotateX(68deg) translateZ(26px)' }}
        />
        <div
          className="absolute inset-[10%] rounded-full border border-amber-300/30"
          style={{ transform: 'rotateY(70deg) rotateX(28deg) translateZ(30px)' }}
        />
        <div
          className="absolute inset-[18%] rounded-full border border-cyan-300/35"
          style={{ transform: 'rotateX(28deg) rotateY(-55deg) translateZ(36px)' }}
        />
        <div
          className="absolute inset-[33%] rounded-full border border-teal-300/50 bg-slate-900/80 shadow-[0_0_65px_rgba(80,215,189,0.22)]"
          style={{ transform: 'translateZ(65px)' }}
        />
        <div
          className="absolute inset-[42%] rounded-full bg-gradient-to-br from-teal-300/75 via-cyan-400/30 to-amber-300/55 blur-[2px]"
          style={{ transform: 'translateZ(86px)' }}
        />
      </div>
    </div>
  );
}
