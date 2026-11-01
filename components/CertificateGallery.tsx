'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Award, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { certificates, type Certificate } from '@/data/certificates';

const categories = ['All', 'Certification', 'Training', 'Courses', 'Recognition'] as const;

function CertificateCard({ item, index, onOpen }: { item: Certificate; index: number; onOpen: () => void }) {
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientY - box.top) / box.height - 0.5) * -5, y: ((event.clientX - box.left) / box.width - 0.5) * 5 });
  };
  return (
    <motion.article
      initial={false}
      whileInView={reduced ? undefined : { opacity: [0.65, 1], y: [22, 0] }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.07 }}
      className="min-w-0 [perspective:1000px]"
    >
      <motion.button
        type="button" onClick={onOpen} onPointerMove={move} onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        animate={{ rotateX: reduced ? 0 : tilt.x, rotateY: reduced ? 0 : tilt.y }}
        whileHover={reduced ? undefined : { y: -5 }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        aria-label={`View certificate: ${item.title}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0c191b]/90 text-left shadow-xl outline-none transition-colors hover:border-emerald-200/50 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#061011]"
      >
        <div className="relative aspect-[4/3] w-full bg-[#eceee9] p-3 sm:p-4">
          <div className="relative h-full w-full">
            <Image src={`/certificates/${item.id}.webp`} alt={`${item.title} certificate awarded to Abdul Samad Babillail`} fill sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw" className="object-contain" />
          </div>
          <span aria-hidden="true" className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#061011]/90 text-white shadow-lg transition-colors group-hover:bg-emerald-700"><ZoomIn size={17} /></span>
        </div>
        <div className="flex w-full flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.15em]"><span className="text-emerald-200">{item.category}</span><span className="text-zinc-400">{item.date}</span></div>
          <h3 className="text-base leading-snug font-medium text-white">{item.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.issuer}</p>
          {item.note && <p className={`mt-3 text-xs leading-relaxed ${item.id === '10' ? 'text-amber-200' : 'text-zinc-300'}`}>{item.note}</p>}
        </div>
      </motion.button>
    </motion.article>
  );
}

export default function CertificateGallery() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const filtered = certificates.filter(item => category === 'All' || item.category === category);
  const visible = expanded || category !== 'All' ? filtered : filtered.slice(0, 6);
  const isOpen = selected !== null;

  useEffect(() => {
    if (!isOpen || !dialog.current) return;
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const navigate = (direction: number) => {
    if (!selected) return;
    const position = filtered.findIndex(item => item.id === selected.id);
    setSelected(filtered[(position + direction + filtered.length) % filtered.length]);
    setZoomed(false);
  };

  return (
    <section id="certificates" aria-labelledby="certificates-heading" className="relative z-20 scroll-mt-28 border-t border-white/10 bg-[#061011]/90 px-5 py-24 backdrop-blur-xl sm:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.25em] text-emerald-200 uppercase"><Award size={16} aria-hidden="true" /> Learning, made visible</p>
            <h2 id="certificates-heading" className="text-4xl font-light tracking-tight text-white sm:text-5xl">Curiosity. <span className="font-serif italic text-emerald-100">In practice.</span></h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-300">The qualifications, practical learning and recognition behind my work. Explore the original certificates, from technology operations to applied AI.</p>
          </div>
          <p className="shrink-0 text-xs text-zinc-400"><span className="mr-2 text-3xl font-light text-white">{certificates.length}</span> certificates & recognitions</p>
        </div>
        <div aria-label="Filter certificates" className="mb-8 flex flex-wrap gap-2">
          {categories.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => { setCategory(value); setExpanded(false); }} className={`min-h-11 rounded-full border px-4 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200 ${category === value ? 'border-emerald-200 bg-emerald-200 text-[#061011]' : 'border-white/15 text-zinc-300 hover:border-white/50'}`}>{value === 'All' ? 'All certificates' : value}</button>)}
        </div>
        <p role="status" className="sr-only">Showing {visible.length} of {filtered.length} certificates</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => <CertificateCard key={item.id} item={item} index={index} onOpen={() => { setSelected(item); setZoomed(false); }} />)}
        </div>
        {category === 'All' && !expanded && <div className="mt-9 text-center"><button type="button" onClick={() => setExpanded(true)} className="inline-flex min-h-12 items-center gap-3 rounded-full border border-emerald-200/40 px-6 text-sm text-emerald-100 transition-colors hover:bg-emerald-200/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200">Explore all {certificates.length} certificates <ArrowDown size={16} aria-hidden="true" /></button></div>}
      </div>
      <dialog ref={dialog} aria-labelledby="certificate-title" onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }} onKeyDown={event => { if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); } }} className="fixed inset-0 m-auto max-h-[94dvh] w-[calc(100%-1.5rem)] max-w-6xl overflow-auto rounded-2xl border border-white/20 bg-[#0a1619] p-0 text-white shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-md">
        {selected && <>
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0a1619] p-4">
            <div className="min-w-0"><p className="text-[10px] tracking-widest text-emerald-200 uppercase">{selected.category} · {selected.date}</p><h3 id="certificate-title" className="mt-1 text-sm font-medium sm:text-lg">{selected.title}</h3></div>
            <button ref={closeButton} type="button" onClick={() => setSelected(null)} aria-label="Close certificate" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-emerald-200"><X size={20} /></button>
          </div>
          <div className={`overflow-auto bg-[#e6e9e4] ${zoomed ? 'max-h-[65dvh]' : ''}`}>
            <motion.div key={selected.id} initial={reduced ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className={zoomed ? 'relative h-[1000px] min-w-[1400px]' : 'relative h-[50dvh] sm:h-[65dvh]'}>
              <Image src={`/certificates/${selected.id}.webp`} alt={`${selected.title} — ${selected.issuer} — certificate for Abdul Samad Babillail`} fill sizes={zoomed ? '1800px' : '95vw'} className="object-contain p-3" />
            </motion.div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex gap-2"><button type="button" onClick={() => navigate(-1)} aria-label="Previous certificate" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><ChevronLeft size={20} /></button><button type="button" onClick={() => navigate(1)} aria-label="Next certificate" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><ChevronRight size={20} /></button></div>
            <p className="text-xs text-zinc-300">{selected.issuer}{selected.note && <span className="mt-1 block text-zinc-400">{selected.note}</span>}</p>
            <div className="flex gap-3"><button type="button" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-xs hover:bg-white/10">{zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}{zoomed ? 'Fit image' : 'Zoom'}</button><a href={`/certificates/${selected.id}.webp`} target="_blank" rel="noopener noreferrer" aria-label="Open original certificate image in a new tab" className="inline-flex min-h-11 items-center gap-2 px-2 text-xs text-emerald-100">Open image <ArrowUpRight size={16} /></a></div>
          </div>
        </>}
      </dialog>
    </section>
  );
}
