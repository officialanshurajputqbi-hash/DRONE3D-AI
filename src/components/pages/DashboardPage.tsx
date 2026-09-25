import React from 'react';
import {
  FolderKanban,
  Box,
  Cpu,
  ShieldCheck,
  Map,
  Zap,
  ArrowRight,
  Sparkles,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { MetricGauge } from '../common/MetricGauge';
import { AppPageId } from '../layout/Sidebar';

interface DashboardPageProps {
  onNavigate: (page: AppPageId) => void;
  onOpenLiveDemo: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenLiveDemo,
}) => {
  const { user, projects, activeProject, setActiveProject } = useStore();

  const stats = [
    {
      label: 'Active Projects',
      value: '12',
      change: '+3 this week',
      trend: 'up',
      icon: FolderKanban,
      color: 'border-l-blue-500',
    },
    {
      label: 'Models Generated',
      value: '38',
      change: '+8 this month',
      trend: 'up',
      icon: Box,
      color: 'border-l-cyan-500',
    },
    {
      label: 'Processing Jobs',
      value: '04',
      change: '2 completing soon',
      trend: 'neutral',
      icon: Cpu,
      color: 'border-l-emerald-500',
    },
    {
      label: 'Average Accuracy',
      value: '96.8%',
      change: '+1.4% improvement',
      trend: 'up',
      icon: ShieldCheck,
      color: 'border-l-indigo-500',
    },
    {
      label: 'Total Area Mapped',
      value: '128.6 km²',
      change: '+18.2 km² this week',
      trend: 'up',
      icon: Map,
      color: 'border-l-teal-500',
    },
    {
      label: 'Time Saved vs Manual',
      value: '74%',
      change: 'Over conventional SfM',
      trend: 'up',
      icon: Zap,
      color: 'border-l-amber-500',
    },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header with greeting and CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
            Good morning · {user?.organization || 'SIH Command Lab'}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Drone3D AI Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Single-pass aerial telemetry ingestion, real-time sensor fusion & 3D digital twins.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('new-project')}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Reconstruction</span>
          </button>

          <button
            onClick={onOpenLiveDemo}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-semibold text-xs transition-colors flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Demo Project</span>
          </button>
        </div>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`p-4 rounded-xl bg-slate-900/60 border border-slate-800 border-l-4 ${item.color} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-medium truncate">{item.label}</span>
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {item.value}
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 truncate">
                  <TrendingUp className="w-3 h-3 shrink-0" />
                  <span>{item.change}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Middle Section: Active Project Spotlight + Accuracy Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Project Spotlight Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Mission Digital Twin
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Completed · 96.8% Certified
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
              {activeProject.name}
            </h2>
            <p className="text-xs text-slate-400">
              {activeProject.location} · Drone: {activeProject.droneModel} · Camera: {activeProject.cameraModel}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Altitude</span>
                <p className="font-mono text-base font-bold text-white mt-0.5">{activeProject.flightAltitude} m</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Mapped Area</span>
                <p className="font-mono text-base font-bold text-white mt-0.5">{activeProject.mappedArea} km²</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Mesh Vertices</span>
                <p className="font-mono text-base font-bold text-white mt-0.5">{activeProject.modelStats.vertices}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Processing Time</span>
                <p className="font-mono text-base font-bold text-emerald-400 mt-0.5">{activeProject.processingTime || '04:28'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => onNavigate('viewer3d')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Launch 3D Viewport</span>
            </button>
            <button
              onClick={() => onNavigate('gis')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Open GIS Map</span>
            </button>
            <button
              onClick={() => onNavigate('pipeline')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Inspect Pipeline Stages</span>
            </button>
          </div>
        </div>

        {/* Quality Certification Gauges */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">Reconstruction Accuracy</span>
              <span className="text-[10px] font-mono text-emerald-400">Validated</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <MetricGauge
                value={96.8}
                label="Overall Precision"
                unit="%"
                color="#10B981"
                size={110}
              />
              <MetricGauge
                value={94.2}
                label="GPS Confidence"
                unit="%"
                color="#06B6D4"
                size={110}
              />
              <MetricGauge
                value={97.6}
                label="Geometry Fit"
                unit="%"
                color="#3B82F6"
                size={110}
              />
              <MetricGauge
                value={92.8}
                label="Texture UV"
                unit="%"
                color="#F59E0B"
                size={110}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Reprojection Error: 0.82 px</span>
            <span className="text-emerald-400">Tolerance: &lt; 1.0 px</span>
          </div>
        </div>
      </div>

      {/* 4. Recent Projects Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Reconstruction Projects Repository</h3>
            <p className="text-xs text-slate-400 mt-0.5">Single-pass drone datasets under active management</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View All (12)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Project & Mission</th>
                <th className="py-3 px-3">Geographic Coordinates</th>
                <th className="py-3 px-3">Drone / Camera</th>
                <th className="py-3 px-3">Accuracy</th>
                <th className="py-3 px-3">Mapped Area</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-200">{p.name}</p>
                    <p className="font-mono text-[10px] text-slate-400">{p.missionId}</p>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {p.coordinates.lat.toFixed(4)}°N, {p.coordinates.lng.toFixed(4)}°E
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <p>{p.droneModel}</p>
                    <p className="text-[10px] text-slate-500">{p.cameraModel}</p>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {p.accuracy}%
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {p.mappedArea} km²
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                        p.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : p.status === 'processing'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setActiveProject(p.id);
                        onNavigate('viewer3d');
                      }}
                      className="px-2.5 py-1 rounded bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold transition-colors"
                    >
                      Open 3D
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
