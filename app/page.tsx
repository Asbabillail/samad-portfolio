'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MapPin,
  ChevronRight,
  Terminal,
  Sparkles,
  Monitor,
  Volume2,
  VolumeX,
  X,
  Activity,
  Server,
  Layers,
  Cpu
} from 'lucide-react';

// --- SOUND EFFECT GENERATOR ---
const playHoverSound = (enabled: boolean) => {
  if (!enabled) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Audio context initialization fallback
  }
};

// --- FLUID BACKGROUND COMPONENT ---
const FluidSmokeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    import('webgl-fluid')
      .then((webGLFluid) => {
        const fluid = webGLFluid.default || webGLFluid;
        if (canvasRef.current && typeof fluid === 'function') {
          fluid(canvasRef.current, {
            IMMEDIATE: true,
            TRIGGER: 'hover',
            SIM_RESOLUTION: 128,
            DYE_RESOLUTION: 1024,
            CAPTURE_RESOLUTION: 512,
            DENSITY_DISSIPATION: 3.5,
            VELOCITY_DISSIPATION: 2.0,
            PRESSURE: 0.8,
            PRESSURE_ITERATIONS: 20,
            CURL: 30,
            SPLAT_RADIUS: 0.25,
            SPLAT_FORCE: 6000,
            SHADING: true,
            COLORFUL: true,
            COLOR_UPDATE_SPEED: 10,
            PAUSED: false,
            BACK_COLOR: { r: 9, g: 9, b: 11 },
            TRANSPARENT: false,
            BLOOM: true,
            BLOOM_ITERATIONS: 8,
            BLOOM_RESOLUTION: 256,
            BLOOM_INTENSITY: 0.8,
            BLOOM_THRESHOLD: 0.6,
            SUNRAYS: true,
            SUNRAYS_RESOLUTION: 196,
            SUNRAYS_WEIGHT: 1.0,
          });
        }
      })
      .catch((err) => console.error('WebGL Fluid error:', err));
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-auto"
    />
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; result: string }>>([
    { cmd: 'system.init', result: 'SAMAD-OS v3.0 loaded successfully. Type "help" for available commands.' }
  ]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null);

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
        response = 'Available commands: help, skills, architecture, status, clear';
        break;
      case 'skills':
        response = 'Jamf Pro, Apple Business Manager, Entra ID, Microsoft Intune, SMART Admin, WAN Infrastructure, Robotics';
        break;
      case 'architecture':
        response = 'Hybrid Enterprise Architecture: Apple ABM/Jamf + Azure Entra ID + SMART Display Fleet Sync.';
        break;
      case 'status':
        response = 'Nodes Active: 500+ | MDM Compliance: 100% | Uptime: 99.99%';
        break;
      case 'clear':
        setCommandHistory([]);
        setInputVal('');
        return;
      default:
        response = `Command not recognized: "${cleanCmd}". Type "help" for options.`;
    }

    setCommandHistory((prev) => [...prev, { cmd: inputVal, result: response }]);
    setInputVal('');
  };

  return (
    <div className="min-h-screen text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black relative overflow-hidden bg-zinc-950">
      {/* Background Fluid Canvas */}
      <FluidSmokeBackground />

      {/* --- FLOATING LOGO MATRIX --- */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
        
        {/* APPLE */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-12 left-8 w-36 h-36 rounded-3xl border border-white/20 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center p-7 shadow-2xl pointer-events-auto cursor-pointer"
        >
          <img src="https://cdn.simpleicons.org/apple/white" alt="Apple" className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
        </motion.div>

        {/* MICROSOFT */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-12 right-8 w-36 h-36 rounded-3xl border border-white/20 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center p-7 shadow-2xl pointer-events-auto cursor-pointer"
        >
          <svg className="w-full h-full object-contain" viewBox="0 0 23 23">
            <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
            <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
            <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
            <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
          </svg>
        </motion.div>

        {/* SMART */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, -8, 0] }} 
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[18%] right-[22%] px-6 py-3 rounded-2xl border border-white/20 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center shadow-xl pointer-events-auto cursor-pointer"
        >
          <span className="text-white font-extrabold text-2xl tracking-tight font-sans">SMART<span className="text-sky-400">.</span></span>
        </motion.div>

        {/* PICO */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, 12, 0] }} 
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[26%] left-[16%] px-6 py-3 rounded-2xl border border-white/20 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center shadow-xl h-14 pointer-events-auto cursor-pointer"
        >
          <span className="text-white font-black text-2xl tracking-wider font-sans">PICO</span>
        </motion.div>

        {/* GOOGLE */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[44%] left-6 w-36 h-36 rounded-3xl border border-white/20 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center p-7 shadow-2xl pointer-events-auto cursor-pointer"
        >
          <svg className="w-full h-full object-contain" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
        </motion.div>

        {/* MAKEBLOCK */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, 9, 0] }} 
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[66%] left-[12%] px-6 py-3 rounded-2xl border border-cyan-500/30 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center shadow-xl h-14 pointer-events-auto cursor-pointer"
        >
          <span className="text-[#00A0E9] font-extrabold text-xl tracking-tight">makeblock</span>
        </motion.div>

        {/* LEGO EDUCATION */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, -11, 0] }} 
          transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-[10%] left-[6%] px-5 py-3 rounded-2xl border border-red-500/30 bg-zinc-900/40 backdrop-blur-2xl flex items-center gap-3 shadow-xl pointer-events-auto cursor-pointer"
        >
          <div className="bg-[#D01012] text-white font-black text-xs px-2.5 py-1 rounded tracking-tighter border border-white/20">LEGO</div>
          <span className="text-white font-semibold text-xs tracking-wider uppercase">education</span>
        </motion.div>

        {/* AZURE */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, 8, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-[10%] left-[26%] w-32 h-32 rounded-3xl border border-sky-500/30 bg-zinc-900/40 backdrop-blur-2xl flex flex-col items-center justify-center p-3 shadow-2xl pointer-events-auto cursor-pointer"
        >
          <svg className="w-12 h-12 mb-1 object-contain" viewBox="0 0 96 96" fill="none">
            <path d="M57.6 12L31.2 55.2L12 84H33.6L57.6 44.4L76.8 84H96L57.6 12Z" fill="#0078D4"/>
            <path d="M12 84L38.4 44.4L57.6 12H38.4L0 73.2L12 84Z" fill="#50E6FF"/>
          </svg>
          <span className="text-sky-400 font-bold text-xs tracking-wider">Azure</span>
        </motion.div>

        {/* JAMF */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, -12, 0] }} 
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[30%] right-8 w-36 h-36 rounded-3xl border border-white/20 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center p-5 shadow-2xl pointer-events-auto cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-8 bg-[#7088A8] rounded-[3px]"></div>
            <span className="text-zinc-200 font-light text-4xl tracking-tight font-sans leading-none pb-1">
              jamf
            </span>
          </div>
        </motion.div>

        {/* UBTECH */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[52%] right-[4%] px-6 py-3 rounded-2xl border border-sky-400/30 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center shadow-xl h-14 pointer-events-auto cursor-pointer"
        >
          <span className="text-[#00A2E8] font-black text-xl tracking-wider">UBTECH</span>
        </motion.div>

        {/* SPHERO */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, -9, 0] }} 
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[72%] right-[22%] px-6 py-3 rounded-2xl border border-sky-500/30 bg-zinc-900/40 backdrop-blur-2xl shadow-xl h-14 flex items-center justify-center pointer-events-auto cursor-pointer"
        >
          <span className="text-[#00A9E0] font-bold text-lg tracking-wide flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#00A9E0] inline-block"></span> sphero
          </span>
        </motion.div>

        {/* HIWONDER */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, 11, 0] }} 
          transition={{ duration: 7.1, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-[10%] right-[32%] px-6 py-3 rounded-2xl border border-orange-500/30 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center shadow-xl h-14 pointer-events-auto cursor-pointer"
        >
          <span className="text-[#F36C21] font-bold text-lg tracking-wide">Hiwonder</span>
        </motion.div>

        {/* ACEBOTT */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 6.7, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-[6%] right-[8%] px-6 py-3 rounded-2xl border border-blue-600/30 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center shadow-xl h-14 pointer-events-auto cursor-pointer"
        >
          <span className="text-[#004B93] font-black text-lg tracking-widest">ACEBOTT</span>
        </motion.div>

      </div>

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

          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-300 font-medium">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#metrics" className="hover:text-emerald-400 transition-colors">Metrics</a>
            <a href="#ecosystem" className="hover:text-emerald-400 transition-colors">Ecosystem</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
              title={soundEnabled ? "Mute Sound FX" : "Enable Sound FX"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <a
              href="#contact"
              className="px-4 py-2 text-xs font-semibold rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              Connect
            </a>
          </div>
        </div>
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
                  placeholder="Type 'help' for available commands..."
                  className="bg-transparent text-emerald-300 focus:outline-none w-full font-mono"
                  autoFocus
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-20 pt-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-emerald-400 mb-6 pointer-events-auto backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Head of IT & Enterprise Digital Transformation</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-tight">
            Abdul Samad
          </h1>

          <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
            Strategic IT Leader specializing in Enterprise Infrastructure Architecture, RFQ/Procurement, SMART Displays, and Digital Transformation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
            <a
              href="#ecosystem"
              className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              Explore Ecosystem <ChevronRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setTerminalOpen(true)}
              className="px-6 py-3 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-200 font-semibold hover:bg-zinc-800 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-emerald-400" /> Open Terminal
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- LIVE INFRASTRUCTURE METRICS DASHBOARD --- */}
      <section id="metrics" className="py-12 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-3">
              <Server className="w-8 h-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-zinc-400 font-mono">Active MDM Nodes</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-3">
              <Activity className="w-8 h-8 text-sky-400" />
              <div>
                <div className="text-2xl font-bold text-white">99.99%</div>
                <div className="text-xs text-zinc-400 font-mono">Uptime SLA</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-3">
              <Layers className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-zinc-400 font-mono">Zero-Touch Enrolled</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-3">
              <Cpu className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-2xl font-bold text-white">Hybrid</div>
                <div className="text-xs text-zinc-400 font-mono">Entra ID / Active Directory</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM / TECH STACK SECTION */}
      <section id="ecosystem" className="py-24 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
              Enterprise Tech Ecosystem
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Integrated ecosystem bridging hardware, interactive smart displays, identity systems, and robotics frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -4 }} 
              onClick={() => setSelectedCaseStudy('Apple Enterprise')}
              className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-zinc-800/90 p-3 flex items-center justify-center">
                <svg className="w-full h-full fill-white object-contain" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.83.13-9.67-1.92-14.52-6.13-3.23-2.73-7.14-7.46-11.73-14.19-6.45-9.48-11.38-19.86-14.8-31.14-3.42-11.28-5.13-22.14-5.13-32.58 0-14.28 3.52-25.9 10.56-34.85 7.04-8.95 15.86-13.49 26.46-13.62 4.83 0 10.15 1.25 15.96 3.75 5.81 2.5 9.79 3.75 11.94 3.75 1.83 0 5.92-1.31 12.27-3.93 6.35-2.62 11.73-3.83 16.14-3.63 12.02.54 21.6 4.96 28.74 13.26-10.87 6.58-16.18 15.75-15.93 27.5.25 9.17 3.86 16.85 10.83 23.04 6.97 6.19 15.18 9.58 24.63 10.17-2.54 7.63-5.94 15.22-10.2 22.77zM119.22 31.84c0-7.39 2.72-14.4 8.16-21.03 5.44-6.63 12.19-10.42 20.25-11.37.13.9.19 1.8.19 2.7 0 7.27-2.78 14.33-8.34 21.18-5.57 6.85-12.38 10.63-20.44 11.34-.04-.84-.1-1.78-.18-2.82z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">Apple Enterprise</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Automated device enrollment, Jamf MDM integration, and enterprise-wide macOS/iOS zero-touch deployment.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Jamf Pro</span>
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">ABM</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }} 
              onClick={() => setSelectedCaseStudy('Microsoft 365 & Azure')}
              className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-zinc-800/90 p-3 flex items-center justify-center">
                <svg className="w-full h-full object-contain" viewBox="0 0 23 23">
                  <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                  <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
                  <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
                  <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">Microsoft 365 & Azure</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Entra ID SSO/MFA, Intune policy suites, Active Directory schema architecture, and Defender endpoint security.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Entra ID</span>
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Azure</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }} 
              onClick={() => setSelectedCaseStudy('SMART Tech Displays')}
              className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center justify-center text-emerald-400">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">SMART Tech Displays</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Fleet management of SMART MX V5 panels via centralized SMART Admin console governance.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">SMART MX V5</span>
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Lumio</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CASE STUDY MODAL --- */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedCaseStudy}</h3>
              <p className="text-emerald-400 font-mono text-xs mb-4">Detailed Architectural Overview</p>
              <div className="space-y-3 text-zinc-300 text-sm mb-6">
                <p><strong>Deployment Strategy:</strong> Zero-Touch Automated Provisioning with zero end-user configuration requirement.</p>
                <p><strong>Security Protocols:</strong> SSO MFA enforcement, continuous posture monitoring, and centralized compliance enforcement.</p>
                <p><strong>Scalability:</strong> Designed for multi-site deployment supporting scalable network nodes and active remote fleets.</p>
              </div>
              <button 
                onClick={() => setSelectedCaseStudy(null)}
                className="w-full py-2.5 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all text-xs"
              >
                Close Technical Deep-Dive
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer id="contact" className="py-16 px-6 border-t border-zinc-900 bg-zinc-950/90 relative z-20 text-center backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-white">Let's Connect & Collaborate</h2>
          <p className="text-zinc-400 text-sm mb-6">Building resilient enterprise environments and smart digital infrastructure.</p>
          <div className="flex justify-center gap-6 text-zinc-400 text-sm">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> contact@samadportfolio.com</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> Saudi Arabia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}