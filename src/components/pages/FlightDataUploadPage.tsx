import React, { useState } from 'react';
import {
  Navigation2,
  FileSpreadsheet,
  CheckCircle2,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  Upload,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { generateDemoFlightTrack } from '../../data/mockData';

interface FlightDataUploadPageProps {
  onProceedToPipeline: () => void;
}

export const FlightDataUploadPage: React.FC<FlightDataUploadPageProps> = ({
  onProceedToPipeline,
}) => {
  const { flightData, setFlightData, activeProject } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'points'>('overview');

  const loadDemoTelemetry = () => {
    const points = generateDemoFlightTrack(activeProject.coordinates.lat, activeProject.coordinates.lng);
    setFlightData({
      pointsCount: 1000,
      flightDistance: '12.4 km',
      maxAltitude: '122.4 m',
      avgSpeed: '7.5 m/s',
      flightDuration: '12m 34s',
      points,
      fileName: 'JHS_2026_Flight_Telemetry_RTK.csv',
    });
  };

  const currentData = flightData || {
    pointsCount: 1000,
    flightDistance: '12.4 km',
    maxAltitude: '122.4 m',
    avgSpeed: '7.5 m/s',
    flightDuration: '12m 34s',
    points: generateDemoFlightTrack(activeProject.coordinates.lat, activeProject.coordinates.lng),
    fileName: 'JHS_2026_Flight_Telemetry_RTK.csv',
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Telemetry Ingestion · Step 2
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Flight Trajectory & Sensor Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            High-precision GNSS logs, IMU quaternions, and barometric pressure data for metric scale anchoring.
          </p>
        </div>

        <button
          onClick={loadDemoTelemetry}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Use Demo Flight Data (1,000 Pts)</span>
        </button>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Flight Distance</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">{currentData.flightDistance}</p>
          <span className="text-[10px] text-cyan-400">Total trajectory sweep</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Maximum Altitude</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">{currentData.maxAltitude}</p>
          <span className="text-[10px] text-emerald-400">Above Ground Level (AGL)</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Average Speed</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">{currentData.avgSpeed}</p>
          <span className="text-[10px] text-slate-400">Ground cruising velocity</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">GNSS Waypoints</span>
          <p className="font-mono text-xl font-bold text-cyan-400 mt-0.5">{currentData.pointsCount.toLocaleString()} Pts</p>
          <span className="text-[10px] text-emerald-400">10 Hz RTK Sampling</span>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Navigation2 className="w-4 h-4 text-cyan-400" />
            <span>Telemetry File: {currentData.fileName}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trajectory Map
            </button>
            <button
              onClick={() => setActiveTab('points')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === 'points' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Points Log (1,000)
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-4">
            {/* Visual SVG Trajectory Graphic */}
            <div className="h-64 w-full rounded-xl bg-slate-950/80 border border-slate-800 p-4 relative flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 600 240">
                <defs>
                  <linearGradient id="traj-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>

                {/* Grid */}
                <g stroke="rgba(148,163,184,0.06)" strokeWidth="1">
                  <line x1="50" y1="30" x2="550" y2="30" />
                  <line x1="50" y1="90" x2="550" y2="90" />
                  <line x1="50" y1="150" x2="550" y2="150" />
                  <line x1="50" y1="210" x2="550" y2="210" />
                  <line x1="150" y1="20" x2="150" y2="220" />
                  <line x1="300" y1="20" x2="300" y2="220" />
                  <line x1="450" y1="20" x2="450" y2="220" />
                </g>

                {/* Flight Strip Raster Path */}
                <path
                  d="M 60 40 L 540 40 L 540 80 L 60 80 L 60 120 L 540 120 L 540 160 L 60 160 L 60 200 L 540 200"
                  fill="none"
                  stroke="url(#traj-grad)"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                />

                {/* Start & End points */}
                <circle cx="60" cy="40" r="5" fill="#2563EB" />
                <text x="70" y="44" fill="#60A5FA" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  START (T+00:00)
                </text>

                <circle cx="540" cy="200" r="5" fill="#10B981" />
                <text x="440" y="204" fill="#34D399" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  END (T+12:34)
                </text>
              </svg>

              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-cyan-400">
                Lawnmower Scan Pattern · 8 Strips
              </div>
            </div>

            {/* Sensor Calibration Manifest */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">IMU Sampling Rate</span>
                <p className="font-mono font-bold text-white mt-0.5">200 Hz Tri-Axial</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">RTK Ambiguity Fix</span>
                <p className="font-mono font-bold text-emerald-400 mt-0.5">Fixed (100% Epochs)</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Position Uncertainty (1σ)</span>
                <p className="font-mono font-bold text-cyan-400 mt-0.5">H: 1.4cm · V: 2.2cm</p>
              </div>
            </div>
          </div>
        ) : (
          /* Points Table Preview */
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-[11px] font-mono">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-2.5">Idx</th>
                  <th className="py-2 px-2.5">Time</th>
                  <th className="py-2 px-2.5">Latitude</th>
                  <th className="py-2 px-2.5">Longitude</th>
                  <th className="py-2 px-2.5">Altitude</th>
                  <th className="py-2 px-2.5">Speed</th>
                  <th className="py-2 px-2.5">Pitch/Roll/Yaw</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {currentData.points.slice(0, 20).map((pt) => (
                  <tr key={pt.index} className="hover:bg-slate-800/40">
                    <td className="py-1.5 px-2.5 text-slate-500">{pt.index}</td>
                    <td className="py-1.5 px-2.5 text-cyan-400">{pt.time}</td>
                    <td className="py-1.5 px-2.5">{pt.lat}°</td>
                    <td className="py-1.5 px-2.5">{pt.lng}°</td>
                    <td className="py-1.5 px-2.5 text-emerald-400">{pt.alt}m</td>
                    <td className="py-1.5 px-2.5">{pt.speed}m/s</td>
                    <td className="py-1.5 px-2.5 text-slate-400">
                      {pt.pitch}° / {pt.roll}° / {pt.yaw}°
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action to proceed to pipeline */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onProceedToPipeline}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-md shadow-blue-500/25 flex items-center gap-2"
        >
          <span>Run 18-Stage AI Reconstruction</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
