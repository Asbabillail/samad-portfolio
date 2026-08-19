'use client';

import React, { useState } from 'react';

// Institutional YREF Competency Framework Data
const YREF_DATA = [
  {
    tier: 1,
    title: 'Certified Robotics Explorer',
    hardware: 'UBTECH AI Fantasy Zoo, KUBO Coding Sets',
    competency: 'Basic Algorithm Logic, Directional Sequencing, Motor Actuation & Mechanical Structure',
    rubric: '75% Practical Assessment, Complete Portfolio & Safety Protocol Compliance',
    targetGrade: 'Grades 3–4 (Diagnostic Placement)',
  },
  {
    tier: 2,
    title: 'Certified Robotics Engineer',
    hardware: 'UBTECH AI Smart Life, City Guardian Sets, LEGO SPIKE Prime',
    competency: 'Sensory Integration (Ultrasonic/IR), Structural Mechanics, Gear Ratios & Event-Driven Coding',
    rubric: '75% Practical Assessment + Autonomous Navigation Task Completion',
    targetGrade: 'Grades 5–6 (Diagnostic Placement)',
  },
  {
    tier: 3,
    title: 'Certified AI Robotics Innovator',
    hardware: 'UBTECH AI Smart Life (Advanced), Python IDE, Vision AI Modules',
    competency: 'Text-Based Coding (Python), Machine Vision Perception, Machine Learning Model Training & IoT',
    rubric: '75% Combined Score (30% Theory, 70% Practical Capstone Project)',
    targetGrade: 'Grades 7–9 (Diagnostic Placement)',
  },
  {
    tier: 4,
    title: 'Certified Advanced Robotics Specialist',
    hardware: 'UBTECH Yanshee Humanoid, Arduino / ESP32, Advanced Python & ROS',
    competency: 'Humanoid Kinematics, Complex Vision AI Processing, Embedded Microcontrollers & System Integration',
    rubric: 'Mastery Demonstration, Autonomous Task Execution & Formal Engineering Logbook',
    targetGrade: 'Grades 10–12 (Diagnostic Placement)',
  },
];

export default function YrefMatrixViewer() {
  const [activeTier, setActiveTier] = useState<number>(1);
  const currentData = YREF_DATA.find((item) => item.tier === activeTier)!;

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 rounded-3xl bg-slate-900/70 border border-teal-500/20 backdrop-blur-2xl font-mono text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs text-teal-400 mb-1">
            YENEPOYA ROBOTICS EDUCATION FRAMEWORK (YREF)
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            FRAMEWORK COMPETENCY MATRIX
          </h2>
        </div>
      </div>

      {/* Tier Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
        {YREF_DATA.map((item) => {
          const isActive = activeTier === item.tier;
          return (
            <button
              key={item.tier}
              onClick={() => setActiveTier(item.tier)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'bg-teal-500/20 border-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] tracking-widest text-slate-400 uppercase">TIER 0{item.tier}</span>
              <span className="text-xs font-bold mt-1">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Tier Details Panel */}
      <div className="p-6 rounded-2xl border border-teal-500/30 bg-slate-950/60">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Certification Level Title</span>
              <h3 className="text-xl font-extrabold text-white">{currentData.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{currentData.targetGrade}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Authorized Hardware Stack</span>
              <p className="text-sm font-semibold text-teal-200">{currentData.hardware}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Core Competency Focus</span>
              <p className="text-xs text-slate-200 leading-relaxed">{currentData.competency}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase text-slate-400 mb-1 block">Assessment Threshold</span>
              <p className="text-xs font-bold text-amber-300">{currentData.rubric}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}