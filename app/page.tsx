'use client';

import YrefMatrixViewer from '@/components/ui/YrefMatrixViewer';
import InteractiveInfrastructureSuite from "@/components/InteractiveInfrastructureSuite";
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
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Wifi,
  Bot,
  Building2,
  Award,
  FileText
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

// --- CASE STUDY DETAIL DATA MAP ---
const CASE_STUDY_DETAILS: Record<string, {
  title: string;
  tagline: string;
  strategy: string;
  security: string;
  scalability: string;
  highlights: string[];
}> = {
  'Apple Enterprise': {
    title: 'Apple Enterprise Architecture & Jamf MDM',
    tagline: 'Zero-Touch macOS & 350+ iPad Fleet Management',
    strategy: 'Leveraged Apple School Manager (ASM) linked directly to Jamf Pro to orchestrate zero-touch deployment for 350+ iPads (300+ Student 1:1, ~50 Faculty) and macOS workstations.',
    security: 'Enforced FileVault full-disk encryption, automated compliance posture checks, web filtering, and scheduled iOS/macOS update rings.',
    scalability: 'Structured dynamic device groups supporting seamless annual student handovers and automated identity syncing.',
    highlights: ['ASM & Jamf Pro Zero-Touch Pipeline', '350+ Managed Apple Endpoints', 'Automated Profile & Licensing Provisioning']
  },
  'Microsoft 365 & Azure': {
    title: 'Microsoft 365 Enterprise Identity & Licensing',
    tagline: '1,050+ Seat Cloud Identity & Endpoint Governance',
    strategy: 'Engineered M365 A3 tenant architecture managing 1,000 Student A3, 25+ Faculty A3, and 25 Business licenses across Entra ID.',
    security: 'Conditional Access policies enforcing MFA, role-based identity access control, and Intune security baselines across 80+ Windows PCs.',
    scalability: 'Automated user onboarding/offboarding workflows integrated with active directory identity sync.',
    highlights: ['1,050+ M365 Active Licensing Scope', 'Intune Endpoint Policy Management', 'Entra ID MFA & Conditional Access']
  },
  'SMART Tech Displays': {
    title: 'SMART Display Interactive Ecosystem',
    tagline: '53-Unit Smart Board Governance & EdTech Infrastructure',
    strategy: 'Centralized governance of 53 SMART MX075-V5 interactive displays through SMART Admin console for OTA firmware and configuration push.',
    security: 'Isolated display network VLANs coupled with strict kiosk-mode profile permissions and remote screen lock capability.',
    scalability: 'Standardized room deployment templates supporting seamless screen mirroring, Lumio integration, and campus-wide broadcasting.',
    highlights: ['53 SMART Board MX075-V5 Deployment', 'SMART Admin Centralized Console', 'Lumio Cloud Content Platform']
  },
  'Innovation Labs & STEM': {
    title: 'Robotics, Brain & STEM Innovation Labs',
    tagline: '380+ Tracked Advanced Lab Infrastructure Assets',
    strategy: 'Designed and deployed multi-lab infrastructure comprising 108 Robotics Kits (Weemake/UBTECH), 93 Brain Lab units (Muse 2 Headbands), and 26 STEM VR/Drone kits.',
    security: 'Implemented hardware inventory audits (YREF v1.0), charging cart safety protocols, and asset tagging across all lab assets.',
    scalability: 'Standardized curriculum kit provisioning and continuous maintenance framework for 630+ active daily lab users.',
    highlights: ['108 Robotics & AI Learning Kits', '93 Muse 2 Brainwave Headbands', '26 STEM VR & Drone Ecosystems']
  }
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
        response = 'Available commands: help, title, scale, labs, network, certs, status, clear';
        break;
      case 'title':
        response = 'Role: Head of Tech & Innovation Department | Focus: Enterprise MDM, Cloud Identity & Infrastructure';
        break;
      case 'scale':
        response = 'Users: 630+ Daily | iPads: 350+ (Jamf) | Windows PCs: 80+ | M365 Seats: 1,050+ | Aruba APs: 60';
        break;
      case 'labs':
        response = 'Assets: 380+ | SMART Boards: 53 | Robotics Kits: 108 | Brain Lab: 93 | STEM VR/Drones: 26';
        break;
      case 'network':
        response = 'Firewall: FortiGate 200F | Core Switch: Cisco SG350 | Wireless: 60 Aruba AP25 | CCTV: 100+ | Access: 32';
        break;
      case 'certs':
        response = 'CCNA (Simplilearn #4489483), Python Data Science (#4464651), SMART MX-V5 Display Tech, SAP Consulting';
        break;
      case 'status':
        response = 'Location: Dammam-Khobar, KSA | Work Status: Transferable Status | Uptime: 99.99%';
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

  const currentModalData = selectedCaseStudy ? CASE_STUDY_DETAILS[selectedCaseStudy] : null;

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
          className="absolute top-12 left-8 w-36 h-36 rounded-3xl border border-white/20 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center p-7 shadow-2xl pointer-events-auto cursor-pointer hover:border-emerald-500/50 transition-colors"
        >
          <img src="https://cdn.simpleicons.org/apple/white" alt="Apple" className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
        </motion.div>

        {/* MICROSOFT */}
        <motion.div 
          onMouseEnter={() => playHoverSound(soundEnabled)}
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-12 right-8 w-36 h-36 rounded-3xl border border-white/20 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center p-7 shadow-2xl pointer-events-auto cursor-pointer hover:border-sky-500/50 transition-colors"
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
          className="absolute top-[18%] right-[22%] px-6 py-3 rounded-2xl border border-white/20 bg-zinc-900/40 backdrop-blur-2xl flex items-center justify-center shadow-xl pointer-events-auto cursor-pointer hover:border-emerald-400/50 transition-colors"
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
            <a href="#suite" className="hover:text-emerald-400 transition-colors">Architecture Suite</a>
            <a href="#labs" className="hover:text-emerald-400 transition-colors">Labs & Networks</a>
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
      <section id="about" className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-20 pt-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-emerald-400 mb-6 pointer-events-auto backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Head of Tech & Innovation Department</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-tight">
            Abdul Samad Babillail
          </h1>

          <p className="text-emerald-400 text-sm md:text-base font-mono mb-6 tracking-wide">
            Enterprise Endpoint Management, Cloud Identity & Infrastructure Leadership
          </p>

          <p className="text-zinc-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
            Directing technology operations for 630+ active daily users across 350+ Apple iPads (Jamf/ASM), 80+ Windows PCs, 380+ STEM/Lab hardware assets, and enterprise Fortinet/Aruba network infrastructure.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
            <a
              href="#ecosystem"
              className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 text-sm"
            >
              Explore Ecosystem <ChevronRight className="w-4 h-4" />
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

      {/* --- LIVE INFRASTRUCTURE METRICS DASHBOARD --- */}
      <section id="metrics" className="py-12 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-3">
              <Server className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">630+</div>
                <div className="text-xs text-zinc-400 font-mono">Active Daily Users</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-3">
              <Monitor className="w-8 h-8 text-sky-400 shrink-0" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">350+ iPads</div>
                <div className="text-xs text-zinc-400 font-mono">300+ 1:1 / ~50 Faculty</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-3">
              <Bot className="w-8 h-8 text-purple-400 shrink-0" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">380+ Assets</div>
                <div className="text-xs text-zinc-400 font-mono">Lab & STEM Assets</div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl flex items-center gap-3">
              <Cpu className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">1,050+ Seats</div>
                <div className="text-xs text-zinc-400 font-mono">M365 A3 & Business</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE INFRASTRUCTURE SUITE COMPONENT --- */}
      <section id="suite" className="py-12 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <InteractiveInfrastructureSuite />
        </div>
      </section>

      {/* --- YREF FRAMEWORK MATRIX SECTION --- */}
      <section id="yref-matrix" className="py-12 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
           <YrefMatrixViewer />
        </div>
      </section>

      {/* --- LABS & NETWORK INFRASTRUCTURE DETAIL SECTION --- */}
      <section id="labs" className="py-16 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-white">
              Campus Infrastructure & Lab Operations
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Hardware distribution and network topology across live educational and administrative spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LAB HARDWARE CATALOG */}
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-emerald-400" /> Tracked Lab Assets & Displays
              </h3>
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">SMART Board Interactive Displays (MX075-V5)</span>
                  <span className="font-bold text-emerald-400 font-mono bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/50">53 Units</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">Robotics & AI Kits (Weemake, UBTECH, Hiwonder)</span>
                  <span className="font-bold text-emerald-400 font-mono bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/50">108 Kits</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">Brain Lab Units (Muse 2 Brainwave Headbands)</span>
                  <span className="font-bold text-emerald-400 font-mono bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/50">93 Units</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">STEM VR & Drone Kits</span>
                  <span className="font-bold text-emerald-400 font-mono bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/50">26 Kits</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">ICT Lab Workstations & Peripherals</span>
                  <span className="font-bold text-emerald-400 font-mono bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-800/50">56 PCs</span>
                </div>
              </div>
            </div>

            {/* NETWORK & SECURITY TOPOLOGY */}
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Wifi className="w-5 h-5 text-sky-400" /> Network & Core Security Nodes
              </h3>
              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">Aruba Instant On AP25 Access Points</span>
                  <span className="font-bold text-sky-400 font-mono bg-sky-950/50 px-2.5 py-1 rounded border border-sky-800/50">60 APs</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">Fortinet FortiGate 200F Firewall</span>
                  <span className="font-bold text-sky-400 font-mono bg-sky-950/50 px-2.5 py-1 rounded border border-sky-800/50">Dual-WAN SD-WAN</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">Cisco SG350 Core Switch & Managed Distribution</span>
                  <span className="font-bold text-sky-400 font-mono bg-sky-950/50 px-2.5 py-1 rounded border border-sky-800/50">Gigabit Stack</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">Surveillance & Physical Door Controllers</span>
                  <span className="font-bold text-sky-400 font-mono bg-sky-950/50 px-2.5 py-1 rounded border border-sky-800/50">100+ CCTV / 32 Access</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="font-medium text-zinc-200">Grandstream PBX Voice IP Telephony</span>
                  <span className="font-bold text-sky-400 font-mono bg-sky-950/50 px-2.5 py-1 rounded border border-sky-800/50">60 Extensions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM / TECH STACK SECTION */}
      <section id="ecosystem" className="py-20 px-6 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
              Enterprise Tech Ecosystem
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm">
              Integrated ecosystem bridging hardware, interactive smart displays, identity systems, and robotics frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                Automated device enrollment, Jamf MDM integration, and 350+ iPad zero-touch deployment.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Jamf Pro</span>
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">ASM</span>
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
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                1,050+ M365 seats, Entra ID SSO/MFA, Intune policy suites, and 80+ PC governance.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Entra ID</span>
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Intune</span>
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
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                Fleet management of 53 SMART MX075-V5 panels via SMART Admin console governance.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">MX075-V5</span>
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Lumio</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }} 
              onClick={() => setSelectedCaseStudy('Innovation Labs & STEM')}
              className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-purple-500/10 border border-purple-500/20 p-3 flex items-center justify-center text-purple-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-100">Innovation Labs</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                380+ tracked assets across Robotics (108), Brain Lab (93), and STEM VR/Drone setups.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Weemake</span>
                <span className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300">Muse 2</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- CASE STUDY MODAL --- */}
      <AnimatePresence>
        {selectedCaseStudy && currentModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold text-white mb-1">{currentModalData.title}</h3>
              <p className="text-emerald-400 font-mono text-xs mb-4">{currentModalData.tagline}</p>
              
              <div className="space-y-3 text-zinc-300 text-sm mb-6">
                <div>
                  <strong className="text-zinc-100 block mb-1 text-xs">Deployment Strategy:</strong>
                  <p className="text-zinc-400 leading-relaxed text-xs">{currentModalData.strategy}</p>
                </div>
                <div>
                  <strong className="text-zinc-100 block mb-1 text-xs">Security Protocols:</strong>
                  <p className="text-zinc-400 leading-relaxed text-xs">{currentModalData.security}</p>
                </div>
                <div>
                  <strong className="text-zinc-100 block mb-1 text-xs">Scalability & Integration:</strong>
                  <p className="text-zinc-400 leading-relaxed text-xs">{currentModalData.scalability}</p>
                </div>
                
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-200 block mb-2">Key Architectural Highlights:</span>
                  <div className="space-y-1">
                    {currentModalData.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
      <footer id="contact" className="py-16 px-6 border-t border-zinc-900 bg-zinc-950/90 relative z-20 text-center backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-white">Let's Connect & Collaborate</h2>
          <p className="text-zinc-400 text-sm mb-6">Building resilient enterprise environments and smart digital infrastructure.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-400 text-sm">
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-emerald-400" /> Dammam – Khobar, Eastern Province, KSA</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Transferable Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}