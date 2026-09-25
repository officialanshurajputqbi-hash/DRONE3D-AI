import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  Route,
  ShieldAlert,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DamageZone, PriorityLevel } from '../../types';

export const DisasterPage: React.FC = () => {
  const { damageZones, updateDamageZoneStatus } = useStore();
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [beforeAfterMode, setBeforeAfterMode] = useState<'after' | 'before'>('after');

  const filteredZones = damageZones.filter(
    (z) => filterPriority === 'all' || z.priority === filterPriority
  );

  const priorityBadgeStyle: Record<PriorityLevel, string> = {
    critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
    high: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    medium: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    low: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Flame className="w-3 h-3" />
            <span>Emergency Operations Mode</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            Disaster Rapid Assessment & Damage Triage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated detection of collapsed masonry, compromised bridges, and obstructed emergency ingress corridors.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[11px]">
          <span className="text-slate-400">Mission:</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">
            RAPID-RESCUE-01
          </span>
        </div>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
          <div className="flex items-center justify-between text-red-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Critical Priority</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-white">07</p>
          <span className="text-[10px] text-red-400">Immediate evacuation hazard</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[10px] uppercase font-bold">High Priority</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-white">14</p>
          <span className="text-[10px] text-amber-400">Severe structural cracks</span>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
          <div className="flex items-center justify-between text-blue-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Medium Priority</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-white">28</p>
          <span className="text-[10px] text-blue-400">Moderate surface wear</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Low Priority</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-white">46</p>
          <span className="text-[10px] text-slate-400">Minor debris clearing</span>
        </div>
      </div>

      {/* Before / After Aerial Comparison Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">
              Temporal Elevation & Geomorphic Change Detection
            </h3>
            <p className="text-slate-400 text-[11px]">
              Comparing pre-event baseline satellite DEM vs single-pass reconstructed 3D digital twin
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setBeforeAfterMode('after')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                beforeAfterMode === 'after' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Post-Event 3D Model
            </button>
            <button
              onClick={() => setBeforeAfterMode('before')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                beforeAfterMode === 'before' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pre-Event Satellite
            </button>
          </div>
        </div>

        {/* Comparison Visualizer Box */}
        <div className="h-48 w-full rounded-xl bg-slate-950/80 border border-slate-800 relative flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 600 180">
            {beforeAfterMode === 'after' ? (
              <g>
                <rect width="100%" height="100%" fill="#0A1628" />
                {/* Fault line / landslide scarp */}
                <path
                  d="M 120 40 Q 240 110 380 90 T 540 140"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3.5"
                />
                <circle cx="260" cy="100" r="18" fill="rgba(239,68,68,0.25)" className="animate-ping" />
                <circle cx="260" cy="100" r="6" fill="#EF4444" />
                <text x="275" y="105" fill="#EF4444" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                  LANDSLIDE SCARP: 2.4m DISPLACEMENT
                </text>
                <text x="140" y="55" fill="#F8FAFC" fontSize="10" fontFamily="JetBrains Mono">
                  Blocked Access Ingress
                </text>
              </g>
            ) : (
              <g>
                <rect width="100%" height="100%" fill="#081A2E" />
                <path d="M 120 40 Q 240 70 380 80 T 540 90" fill="none" stroke="#10B981" strokeWidth="2" />
                <text x="220" y="70" fill="#34D399" fontSize="11" fontFamily="JetBrains Mono">
                  Baseline Intact Ingress Corridor (2025 Survey)
                </text>
              </g>
            )}
          </svg>

          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
            Showing: {beforeAfterMode === 'after' ? 'Active 3D Post-Event Cloud' : 'Archived 2025 Datum'}
          </div>
        </div>
      </div>

      {/* Damage Zones Triage Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Registered Anomaly Zones</h3>
            <p className="text-slate-400 text-[11px]">Triage and update field response status</p>
          </div>

          {/* Priority filter buttons */}
          <div className="flex items-center gap-1">
            {['all', 'critical', 'high', 'medium'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                  filterPriority === p ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${priorityBadgeStyle[zone.priority]}`}>
                    {zone.priority}
                  </span>
                  <span className="font-bold text-white text-xs">{zone.zone}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 text-[11px]">{zone.damageLevel}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{zone.description}</p>
                <p className="font-mono text-[10px] text-cyan-400">
                  Coordinates: {zone.coordinates.lat}°N, {zone.coordinates.lng}°E · Access: {zone.accessStatus}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {(['Open', 'Investigating', 'Resolved'] as DamageZone['status'][]).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateDamageZoneStatus(zone.id, status)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      zone.status === status
                        ? status === 'Resolved'
                          ? 'bg-emerald-600 text-white'
                          : status === 'Investigating'
                          ? 'bg-amber-600 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
