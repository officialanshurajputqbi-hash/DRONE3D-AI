import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Sparkles,
  ChevronDown,
  User,
  LogOut,
  FolderOpen,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { AppPageId } from './Sidebar';
import { useStore } from '../../store/useStore';

interface TopBarProps {
  onToggleSidebar: () => void;
  onNavigate: (page: AppPageId) => void;
  onOpenLiveDemo: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  onNavigate,
  onOpenLiveDemo,
}) => {
  const { user, activeProject, projects, setActiveProject, logoutUser } = useStore();
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 w-full bg-[#081220]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Zone 1: Mobile Hamburger & Active Project Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="max-w-[140px] sm:max-w-[200px] truncate">{activeProject.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showProjectDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl backdrop-blur-md p-1.5 z-50">
              <span className="block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select Project
              </span>
              <div className="max-h-60 overflow-y-auto space-y-0.5 mt-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProject(p.id);
                      setShowProjectDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      p.id === activeProject.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.missionId}</p>
                    </div>
                    {p.id === activeProject.id && <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Shortcuts */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-400">
        <button onClick={() => onNavigate('dashboard')} className="hover:text-slate-100 transition-colors">
          Dashboard
        </button>
        <button onClick={() => onNavigate('viewer3d')} className="hover:text-slate-100 transition-colors">
          3D View
        </button>
        <button onClick={() => onNavigate('gis')} className="hover:text-slate-100 transition-colors">
          GIS Map
        </button>
        <button onClick={() => onNavigate('pipeline')} className="hover:text-slate-100 transition-colors">
          Pipeline
        </button>
        <button onClick={() => onNavigate('analytics')} className="hover:text-slate-100 transition-colors">
          Analytics
        </button>
        <button onClick={() => onNavigate('reports')} className="hover:text-slate-100 transition-colors">
          Reports
        </button>
      </nav>

      {/* Zone 3: Live Demo Button, Telemetry Status, Notifications & User Avatar */}
      <div className="flex items-center gap-3">
        {/* SIH Live Demo Quick Launch */}
        <button
          onClick={onOpenLiveDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Grand Finale</span> Demo
        </button>

        {/* System Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>96.8% Accuracy</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-1.5 w-72 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-3 z-50 text-xs">
              <span className="font-bold text-slate-200 block mb-2">Notifications</span>
              <div className="space-y-2 text-slate-400">
                <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <p className="font-semibold text-slate-200">Reconstruction complete</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Jaipur Heritage Survey completed in 04:28 min.</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <p className="font-semibold text-slate-200">Disaster Zone Flagged</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">7 anomaly zones registered in rapid assessment.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              {user ? user.name.slice(0, 2).toUpperCase() : 'AR'}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-1.5 w-56 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-bold text-slate-100">{user?.name || 'Demo Specialist'}</p>
                <p className="text-[11px] text-slate-400">{user?.email || 'demo@drone3d.ai'}</p>
              </div>
              <button
                onClick={() => {
                  onNavigate('settings');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2 mt-1"
              >
                <User className="w-3.5 h-3.5" />
                Profile Settings
              </button>
              <button
                onClick={() => {
                  onNavigate('help');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Help & SIH Statement
              </button>
              <button
                onClick={() => {
                  logoutUser();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-slate-800 mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
