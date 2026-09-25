import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  UploadCloud,
  Navigation2,
  Cpu,
  Box,
  CloudSun,
  Map,
  BrainCircuit,
  Ruler,
  ShieldCheck,
  AlertTriangle,
  Search,
  Orbit,
  BarChart3,
  FileText,
  Download,
  History,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';

export type AppPageId =
  | 'dashboard'
  | 'projects'
  | 'new-project'
  | 'upload-video'
  | 'upload-flight'
  | 'pipeline'
  | 'viewer3d'
  | 'pointcloud'
  | 'gis'
  | 'ai-analysis'
  | 'measurements'
  | 'quality'
  | 'disaster'
  | 'inspection'
  | 'digital-twin'
  | 'analytics'
  | 'reports'
  | 'export'
  | 'history'
  | 'settings'
  | 'help';

interface SidebarProps {
  currentPage: AppPageId;
  onNavigate: (page: AppPageId) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: AppPageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const navSections: NavSection[] = [
    {
      title: 'COMMAND',
      items: [
        { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'projects' as const, label: 'Projects', icon: FolderKanban, badge: '12' },
        { id: 'new-project' as const, label: 'New Reconstruction', icon: PlusCircle },
      ],
    },
    {
      title: 'DATA & PROCESSING',
      items: [
        { id: 'upload-video' as const, label: 'Video Upload', icon: UploadCloud },
        { id: 'upload-flight' as const, label: 'Flight Telemetry', icon: Navigation2 },
        { id: 'pipeline' as const, label: 'AI Processing', icon: Cpu, badge: 'Active', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
      ],
    },
    {
      title: '3D & SPATIAL',
      items: [
        { id: 'viewer3d' as const, label: '3D Reconstruction', icon: Box },
        { id: 'pointcloud' as const, label: 'Point Cloud Viewer', icon: CloudSun },
        { id: 'gis' as const, label: 'GIS Mapping', icon: Map },
        { id: 'digital-twin' as const, label: 'Digital Twin', icon: Orbit },
      ],
    },
    {
      title: 'ANALYTICS & METRICS',
      items: [
        { id: 'ai-analysis' as const, label: 'AI Scene Analysis', icon: BrainCircuit },
        { id: 'measurements' as const, label: 'Measurement Tools', icon: Ruler },
        { id: 'quality' as const, label: 'Quality & Accuracy', icon: ShieldCheck },
        { id: 'analytics' as const, label: 'Analytics Studio', icon: BarChart3 },
      ],
    },
    {
      title: 'SPECIALIZED MODES',
      items: [
        { id: 'disaster' as const, label: 'Disaster Rapid Assessment', icon: AlertTriangle, badge: 'Urgent', badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30' },
        { id: 'inspection' as const, label: 'Infrastructure Inspection', icon: Search },
      ],
    },
    {
      title: 'OUTPUT & SYSTEM',
      items: [
        { id: 'reports' as const, label: 'Reports & Dossier', icon: FileText },
        { id: 'export' as const, label: 'Export Center', icon: Download },
        { id: 'history' as const, label: 'Project History', icon: History },
        { id: 'settings' as const, label: 'Settings', icon: Settings },
        { id: 'help' as const, label: 'Help & SIH Brief', icon: HelpCircle },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#081220] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
              3D
            </div>
            <div>
              <span className="font-display font-bold tracking-tight text-slate-100 text-sm">
                DRONE3D AI
              </span>
              <span className="block text-[10px] font-mono text-cyan-400 tracking-wider">
                SIH26158 PLATFORM
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <h4 className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </h4>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        if (window.innerWidth < 768) onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 ${
                            item.badgeColor || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Status Ticker */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Core Ready</span>
            </span>
            <span className="text-slate-500">v2.6.4</span>
          </div>
        </div>
      </aside>
    </>
  );
};
