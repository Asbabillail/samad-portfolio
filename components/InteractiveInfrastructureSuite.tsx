'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Server, ShieldCheck, Network, Cpu, RefreshCw, Terminal, Volume2, VolumeX } from 'lucide-react';

// --- SYSTEM SOUND EFFECTS ENGINE (Web Audio API) ---
const playAudioFX = (type: 'hover' | 'click' | 'scan', soundEnabled: boolean) => {
  if (!soundEnabled || typeof window === 'undefined') return;
  try {
    // @ts-ignore
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'scan') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // Audio Context fallback
  }
};

// --- TEXT SCRAMBLE / DECRYPTION HOOK ---
const ScrambleText = ({ text, trigger }: { text: string; trigger: number }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%-+=_&';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return <span>{displayText}</span>;
};

// --- ARCHITECTURE PRESETS ---
type ArchKey = 'mdm' | 'network' | 'edtech';

interface ArchDetail {
  title: string;
  subtitle: string;
  nodes: string;
  latency: string;
  security: string;
  status: string;
  diagram: string[];
}

const ARCHITECTURES: Record<ArchKey, ArchDetail> = {
  mdm: {
    title: "Jamf Pro & ASM Provisioning",
    subtitle: "Zero-Touch Endpoint Management & Entra ID Sync",
    nodes: "300+ iPads, 50+ Macs/PCs",
    latency: "Real-time Telemetry",
    security: "Managed Apple IDs",
    status: "ENFORCED",
    diagram: ["Apple School Manager", "Jamf Pro Engine", "Yenepoya Endpoints"]
  },
  network: {
    title: "Fortinet & Aruba Backbone",
    subtitle: "High-Availability Dual-WAN Security & Wi-Fi 6 Mesh",
    nodes: "1 FortiGate, 60 Aruba AP25s",
    latency: "Gigabit Throughput",
    security: "IPsec / Zero-Trust",
    status: "SECURED",
    diagram: ["FortiGate 200F", "Aruba Core Switch", "Aruba Wi-Fi 6 Nodes"]
  },
  edtech: {
    title: "Interactive Classroom Grids",
    subtitle: "SMART Boards & UBTECH Robotics AI Deployment",
    nodes: "53 Displays, 28 AI Kits",
    latency: "Local Subnet Mesh",
    security: "VLAN Isolated",
    status: "OPERATIONAL",
    diagram: ["SMART MX075-V5", "Instructional VLAN", "UBTECH AI Nodes"]
  }
};

export default function InteractiveInfrastructureSuite() {
  const [activeArch, setActiveArch] = useState<ArchKey>('mdm');
  const [simulating, setSimulating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scrambleTrigger, setScrambleTrigger] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 120, damping: 14 });
  const mouseY = useSpring(y, { stiffness: 120, damping: 14 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const bgX = useTransform(mouseX, [-0.5, 0.5], [-16, 16]);
  const bgY = useTransform(mouseY, [-0.5, 0.5], [-16, 16]);

  const midX = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const midY = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const triggerHover = () => {
    playAudioFX('hover', soundEnabled);
    setScrambleTrigger((prev) => prev + 1);
  };

  const selectArch = (key: ArchKey) => {
    playAudioFX('click', soundEnabled);
    setActiveArch(key);
    setScrambleTrigger((prev) => prev + 1);
  };

  const runSimulation = () => {
    playAudioFX('scan', soundEnabled);
    setSimulating(true);
    setTimeout(() => setSimulating(false), 1800);
  };

  const current = ARCHITECTURES[activeArch];

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto font-sans">
      <div className="perspective-1000">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={triggerHover}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative rounded-3xl bg-zinc-900/90 border border-emerald-500/30 p-6 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] backdrop-blur-xl overflow-hidden"
        >
          <motion.div
            style={{ x: bgX, y: bgY, translateZ: -25 }}
            className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none"
          />

          <motion.div style={{ x: midX, y: midY, translateZ: 15 }} className="relative z-10 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Terminal className="w-4 h-4" />
                <ScrambleText text="SYSTEM ARCHITECTURE INSPECTOR" trigger={scrambleTrigger} />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-emerald-400 transition-colors border border-zinc-700/50"
                  title="Toggle Audio UI FX"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {(['mdm', 'network', 'edtech'] as ArchKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => selectArch(key)}
                  onMouseEnter={() => playAudioFX('hover', soundEnabled)}
                  className={`py-2 px-3 text-xs font-mono rounded-xl transition-all border uppercase ${
                    activeArch === key
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {key} ARCH
                </button>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-black text-white tracking-tight font-mono mb-1">
                <ScrambleText text={current.title} trigger={scrambleTrigger} />
              </h3>
              <p className="text-xs text-zinc-400 font-mono">{current.subtitle}</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950/90 border border-emerald-500/20 relative overflow-hidden my-4">
              {simulating && (
                <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex items-center justify-center gap-2 text-emerald-400 text-xs font-mono animate-pulse z-20">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <ScrambleText text="EXECUTING TELEMETRY SIMULATION..." trigger={scrambleTrigger} />
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-300 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <Server className="w-4 h-4 text-emerald-400" /> {current.diagram[0]}
                </div>
                <div className="hidden md:block h-0.5 flex-1 bg-emerald-500/40 animate-pulse mx-2" />
                <div className="flex items-center gap-2 text-cyan-300 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <Network className="w-4 h-4 text-cyan-400" /> {current.diagram[1]}
                </div>
                <div className="hidden md:block h-0.5 flex-1 bg-emerald-500/40 animate-pulse mx-2" />
                <div className="flex items-center gap-2 text-emerald-400 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <ShieldCheck className="w-4 h-4" /> {current.diagram[2]}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="relative z-20 pt-4 border-t border-zinc-800">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 font-mono uppercase">Scale</div>
                <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{current.nodes}</div>
              </div>
              <div className="bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 font-mono uppercase">Performance</div>
                <div className="text-xs font-bold text-cyan-400 font-mono mt-0.5">{current.latency}</div>
              </div>
              <div className="bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 font-mono uppercase">Security</div>
                <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{current.security}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {current.status}
              </span>

              <button
                onClick={runSimulation}
                onMouseEnter={() => playAudioFX('hover', soundEnabled)}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono hover:bg-emerald-500/30 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                <Cpu className="w-3.5 h-3.5" /> Simulate Flow
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}