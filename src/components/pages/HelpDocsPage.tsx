import React from 'react';
import {
  HelpCircle,
  BookOpen,
  Keyboard,
  Compass,
  Cpu,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const HelpDocsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 text-xs">
      <div className="pb-4 border-b border-slate-800">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
          Documentation & Reference
        </span>
        <h1 className="font-display text-2xl font-bold text-white mt-1">
          Smart India Hackathon 2024 · Problem Statement SIH26158
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete system architecture, mathematical principles, and operator guide for single-pass drone reconstruction.
        </p>
      </div>

      {/* SIH Statement Card */}
      <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
          <BookOpen className="w-4 h-4" />
          <span>Official Problem Statement ID: SIH26158</span>
        </div>
        <h3 className="text-base font-bold text-white">
          Single-Pass Drone Video to Accurate 3D Model Generation System
        </h3>
        <p className="text-slate-300 leading-relaxed text-xs">
          <strong>Category:</strong> Software · <strong>Technology Bucket:</strong> Robotics and Drones.<br />
          <strong>Core Objective:</strong> Convert a single-pass aerial drone video (with embedded GPS and flight metadata) into a georeferenced, metrically accurate 3D digital representation of the captured environment. Conventional methods demand multiple cross-grid passes, high 80% overlap, and physical Ground Control Points. DRONE3D AI eliminates these dependencies through visual odometry, deep feature matching, and Extended Kalman Filter sensor fusion.
        </p>
      </div>

      {/* Mathematical Principles */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Multi-Sensor Fusion Architecture</span>
        </h3>
        <p className="text-slate-400 leading-relaxed">
          The core innovation relies on a 4-layer sensor fusion stack:
        </p>
        <ul className="space-y-2 text-slate-300 pl-4 list-disc">
          <li>
            <strong>Visual Odometry Layer:</strong> Continuous 5-point epipolar geometry solves relative camera displacement (rotation R, translation t) between sequential video frames.
          </li>
          <li>
            <strong>Extended Kalman Filter (EKF):</strong> Fuses relative visual pose with absolute GNSS position, IMU angular velocity, and barometric pressure altitude.
          </li>
          <li>
            <strong>Multi-View Stereo (MVS):</strong> Patch-match depth estimation reconstructs dense surface point clouds without requiring manual tie-point calibration.
          </li>
          <li>
            <strong>Dynamic Object Filter:</strong> Spatio-temporal motion segmentation detects and removes transient vehicles, humans, and wildlife to eliminate mesh ghosting.
          </li>
        </ul>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-cyan-400" />
          <span>3D Viewport Keyboard Shortcuts</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-300">Rotate View</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px] border border-slate-700">Left Click + Drag</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-300">Pan View</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px] border border-slate-700">Right Click or Shift + Drag</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-300">Zoom In / Out</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px] border border-slate-700">Scroll Wheel</kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-300">Reset Camera</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[11px] border border-slate-700">R</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
