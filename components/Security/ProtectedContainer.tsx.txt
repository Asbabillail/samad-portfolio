'use client';

import React, { useEffect, useState } from 'react';

interface ProtectedContainerProps {
  children: React.ReactNode;
  watermarkText?: string;
}

export default function ProtectedContainer({
  children,
  watermarkText = 'YREF PROPRIETARY — INTERNAL USE ONLY',
}: ProtectedContainerProps) {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && (e.key === 'c' || e.key === 'p' || e.key === 'u' || e.key === 's')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`relative select-none transition-all duration-300 ${
        isBlurred ? 'blur-xl opacity-20 pointer-events-none' : 'blur-none opacity-100'
      }`}
    >
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden opacity-10 flex flex-wrap items-center justify-around p-4 font-mono text-[10px] text-teal-400 tracking-widest uppercase">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="rotate-[-25deg] whitespace-nowrap m-8">
            {watermarkText} | SESSION_SECURE
          </span>
        ))}
      </div>

      {children}
    </div>
  );
}