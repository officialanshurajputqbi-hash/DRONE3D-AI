import React, { useState } from 'react';
import {
  BrainCircuit,
  Building,
  Navigation,
  TreePine,
  Car,
  AlertTriangle,
  Zap,
  Info,
  ShieldAlert,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AIDetectionItem } from '../../types';

export const AIAnalysisPage: React.FC = () => {
  const { detections } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<AIDetectionItem>(detections[0]);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Computer Vision & Semantic Segmentation
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            AI Scene Analysis & Object Classification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated semantic segmentation, surface classification, and dynamic object filtering.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] self-start sm:self-auto">
          Neural Model: Mask2Former + YOLO-v9
        </div>
      </div>

      {/* Dynamic Object Filtering Notice (SIH Mandate) */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-300">
            Specialized Dynamic Object Removal (SIH Problem Statement Requirement)
          </p>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Vehicles (18 detected) and moving pedestrians (6 detected) are automatically isolated using optical flow spatio-temporal tracking and removed from the 3D surface mesh. This prevents ghosting artifacts and restores true terrain geometry.
          </p>
        </div>
      </div>

      {/* Detection Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {detections.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedCategory(item)}
            className={`p-4 rounded-xl cursor-pointer transition-all border ${
              selectedCategory.id === item.id
                ? 'bg-slate-900 border-blue-500 shadow-md shadow-blue-500/15'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-medium truncate">{item.category}</span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
            <p className="font-mono text-xl font-bold text-white tracking-tight">{item.count}</p>
            <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
              {item.confidence}% Conf.
            </span>
          </div>
        ))}
      </div>

      {/* Detailed Analysis View: Heatmap Canvas + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Simulation Canvas */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Semantic Density Heatmap: {selectedCategory.category}
              </h3>
              <p className="text-slate-400 text-[11px]">
                Spatial distribution across the 2.84 km² survey envelope
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
              Class: {selectedCategory.type.toUpperCase()}
            </span>
          </div>

          {/* Graphical Heatmap Canvas */}
          <div className="h-64 w-full rounded-xl bg-slate-950/80 border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 600 240">
              <defs>
                <radialGradient id="cluster-1" cx="35%" cy="40%" r="35%">
                  <stop offset="0%" stopColor={selectedCategory.color} stopOpacity="0.8" />
                  <stop offset="60%" stopColor={selectedCategory.color} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={selectedCategory.color} stopOpacity="0" />
                </radialGradient>
                <radialGradient id="cluster-2" cx="70%" cy="60%" r="30%">
                  <stop offset="0%" stopColor={selectedCategory.color} stopOpacity="0.7" />
                  <stop offset="70%" stopColor={selectedCategory.color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={selectedCategory.color} stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="100%" height="100%" fill="#07111F" />
              <circle cx="210" cy="96" r="140" fill="url(#cluster-1)" />
              <circle cx="420" cy="144" r="120" fill="url(#cluster-2)" />

              {/* Grid Lines */}
              <g stroke="rgba(148,163,184,0.06)" strokeWidth="1">
                <line x1="0" y1="60" x2="600" y2="60" />
                <line x1="0" y1="120" x2="600" y2="120" />
                <line x1="0" y1="180" x2="600" y2="180" />
                <line x1="150" y1="0" x2="150" y2="240" />
                <line x1="300" y1="0" x2="300" y2="240" />
                <line x1="450" y1="0" x2="450" y2="240" />
              </g>

              {/* Footprint markers */}
              <circle cx="210" cy="96" r="6" fill="#FFFFFF" />
              <circle cx="420" cy="144" r="6" fill="#FFFFFF" />
              <text x="220" y="100" fill="#FFFFFF" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                Centroid Alpha
              </text>
              <text x="430" y="148" fill="#FFFFFF" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                Centroid Beta
              </text>
            </svg>

            <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/60 font-mono text-[10px] text-slate-300">
              <span>Heatmap Intensity:</span>
              <div className="w-16 h-2 rounded-full bg-gradient-to-r from-blue-900 via-cyan-500 to-emerald-400" />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {selectedCategory.detail}
          </p>
        </div>

        {/* Selected Category Details */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">Classification Attributes</span>
              <span className="font-mono text-xs font-bold text-cyan-400">
                {selectedCategory.count}
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Detection Method</span>
                <p className="font-semibold text-slate-200 mt-0.5">Dual-Stream Feature Pyramid</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Reconstruction Impact</span>
                <p className="font-semibold text-slate-200 mt-0.5">
                  {selectedCategory.type === 'dynamic'
                    ? 'Isolated and suppressed from final surface'
                    : 'Converted to volumetric 3D polygonal mesh'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Segmentation Confidence</span>
                <p className="font-mono text-base font-bold text-emerald-400 mt-0.5">
                  {selectedCategory.confidence}% (IoU: 0.88)
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Labels conform to ASPRS LAS LiDAR specifications.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
