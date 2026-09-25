import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  Map,
  Zap,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { MetricGauge } from '../common/MetricGauge';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  const monthlyFlights = [
    { month: 'Apr', count: 18, area: 14.2 },
    { month: 'May', count: 24, area: 21.0 },
    { month: 'Jun', count: 29, area: 24.5 },
    { month: 'Jul', count: 32, area: 28.1 },
    { month: 'Aug', count: 35, area: 32.4 },
    { month: 'Sep', count: 38, area: 36.8 },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Telemetry & Computational Metrics
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Reconstruction Analytics & Trends
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Performance benchmarking, spatial coverage accumulation, and processing time efficiency.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          {(['30d', '90d', '1y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase transition-colors ${
                timeRange === r ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Total Reconstructions</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">156 Missions</p>
          <span className="text-[10px] text-emerald-400 font-mono">+18% vs last quarter</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Avg Pipeline Latency</span>
          <p className="font-mono text-xl font-bold text-cyan-400 mt-0.5">04m 28s</p>
          <span className="text-[10px] text-emerald-400 font-mono">74% faster than SfM</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Cumulated Area Mapped</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">128.6 km²</p>
          <span className="text-[10px] text-cyan-400 font-mono">High-density terrain</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">System Uptime</span>
          <p className="font-mono text-xl font-bold text-emerald-400 mt-0.5">99.94%</p>
          <span className="text-[10px] text-slate-400 font-mono">GPU worker cluster</span>
        </div>
      </div>

      {/* Chart 1: Missions & Area Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Reconstruction Missions</h3>
              <p className="text-slate-400 text-[11px]">Flight ingestion throughput over the last 6 months</p>
            </div>
            <span className="font-mono text-cyan-400 text-xs">Total: 176</span>
          </div>

          <div className="h-56 w-full flex items-end justify-between gap-4 pt-4 px-2">
            {monthlyFlights.map((item) => {
              const heightPercent = (item.count / 40) * 100;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="font-mono text-[10px] text-slate-400">{item.count}</span>
                  <div className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-400 hover:brightness-110 transition-all" style={{ height: `${heightPercent}%` }} />
                  <span className="font-mono text-[11px] text-slate-300 font-bold">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Processing Time: DRONE3D AI vs Conventional SfM */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Processing Time Benchmarking</h3>
              <p className="text-slate-400 text-[11px]">Single-pass neural pipeline vs multi-pass photogrammetry</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
              74% Time Reduction
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">DRONE3D AI (Single-Pass Fusion)</span>
                <span className="font-mono text-emerald-400 font-bold">04:28 min</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[16%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Open-Source OpenSfM / Meshroom</span>
                <span className="font-mono text-slate-300">42:15 min</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[65%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Conventional Commercial Photogrammetry</span>
                <span className="font-mono text-slate-300">78:40 min</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-600 rounded-full w-[100%]" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
              By replacing dense exhaustive matching with continuous optical flow pose estimation and LightGlue transformers, DRONE3D achieves near real-time metric models suitable for immediate operational response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
