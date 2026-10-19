'use client';

import CursorOrbit from '@/components/experience/CursorOrbit';
import React, { useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Terminal,
  Sparkles,
  X,
  ShieldCheck,
  Building2,
  Download,
  Menu,
  ArrowUpRight,
  BriefcaseBusiness,
  Users,
  Code2
} from 'lucide-react';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; result: string }>>([
    { cmd: 'system.init', result: 'SAMAD-OS v3.0 loaded successfully. Type "help" for available commands.' }
  ]);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = inputVal.trim().toLowerCase();
    let response = '';

    switch (cleanCmd) {
      case 'help':
        response = 'Available commands: help, title, scale, labs, network, certs, status, clear';
        break;
      case 'title':
        response = 'Business and technology operations | Digital transformation | Leadership';
        break;
      case 'scale':
        response = 'Business operations, technology strategy, leadership, and engineering initiatives.';
        break;
      case 'labs':
        response = 'Innovation interests include robotics, automation, and learning technologies.';
        break;
      case 'network':
        response = 'Technical demonstrations are synthetic until disclosure approvals are confirmed.';
        break;
      case 'certs':
        response = 'CCNA (Simplilearn #4489483), Python Data Science (#4464651), SMART MX-V5 Display Tech, SAP Consulting';
        break;
      case 'status':
        response = 'Portfolio transformation in progress. Operational metrics are under review.';
        break;
      case 'clear':
        setCommandHistory([]);
        setInputVal('');
        return;
      default:
        response = `Command not recognized: "${cleanCmd}". Type "help" for available commands.`;
    }

    setCommandHistory((prev) => [...prev, { cmd: inputVal, result: response }]);
    setInputVal('');
  };


  return (
    <div className="min-h-screen text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black relative overflow-hidden bg-zinc-950">
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-3 focus:text-black">Skip to main content</a>
      {/* Legacy fluid canvas removed from default rendering for performance. */}

      {/* Scroll Progress Line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 pointer-events-auto">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTerminalOpen(!terminalOpen)}
              className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-2"
              title="Toggle Command Line Terminal"
            >
              <Terminal className="w-5 h-5" />
            </button>
            <span className="font-bold text-lg tracking-tight text-white">
              SAMAD-OS <span className="text-xs text-emerald-400 font-mono ml-1">v3.0</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm text-zinc-300 font-medium">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#metrics" className="hover:text-emerald-400 transition-colors">Expertise</a>
            <a href="#suite" className="hover:text-emerald-400 transition-colors">Work</a>
            <a href="#direction" className="hover:text-emerald-400 transition-colors">Future</a>
            <a href="#approach" className="hover:text-emerald-400 transition-colors">Approach</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://www.linkedin.com/in/abdul-samad-babillail-3bb342249/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LINKEDIN</span>
            </a>

            <button type="button" className="lg:hidden rounded-lg border border-white/20 p-2.5 text-slate-200 focus-visible:outline-2 focus-visible:outline-teal-300" aria-expanded={mobileNavOpen} aria-controls="samad-mobile-nav" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileNavOpen((previous) => !previous)}>{mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>

            <a 
              href="#contact" 
              className="px-4 py-2 text-xs font-semibold rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              Connect 
            </a> 
          </div>
        </div>
        {mobileNavOpen && (
          <div id="samad-mobile-nav" className="border-t border-white/10 bg-zinc-950 p-4 lg:hidden">
            <div className="mx-auto grid max-w-6xl gap-1">
              {[
                ["Overview", "#about"], ["Expertise", "#metrics"], ["Selected Work", "#suite"],
                ["Approach", "#approach"], ["Future", "#direction"], ["Contact", "#contact"]
              ].map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMobileNavOpen(false)} className="rounded-lg px-4 py-3 text-sm text-slate-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-teal-300">{label}</a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* --- INTERACTIVE TERMINAL DRAWER --- */}
      <AnimatePresence>
        {terminalOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-30 bg-zinc-900/95 border-b border-emerald-500/30 backdrop-blur-2xl p-4 font-mono text-xs shadow-2xl"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-400 mb-3">
                <span className="flex items-center gap-2"><Terminal className="w-4 h-4 text-emerald-400" /> SAMAD-OS Command Line Interface</span>
                <button onClick={() => setTerminalOpen(false)} className="hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 mb-3 pr-2">
                {commandHistory.map((item, idx) => (
                  <div key={idx}>
                    <div className="text-emerald-400">&gt; {item.cmd}</div>
                    <div className="text-zinc-300 ml-3">{item.result}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleCommandSubmit} className="flex gap-2">
                <span className="text-emerald-400">&gt;</span>
                <input 
                  type="text" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type 'help' for available commands (title, scale, labs, network, certs)..."
                  className="bg-transparent text-emerald-300 focus:outline-none w-full font-mono"
                  autoFocus
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="about" aria-labelledby="samad-heading" className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-20 pt-20 pointer-events-none">
        <CursorOrbit />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-emerald-400 mb-6 pointer-events-auto backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Business Operations · Technology Strategy · Innovation</span>
          </div>

          <h1 id="samad-heading" className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-tight">
            Abdul Samad Babillail
          </h1>

          <p className="text-emerald-400 text-sm md:text-base font-mono mb-6 tracking-wide">
            Business & Technology Leadership | Digital Transformation | Operations
          </p>

          <p className="text-zinc-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
            Bridging business priorities, operational execution, stakeholder coordination, and technical delivery. Exploring how strategy and technology can create practical organizational value.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
            <a
              href="#suite"
              className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 text-sm"
            >
              Explore My Work <ChevronRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setTerminalOpen(true)}
              className="px-6 py-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-200 font-semibold hover:bg-zinc-800 backdrop-blur-md transition-all flex items-center gap-2 text-sm"
            >
              <Terminal className="w-4 h-4 text-emerald-400" /> Open Terminal
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- PROFESSIONAL FOCUS: no unverified operational metrics in the public hero --- */}
      <section id="metrics" className="py-14 px-6 relative z-20" aria-labelledby="focus-heading">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-[0.24em] text-teal-300 mb-3">Professional Focus</p>
          <h2 id="focus-heading" className="text-2xl md:text-4xl font-semibold mb-7 text-white">Connecting strategy with execution.</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Business & Operations', description: 'Operational planning, commercial coordination, vendor evaluation, and process improvement.' },
              { title: 'Leadership & Transformation', description: 'Stakeholder collaboration, team coordination, technology adoption, and cross-functional delivery.' },
              { title: 'Engineering & Innovation', description: 'Enterprise systems and practical automation, supported by demonstrable technical projects.' }
            ].map((focus) => (
              <article key={focus.title} className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 backdrop-blur-sm transition-colors hover:border-teal-300/50">
                <h3 className="mb-3 text-lg font-semibold text-slate-100">{focus.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{focus.description}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-slate-400">Project demonstrations below are illustrative. Institution-specific figures and implementation details remain under verification and disclosure review.</p>
        </div>
      </section>

      {/* Independent work showcase: institutional details withheld pending disclosure review. */}
      <section id="suite" className="relative z-20 px-6 py-20" aria-labelledby="work-heading">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-teal-300">Selected Work</p>
          <h2 id="work-heading" className="mb-6 text-3xl font-semibold text-white">Building solutions, not just presentations.</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-7">
              <h3 className="text-xl font-semibold text-white">Portfolio Engineering</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">A Next.js and TypeScript portfolio exploring visual interactions, technical storytelling, and accessible web development.</p>
              <a className="mt-5 inline-flex rounded-lg border border-teal-400/40 px-4 py-2 text-sm text-teal-200 hover:bg-teal-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300" href="https://github.com/Asbabillail/samad-portfolio" target="_blank" rel="noopener noreferrer">Explore source code ↗</a>
            </article>
            <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-7">
              <h3 className="text-xl font-semibold text-white">Business Process Automation</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Python and Streamlit application development focused on repeatable calculations and operational workflows. Source publication remains under confidentiality review.</p>
              <p className="mt-5 text-xs text-slate-400">Detailed demonstrations will be published after disclosure and quality checks.</p>
            </article>
          </div>
          <div className="mt-8 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
            <h3 className="font-semibold text-slate-100">Engineering Explorer — in development</h3>
            <p className="mt-2 text-sm text-slate-300">Interactive synthetic network, cloud, and business systems simulations are planned for a future phase. No real institutional topology is displayed here.</p>
          </div>
        </div>
      </section>

      <section id="approach" className="relative z-20 border-t border-white/10 px-6 py-20" aria-labelledby="samad-approach">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-teal-300">Strategy × execution</p>
          <h2 id="samad-approach" className="mb-8 text-3xl font-semibold tracking-tight md:text-4xl">From business context to usable outcomes.</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {title:"Discover",body:"Understand priorities, stakeholders, and constraints.",Icon:BriefcaseBusiness},
              {title:"Coordinate",body:"Align people, vendors, systems, and operating processes.",Icon:Users},
              {title:"Deliver",body:"Build, test, document, and improve practical solutions.",Icon:Code2}
            ].map(({title,body,Icon},index)=><article key={title} className="rounded-2xl border border-teal-300/20 bg-slate-900/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-300/50 motion-reduce:transform-none"><Icon className="mb-5 h-8 w-8 text-teal-300" aria-hidden="true" /><span className="mb-2 block font-mono text-xs text-amber-300">0{index+1}</span><h3 className="mb-3 text-xl font-semibold">{title}</h3><p className="text-sm leading-relaxed text-slate-300">{body}</p></article>)}
          </div>
        </div>
      </section>
      <section id="direction" className="relative z-20 border-t border-white/10 bg-[#101e28] px-6 py-20" aria-labelledby="samad-future">
        <div className="mx-auto max-w-6xl">
          <h2 id="samad-future" className="mb-8 text-3xl font-semibold md:text-4xl">Leadership now. Entrepreneurship ahead.</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-teal-400/30 bg-teal-400/5 p-7"><p className="mb-3 font-mono text-xs uppercase text-teal-300">Professional direction</p><h3 className="mb-3 text-xl font-semibold">Business & Technology Leadership</h3><p className="text-sm leading-7 text-slate-300">Business operations, stakeholder collaboration, commercial planning, technology strategy, and cross-functional delivery.</p></article>
            <article className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-7"><p className="mb-3 font-mono text-xs uppercase text-amber-300">Future ambition</p><h3 className="mb-3 text-xl font-semibold">Entrepreneurship & Consulting</h3><p className="text-sm leading-7 text-slate-300">Developing toward a future technology and business consulting venture, not an existing consulting practice.</p></article>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="py-16 px-6 border-t border-zinc-900 bg-zinc-950/90 relative z-20 text-center backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-white">Let's Connect & Collaborate</h2>
          <p className="text-zinc-400 text-sm mb-6">Open to professional opportunities and thoughtful business and technology collaboration.</p><div className="mb-6 flex flex-wrap justify-center gap-3"><a href="mailto:asbabillail@gmail.com?subject=Professional%20Collaboration" className="inline-flex items-center gap-2 rounded-full bg-teal-300 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300">Get in touch <ArrowUpRight className="h-4 w-4"/></a><a href="https://github.com/Asbabillail" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-5 py-3 text-white hover:border-teal-300/50">GitHub ↗</a></div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-400 text-sm">
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-emerald-400" /> Dammam – Khobar, Eastern Province, KSA</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Business × Operations × Technology</span>
          </div>
        </div>
      </footer>

    </div>
  );
}