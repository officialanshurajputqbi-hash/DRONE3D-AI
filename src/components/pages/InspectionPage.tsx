import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCheck2,
  Sparkles,
  Building,
  Shield,
  FileText,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { InspectionRecord, PriorityLevel } from '../../types';

interface InspectionPageProps {
  onGenerateReport: () => void;
}

export const InspectionPage: React.FC<InspectionPageProps> = ({ onGenerateReport }) => {
  const { inspections, updateInspectionStatus } = useStore();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filtered = inspections.filter(
    (item) => filterSeverity === 'all' || item.severity === filterSeverity
  );

  const severityBadge: Record<PriorityLevel, string> = {
    critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
    high: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    medium: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Structural Metrology
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Infrastructure & Asset Inspection
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            High-resolution photogrammetric crack detection, masonry spalling, and foundation settlement logging.
          </p>
        </div>

        <button
          onClick={onGenerateReport}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Create Inspection Dossier</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-red-400 uppercase font-semibold">Cracks Detected</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">12 Anomaly Lines</p>
          <span className="text-[10px] text-slate-400">Deep neural edge detection</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-amber-400 uppercase font-semibold">Surface Spalling</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">08 Zones</p>
          <span className="text-[10px] text-slate-400">Masonry & plaster degradation</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-blue-400 uppercase font-semibold">Roof & Parapet Damage</span>
          <p className="font-mono text-xl font-bold text-white mt-0.5">05 Sections</p>
          <span className="text-[10px] text-slate-400">Copeland & coping shift</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold">Verified Intact</span>
          <p className="font-mono text-xl font-bold text-emerald-400 mt-0.5">34 Structures</p>
          <span className="text-[10px] text-slate-400">Structural integrity confirmed</span>
        </div>
      </div>

      {/* Inspection Register Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Registered Defect Observations</h3>
            <p className="text-slate-400 text-[11px]">Review structural anomalies and update resolution status</p>
          </div>

          <div className="flex items-center gap-1">
            {['all', 'critical', 'high', 'medium', 'low'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                  filterSeverity === s
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Inspection ID</th>
                <th className="py-2.5 px-3">Target Object & Location</th>
                <th className="py-2.5 px-3">Identified Defect</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Dimensions</th>
                <th className="py-2.5 px-3">AI Confidence</th>
                <th className="py-2.5 px-3 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">{item.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-white">{item.objectName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.locationDetails}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs">{item.issue}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${severityBadge[item.severity]}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">{item.dimensions}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{item.confidence}%</td>
                  <td className="py-3 px-3 text-right space-x-1.5">
                    {(['Open', 'Review', 'Resolved'] as InspectionRecord['status'][]).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateInspectionStatus(item.id, status)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                          item.status === status
                            ? status === 'Resolved'
                              ? 'bg-emerald-600 text-white'
                              : status === 'Review'
                              ? 'bg-amber-600 text-white'
                              : 'bg-red-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
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
