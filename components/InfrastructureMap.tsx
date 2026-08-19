'use client';

import React, { useState } from 'react';

interface HardwareItem {
  name: string;
  category: 'Endpoints' | 'Display' | 'Network' | 'Robotics';
  count: string;
  status: 'Operational' | 'Deployment Ready' | 'Active';
}

const HARDWARE_ESTATE: HardwareItem[] = [
  { name: 'Apple iPads (ASM/Jamf Pro)', category: 'Endpoints', count: '300+', status: 'Active' },
  { name: 'Faculty Endpoints (Mac/Win)', category: 'Endpoints', count: '50', status: 'Active' },
  { name: 'SMART MX075-V5 Interactive Displays', category: 'Display', count: '53', status: 'Operational' },
  { name: 'FortiGate 200F Dual-WAN Security', category: 'Network', count: '1 Appliance', status: 'Operational' },
  { name: 'Aruba AP25 Wi-Fi 6 Access Points', category: 'Network', count: '60 APs', status: 'Operational' },
  { name: 'UBTECH AI Kits (Fantasy & Smart Life)', category: 'Robotics', count: '28 Sets', status: 'Deployment Ready' },
];

export default function InfrastructureMap() {
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Endpoints', 'Display', 'Network', 'Robotics'];

  const filtered = filter === 'All' 
    ? HARDWARE_ESTATE 
    : HARDWARE_ESTATE.filter(item => item.category === filter);

  return (
    <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-xl my-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-cyan-400 tracking-wider uppercase">Infrastructure Telemetry Map</h3>
          <p className="text-xs text-slate-400">Yenepoya IT Department Endpoint & Infrastructure Grid</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                filter === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase">{item.category}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                {item.status}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-100">{item.name}</div>
            <div className="text-2xl font-bold font-mono text-white mt-2">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}