import React, { useState } from 'react';
import {
  Ruler,
  Building,
  Box,
  Mountain,
  Compass,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AppPageId } from '../layout/Sidebar';
import { MeasurementType, MeasurementRecord } from '../../types';

interface MeasurementsPageProps {
  onNavigateTo3D: () => void;
}

export const MeasurementsPage: React.FC<MeasurementsPageProps> = ({ onNavigateTo3D }) => {
  const { measurements, addMeasurement, removeMeasurement } = useStore();

  const [calcType, setCalcType] = useState<MeasurementType>('distance');
  const [calcLabel, setCalcLabel] = useState('');
  const [calcValue, setCalcValue] = useState('');

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcLabel.trim() || !calcValue) return;

    const unitMap: Record<MeasurementType, string> = {
      distance: 'm',
      height: 'm',
      area: 'm²',
      volume: 'm³',
      elevation: 'm MSL',
      slope: '°',
    };

    const newRecord: MeasurementRecord = {
      id: `m-${Date.now()}`,
      type: calcType,
      value: parseFloat(calcValue) || 10,
      unit: unitMap[calcType],
      accuracy: '±2.4 cm',
      label: calcLabel.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    addMeasurement(newRecord);
    setCalcLabel('');
    setCalcValue('');
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Metric Validation Suite
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Geospatial & 3D Measurement Tools
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sub-centimeter linear distance, vertical height, polygon area, and volumetric excavation calculations.
          </p>
        </div>

        <button
          onClick={onNavigateTo3D}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Ruler className="w-4 h-4" />
          <span>Interactive 3D Viewport Measure</span>
        </button>
      </div>

      {/* Primary Key Metrics Display */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Building Height</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">24.8 m</p>
          <span className="text-[10px] text-emerald-400 font-mono">±3.8 cm accuracy</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Road Width</span>
          <p className="font-mono text-xl font-bold text-cyan-400 mt-0.5">7.2 m</p>
          <span className="text-[10px] text-emerald-400 font-mono">±2.1 cm accuracy</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Roof Area</span>
          <p className="font-mono text-xl font-bold text-blue-400 mt-0.5">1,284 m²</p>
          <span className="text-[10px] text-emerald-400 font-mono">±0.4 m² accuracy</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Enclosed Volume</span>
          <p className="font-mono text-xl font-bold text-amber-400 mt-0.5">14,820 m³</p>
          <span className="text-[10px] text-emerald-400 font-mono">±12.4 m³ accuracy</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Datum Elevation</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">432.8 m</p>
          <span className="text-[10px] text-cyan-400 font-mono">MSL Geoid EGM96</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Terrain Slope</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">8.4°</p>
          <span className="text-[10px] text-slate-400 font-mono">Drainage gradient</span>
        </div>
      </div>

      {/* Measurement Studio: Cross Section Profile + Add Measurement Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Elevation Cross-Section Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Terrain & Building Elevation Profile Cross-Section
              </h3>
              <p className="text-slate-400 text-[11px]">
                Transect A-A' (South-to-North 400m survey line)
              </p>
            </div>
            <span className="font-mono text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-slate-800">
              V-Scale: 1:200
            </span>
          </div>

          {/* SVG Elevation Profile Curve */}
          <div className="h-60 w-full rounded-xl bg-slate-950/80 border border-slate-800 p-4 relative flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 600 200">
              <defs>
                <linearGradient id="profile-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#07111F" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <g stroke="rgba(148,163,184,0.08)" strokeWidth="1">
                <line x1="40" y1="40" x2="560" y2="40" />
                <line x1="40" y1="90" x2="560" y2="90" />
                <line x1="40" y1="140" x2="560" y2="140" />
                <line x1="160" y1="20" x2="160" y2="180" />
                <line x1="300" y1="20" x2="300" y2="180" />
                <line x1="440" y1="20" x2="440" y2="180" />
              </g>

              {/* Elevation Profile Polygon with Building stepped profile */}
              <polygon
                points="40,150 120,146 160,142 160,70 240,70 240,138 310,135 340,130 380,45 440,45 440,126 510,124 560,120 560,180 40,180"
                fill="url(#profile-fill)"
                stroke="#06B6D4"
                strokeWidth="2.5"
              />

              {/* Height callout lines */}
              <line x1="200" y1="70" x2="200" y2="140" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="205" y="105" fill="#F59E0B" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                18.4m
              </text>

              <line x1="410" y1="45" x2="410" y2="128" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="415" y="85" fill="#60A5FA" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                24.8m
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Point A (0.0 m)</span>
            <span>Transect Length: 400.0 m</span>
            <span>Point A' (400.0 m)</span>
          </div>
        </div>

        {/* Add Measurement Record Form */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Log Metric Measurement</h3>
            <p className="text-slate-400 text-[11px] mb-4">Record ground-truth validated measurements.</p>

            <form onSubmit={handleAddNew} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Measurement Type</label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value as MeasurementType)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="distance">Distance / Length (m)</option>
                  <option value="height">Vertical Height (m)</option>
                  <option value="area">Surface Area (m²)</option>
                  <option value="volume">Volume (m³)</option>
                  <option value="elevation">Elevation MSL (m)</option>
                  <option value="slope">Slope Angle (°)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Feature Label</label>
                <input
                  type="text"
                  required
                  value={calcLabel}
                  onChange={(e) => setCalcLabel(e.target.value)}
                  placeholder="e.g., Gate Arch Height"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Measured Value</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={calcValue}
                  onChange={(e) => setCalcValue(e.target.value)}
                  placeholder="e.g., 18.4"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Measurement Register</span>
              </button>
            </form>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
            Validated against WGS84 Cartesian coordinates with RTK base station tie-ins.
          </div>
        </div>
      </div>

      {/* Measurement Register Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Registered Survey Measurements</h3>
          <span className="font-mono text-[11px] text-slate-400">
            {measurements.length} Active Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Feature Name / Description</th>
                <th className="py-2.5 px-3">Metric Value</th>
                <th className="py-2.5 px-3">Confidence & Accuracy</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 capitalize font-semibold text-cyan-400">{m.type}</td>
                  <td className="py-2.5 px-3 text-slate-200">{m.label}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    {m.value.toLocaleString()} {m.unit}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">{m.accuracy}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{m.timestamp}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => removeMeasurement(m.id)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
