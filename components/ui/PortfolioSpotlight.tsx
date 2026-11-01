"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  Command,
  Compass,
  FileText,
  Layers3,
  Moon,
  Search,
  Terminal,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type Item = {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  kind: "navigate" | "action";
  target?: string;
  action?: () => void;
};

type Props = {
  immersive: boolean;
  soundEnabled: boolean;
  onToggleWorld: () => void;
  onToggleSound: () => void;
  onOpenTerminal: () => void;
};

/** Spotlight-inspired command search with real, keyboard-accessible actions. */
export default function PortfolioSpotlight({
  immersive,
  soundEnabled,
  onToggleWorld,
  onToggleSound,
  onOpenTerminal,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const reduced = !!useReducedMotion();


  const items = useMemo<Item[]>(
    () => [
      { id: "about", label: "About", hint: "Opening scene & introduction", keywords: "home hero introduction", kind: "navigate", target: "#about" },
      { id: "metrics", label: "Metrics", hint: "Enterprise impact and numbers", keywords: "users devices statistics", kind: "navigate", target: "#metrics" },
      { id: "suite", label: "Architecture Suite", hint: "Infrastructure systems and interactive tools", keywords: "network operations tools architecture", kind: "navigate", target: "#suite" },
      { id: "matrix", label: "YREF Matrix", hint: "Robotics education framework", keywords: "robotics stem yref education", kind: "navigate", target: "#yref-matrix" },
      { id: "labs", label: "Labs & Networks", hint: "Campus infrastructure and labs", keywords: "network security stem vr", kind: "navigate", target: "#labs" },
      { id: "ecosystem", label: "Ecosystem", hint: "Apple, Microsoft, SMART & Innovation", keywords: "projects technology stack", kind: "navigate", target: "#ecosystem" },
      { id: "contact", label: "Contact", hint: "Connect and get in touch", keywords: "email work", kind: "navigate", target: "#contact" },
      { id: "cv", label: "View Executive CV", hint: "Open resume in a new tab", keywords: "resume pdf download career", kind: "action", action: () => window.open("/Abdul_Samad_Resume.pdf", "_blank", "noopener,noreferrer") },
      { id: "scene", label: immersive ? "Switch to Classic background" : "Enter the Glass Passage", hint: "Change the animated environment", keywords: "glass world 3d visual mode", kind: "action", action: onToggleWorld },
      { id: "sound", label: soundEnabled ? "Mute interface sounds" : "Enable interface sounds", hint: "Control UI audio feedback", keywords: "sound volume mute", kind: "action", action: onToggleSound },
      { id: "terminal", label: "Open SAMAD-OS Terminal", hint: "Explore interactive commands", keywords: "cli console code", kind: "action", action: onOpenTerminal },
    ],
    [immersive, soundEnabled, onToggleWorld, onToggleSound, onOpenTerminal]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? items.filter((item) => `${item.label} ${item.hint} ${item.keywords}`.toLowerCase().includes(q))
      : items;
  }, [items, query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  };

  const run = (item: Item) => {
    if (item.kind === "navigate" && item.target) {
      document.querySelector(item.target)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
      // Keep a shareable location without forcing a second scroll.
      window.history.replaceState(null, "", item.target);
    } else {
      item.action?.();
    }
    close();
  };

  useEffect(() => {
    const keyboard = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, []);

  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => input.current?.focus());

    const trap = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Tab" || !dialog.current) return;
      const elements = Array.from(
        dialog.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href]'
        )
      );
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", trap);
      before?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (open && filtered[selected]) document.getElementById(`samad-result-${filtered[selected].id}`)?.scrollIntoView({ block: "nearest" });
  }, [open, selected, filtered]);

  const keyboard = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((index) => Math.max(0, Math.min(index + 1, filtered.length - 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && filtered[selected]) {
      event.preventDefault();
      run(filtered[selected]);
    }
  };

  return (
    <>
      <motion.button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        aria-label="Search portfolio and actions"
        aria-keyshortcuts="Control+K Meta+K"
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Search portfolio (⌘K or Ctrl+K)"
        className="group relative inline-flex min-h-10 items-center gap-2 overflow-hidden rounded-full border border-white/[0.17] bg-white/[0.055] px-3 text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,.15)] backdrop-blur-2xl transition-colors hover:border-emerald-200/40 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
      >
        <Search aria-hidden="true" className="h-4 w-4 text-emerald-200" />
        <span className="hidden text-[11px] lg:inline">Search</span>
        <kbd className="hidden rounded-md border border-white/15 bg-black/20 px-1.5 py-0.5 font-mono text-[10px] text-white/50 xl:inline">
          ⌘K
        </kbd>
      </motion.button>

      {open && createPortal(
        <AnimatePresence>
        {open && (
          <motion.div
            key="spotlight"
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[max(8vh,3rem)] sm:pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
          >
            <button
              aria-label="Close search"
              className="absolute inset-0 cursor-default bg-[#020709]/75 backdrop-blur-md"
              onClick={close}
              type="button"
            />
            <motion.div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="samad-spotlight-heading"
              className="relative z-10 w-full max-w-[580px] overflow-hidden rounded-[28px] border border-white/20 bg-[#0b181d]/95 shadow-[0_25px_100px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-3xl"
              initial={reduced ? false : { opacity: 0, y: -18, scale: 0.97, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 30 }}
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <Command className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
                <h2 id="samad-spotlight-heading" className="sr-only">Search SAMAD-OS portfolio</h2>
                <input
                  ref={input}
                  type="search"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded="true"
                  aria-controls="samad-search-results"
                  aria-activedescendant={filtered[selected] ? `samad-result-${filtered[selected].id}` : undefined}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setSelected(0);
                  }}
                  onKeyDown={keyboard}
                  aria-label="Search sections and actions"
                  placeholder="Where would you like to go?"
                  className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/45"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div id="samad-search-results" role="listbox" aria-label="Portfolio commands" className="max-h-[min(60vh,480px)] overflow-y-auto px-2 py-3">
                <p className="px-4 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-200/65">
                  {query ? "Matching results" : "Navigate and control"}
                </p>
                {filtered.length ? (
                  filtered.map((item, index) => (
                    <button
                      type="button"
                      key={item.id}
                      id={`samad-result-${item.id}`}
                      role="option"
                      aria-selected={index === selected}
                      onMouseEnter={() => setSelected(index)}
                      onClick={() => run(item)}
                      className={`flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-emerald-200 ${index === selected ? "bg-white/10 text-white" : "text-zinc-200 hover:bg-white/[0.07]"}`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-emerald-200">
                          {item.id === "sound" ? (soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />) :
                            item.id === "scene" ? <Layers3 className="h-4 w-4" /> :
                            item.id === "cv" ? <FileText className="h-4 w-4" /> :
                            item.id === "terminal" ? <Terminal className="h-4 w-4" /> :
                            item.kind === "navigate" ? <Compass className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{item.label}</span>
                          <span className="block truncate text-[11px] text-zinc-400">{item.hint}</span>
                        </span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-emerald-200/60" aria-hidden="true" />
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-8 text-center text-sm text-zinc-400">No matches. Try a section or technology name.</p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/20 px-5 py-3 text-[10px] text-zinc-400">
                <span>↑ ↓ Navigate · Enter Select · Esc Close</span>
                <span className="font-mono tracking-[0.14em] text-emerald-200/65">SAMAD-OS / SEARCH</span>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
