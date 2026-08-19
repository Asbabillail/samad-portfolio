'use client';

import React from 'react';

interface VendorBid {
  name: string;
  technicalScore: number;
  yrefFitScore: number;
  mdmScore: number;
  trainingScore: number;
  deliveryScore: number;
  costScore: number;
}

const VENDORS: VendorBid[] = [
  { name: 'Vendor Alpha Robotics', technicalScore: 23, yrefFitScore: 19, mdmScore: 14, trainingScore: 13, deliveryScore: 9, costScore: 12 },
  { name: 'Vendor Beta STEM Solutions', technicalScore: 21, yrefFitScore: 17, mdmScore: 12, trainingScore: 14, deliveryScore: 8, costScore: 14 },
];

export default function RfqDashboard() {
  return (
    <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-xl my-6">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-cyan-400 tracking-wider uppercase">RFQ-ROB-2026-001 Scoring Matrix</h3>
        <p className="text-xs text-slate-400">Robotics Lab Procurement | 6-Factor Weighted Evaluation</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900 font-mono">
            <tr>
              <th className="p-3">Vendor</th>
              <th className="p-3">Tech (25)</th>
              <th className="p-3">YREF (20)</th>
              <th className="p-3">MDM (15)</th>
              <th className="p-3">Train (15)</th>
              <th className="p-3">Deliver (10)</th>
              <th className="p-3">Cost (15)</th>
              <th className="p-3 text-cyan-400">Total (100)</th>
            </tr>
          </thead>
          <tbody>
            {VENDORS.map((v, i) => {
              const total = v.technicalScore + v.yrefFitScore + v.mdmScore + v.trainingScore + v.deliveryScore + v.costScore;
              return (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-900/50">
                  <td className="p-3 font-semibold text-white">{v.name}</td>
                  <td className="p-3 font-mono">{v.technicalScore}</td>
                  <td className="p-3 font-mono">{v.yrefFitScore}</td>
                  <td className="p-3 font-mono">{v.mdmScore}</td>
                  <td className="p-3 font-mono">{v.trainingScore}</td>
                  <td className="p-3 font-mono">{v.deliveryScore}</td>
                  <td className="p-3 font-mono">{v.costScore}</td>
                  <td className="p-3 font-mono text-cyan-400 font-bold text-base">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}