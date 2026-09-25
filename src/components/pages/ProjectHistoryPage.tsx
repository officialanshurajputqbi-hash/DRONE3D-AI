import React, { useState } from 'react';
import {
  Search,
  Filter,
  Copy,
  Trash2,
  Download,
  Box,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AppPageId } from '../layout/Sidebar';
import { Project } from '../../types';

interface ProjectHistoryPageProps {
  onOpenProject: (page: AppPageId) => void;
}

export const ProjectHistoryPage: React.FC<ProjectHistoryPageProps> = ({ onOpenProject }) => {
  const { projects, activeProject, setActiveProject, deleteProject, duplicateProject } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.missionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpen = (project: Project) => {
    setActiveProject(project.id);
    onOpenProject('viewer3d');
  };

  const handleShare = (project: Project) => {
    setShareFeedback(`Shareable link copied for ${project.name}`);
    setTimeout(() => setShareFeedback(null), 3000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Repository Management
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Project Archive & Historical Missions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search, duplicate, and export active and archived single-pass reconstruction jobs.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>Total Records:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-bold">{projects.length}</span>
        </div>
      </div>

      {shareFeedback && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{shareFeedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, location, or mission..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-900 p-1 rounded-lg border border-slate-800">
          {['all', 'completed', 'processing', 'urgent'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                filterStatus === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const isActive = p.id === activeProject.id;
          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900/90 border-blue-500/60 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                    {p.missionId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                      p.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : p.status === 'processing'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{p.name}</h3>
                <p className="text-slate-400 text-xs flex items-center gap-1.5 mb-3 line-clamp-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{p.location}</span>
                </p>

                {/* Metric pill row */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Accuracy</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">{p.accuracy}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Area</span>
                    <span className="font-mono text-xs font-bold text-white">{p.mappedArea} km²</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">File Size</span>
                    <span className="font-mono text-xs font-bold text-cyan-400">{p.modelStats.fileSize}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span>Drone:</span>
                    <span className="text-slate-200 font-medium">{p.droneModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Altitude:</span>
                    <span className="font-mono text-slate-300">{p.flightAltitude} m AGL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vertices:</span>
                    <span className="font-mono text-slate-300">{p.modelStats.vertices}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpen(p)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Open 3D</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateProject(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Duplicate Mission"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleShare(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Share Mission"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
