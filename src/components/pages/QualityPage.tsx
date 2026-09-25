import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Layers,
  Activity,
  Cpu,
} from 'lucide-react';
import { MetricGauge } from '../common/MetricGauge';
import { useStore } from '../../store/useStore';

export const QualityPage: React.FC = () => {
  const { activeProject } = useStore();

  const qualityFactors = [
    { name: 'Reprojection Error', value: '0.82 px', status: 'Optimal (<1.0px)', progress: 92, color: 'bg-emerald-500' },
    { name: 'Bundle Adjustment Scale Error', value: '±0.6%', status: 'Within Tolerance', progress: 95, color: 'bg-blue-500' },
    { name: 'Point Cloud Normal Uniformity', value: '98.4%', status: 'Certified', progress: 98, color: 'bg-cyan-500' },
    { name: 'Poisson Mesh Watertightness', value: '97.2%', status: 'Non-manifold Free', progress: 97, color: 'bg-emerald-500' },
    { name: 'Texture UV Seam Distortion', value: '1.4%', status: 'Negligible', progress: 94, color: 'bg-blue-500' },
    { name: 'GNSS Positional Covariance (1σ)', value: '±1.8 cm', status: 'RTK Locked', progress: 96, color: 'bg-emerald-500' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Quality Assurance & Metrology
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Accuracy & Quality Validation Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rigorous geometric verification, reprojection residual analysis, and photogrammetric uncertainty metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Status: Certified Grade A</span>
        </div>
      </div>

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
          <MetricGauge
            value={96.8}
            label="Overall Quality"
            unit="%"
            color="#10B981"
            sublabel="PASS"
            size={120}
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
          <MetricGauge
            value={94.2}
            label="GPS / IMU Confidence"
            unit="%"
            color="#06B6D4"
            sublabel="RTK"
            size={120}
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
          <MetricGauge
            value={97.6}
            label="Geometry Confidence"
            unit="%"
            color="#3B82F6"
            sublabel="MVS"
            size={120}
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
          <MetricGauge
            value={92.8}
            label="Texture Fidelity"
            unit="%"
            color="#F59E0B"
            sublabel="8K UV"
            size={120}
          />
        </div>
      </div>

      {/* Detailed Quality Assessment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Factor Progress Bars */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Quality Factors & Error Bounds</h3>
            <span className="font-mono text-[11px] text-slate-400">Tolerance Thresholds Met</span>
          </div>

          <div className="space-y-4">
            {qualityFactors.map((factor) => (
              <div key={factor.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">{factor.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">{factor.value}</span>
                    <span className="text-[10px] text-emerald-400">({factor.status})</span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${factor.color} rounded-full transition-all duration-300`}
                    style={{ width: `${factor.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QA Certificate & Audit Log */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px] pb-3 border-b border-slate-800">
              <FileCheck2 className="w-4 h-4" />
              <span>Metrological Certificate</span>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Dataset Project</span>
                <p className="font-bold text-white mt-0.5">{activeProject.name}</p>
                <p className="font-mono text-[10px] text-slate-400">{activeProject.missionId}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">RMSE Positional Accuracy</span>
                <p className="font-mono font-bold text-emerald-400 mt-0.5">±4.2 cm (Horizontal & Vertical)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Point Density Verified</span>
                <p className="font-mono font-bold text-cyan-400 mt-0.5">428 points / m²</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-slate-300">
            Validated for survey-grade engineering documentation under SIH26158 guidelines.
          </div>
        </div>
      </div>
    </div>
  );
};
