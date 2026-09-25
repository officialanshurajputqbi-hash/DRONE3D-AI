import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Shield,
  Key,
  Database,
  CheckCircle2,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const SettingsPage: React.FC = () => {
  const { user, resetToDefaultDemo } = useStore();

  const [gpuAcceleration, setGpuAcceleration] = useState(true);
  const [autoStartProcessing, setAutoStartProcessing] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState('High (Balanced Accuracy)');
  const [defaultCRS, setDefaultCRS] = useState('WGS 84 / UTM Zone 43N');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [apiKeyActive, setApiKeyActive] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            System Preferences
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Platform Settings & Metrology Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure default georeference datums, GPU compute acceleration, and hardware telemetry parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={resetToDefaultDemo}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to SIH Grand Finale Default Demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {savedFeedback && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>System configurations saved successfully.</span>
        </div>
      )}

      {/* Operator Profile */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
          Operator & Team Profile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Operator Name</label>
            <input
              type="text"
              readOnly
              value={user?.name || 'Demo Specialist'}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Registered Email</label>
            <input
              type="email"
              readOnly
              value={user?.email || 'demo@drone3d.ai'}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Reconstruction Compute Defaults */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
          Reconstruction Compute Engine
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Default Processing Quality</label>
            <select
              value={defaultQuality}
              onChange={(e) => setDefaultQuality(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option>Ultra (Highest Precision · Sub-Centimeter)</option>
              <option>High (Balanced Accuracy · Recommended)</option>
              <option>Medium (Rapid Rapid Assessment · 2 min)</option>
              <option>Low Preview (Real-Time Ingest)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Default CRS Projector</label>
            <select
              value={defaultCRS}
              onChange={(e) => setDefaultCRS(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option>WGS 84 / UTM Zone 43N</option>
              <option>WGS 84 / UTM Zone 44N</option>
              <option>EPSG:4326 (Geographic Lat/Long)</option>
              <option>EPSG:3857 (Web Mercator)</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Hardware GPU Acceleration (WebGL & PyTorch CUDA)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Enables WebGL 2.0 multi-draw and hardware rasterization for dense point clouds.</p>
            </div>
            <input
              type="checkbox"
              checked={gpuAcceleration}
              onChange={(e) => setGpuAcceleration(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 ml-3"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Auto-Start Reconstruction Pipeline</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Automatically triggers feature matching after video ingestion completes.</p>
            </div>
            <input
              type="checkbox"
              checked={autoStartProcessing}
              onChange={(e) => setAutoStartProcessing(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 ml-3"
            />
          </label>
        </div>
      </div>

      {/* Security & API Keys */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
          Security & Developer API Access
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="font-semibold text-white">REST API Access Key</p>
              <p className="text-[11px] font-mono text-cyan-400 mt-0.5">
                dr3d_live_pk_8892f3a1c90e2b449102c9
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
              Active
            </span>
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Enforce hardware token or TOTP authenticator for field mission uploads.</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 ml-3"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
