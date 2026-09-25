import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Box,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Building2,
  Mountain,
  Compass,
  FileCheck,
  Shield,
  Activity,
  Flame,
} from 'lucide-react';
import { AppPageId } from '../layout/Sidebar';

interface LandingPageProps {
  onStartProject: () => void;
  onExploreDemo: () => void;
  onGoToAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartProject,
  onExploreDemo,
  onGoToAuth,
}) => {
  const workflowSteps = [
    {
      step: '01',
      title: 'Drone Flight',
      desc: 'Single-pass 4K video + embedded GPS/IMU stream',
      icon: Compass,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    },
    {
      step: '02',
      title: 'Frame Extraction',
      desc: 'Adaptive motion blur filtering & keyframe selection',
      icon: Layers,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      step: '03',
      title: 'AI Processing',
      desc: 'Deep feature matching (SuperPoint/LightGlue) & sensor fusion',
      icon: Cpu,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      step: '04',
      title: 'Point Cloud',
      desc: 'Dense Multi-View Stereo & ASPRS semantic classification',
      icon: Activity,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      step: '05',
      title: '3D Digital Twin',
      desc: 'Georeferenced metric mesh with ±4.2 cm spatial precision',
      icon: Box,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    },
  ];

  const applications = [
    {
      title: 'Disaster Damage Assessment',
      desc: 'Instant rapid assessment of collapsed masonry, landslide slope failure, and road blockages during first-response missions.',
      icon: Flame,
    },
    {
      title: 'Border & Strategic Area Mapping',
      desc: 'Single-pass high-altitude surveillance rendering metrically accurate elevation terrain models without exposing operators.',
      icon: Mountain,
    },
    {
      title: 'Urban Planning & Municipalities',
      desc: 'High-density spatial models with automated building height, floor area, and road network vector extraction.',
      icon: Building2,
    },
    {
      title: 'Infrastructure Inspection',
      desc: 'Sub-centimeter structural anomaly detection for bridge abutments, piers, and overhead electrical transmission grids.',
      icon: Shield,
    },
    {
      title: 'Construction Progress Monitoring',
      desc: 'Earthwork volume calculation, elevation cut-and-fill analysis, and structural schedule compliance verification.',
      icon: FileCheck,
    },
    {
      title: 'Archaeological Documentation',
      desc: 'Non-invasive photogrammetric preservation of ancient monuments with millimeter-grade volumetric fidelity.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#07111F]/80 backdrop-blur-md sticky top-0 z-50 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            3D
          </div>
          <div>
            <span className="font-display font-bold tracking-tight text-slate-100 text-sm">
              DRONE3D AI
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono text-cyan-400">
              SIH 2024 · SIH26158
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreDemo}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            Live Demo
          </button>
          <button
            onClick={onGoToAuth}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
          >
            Launch Command Center
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 sm:px-12 overflow-hidden flex flex-col items-center text-center">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart India Hackathon Grand Finale · Problem ID: SIH26158</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-balance leading-[1.1]">
          From One Drone Flight to a{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Complete 3D World
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl text-balance leading-relaxed">
          AI-powered single-pass drone reconstruction for accurate 3D mapping, infrastructure inspection, disaster response and digital twins.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartProject}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 active:scale-95"
          >
            <span>Start New Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreDemo}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <span>Explore Demo (Jaipur Heritage)</span>
          </button>
        </div>

        {/* Metric Highlight Chips */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>96.8% Average Metric Precision</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>74% Less Processing Time</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Zero Ground Control Points Required</span>
          </div>
        </div>

        {/* Animated 5-Step Workflow Pipeline Visualizer */}
        <div className="mt-16 w-full max-w-5xl p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800 text-left">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                End-To-End Architecture
              </span>
              <h3 className="text-base font-bold text-white">
                Single-Pass Data Transformation Pipeline
              </h3>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 font-mono text-xs border border-blue-500/20">
              Automated Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {workflowSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-left relative flex flex-col justify-between group hover:border-blue-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono text-slate-500">STAGE {item.step}</span>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${item.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  {idx < 4 && (
                    <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-xs z-10">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem vs Our Solution Section */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Problem */}
          <div className="p-8 rounded-2xl bg-red-950/10 border border-red-900/30">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              Traditional Photogrammetry Bottlenecks
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Complex, Expensive & Time-Consuming
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Multiple Overlapping Drone Passes:</strong> Requires tedious cross-grid missions with 75–85% overlap, draining drone batteries in emergency response.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Ground Control Points (GCPs):</strong> Mandatory physical ground markers that are impossible to place in hazardous, flooded, or contested strategic terrain.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Heavy Computational Delay:</strong> Structure-from-Motion often takes 12–24 hours on specialized clusters, missing critical disaster rescue windows.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Dynamic Object Distortion:</strong> Moving vehicles and pedestrians create ghosting artifacts and ruined surface geometries.</span>
              </li>
            </ul>
          </div>

          {/* Our AI Solution */}
          <div className="p-8 rounded-2xl bg-blue-950/15 border border-blue-500/30 relative">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              DRONE3D AI Innovation (SIH26158)
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Single-Pass Video to Metric 3D Digital Twin
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Continuous Single Video Flight:</strong> Reconstructs a complete 3D scene from just one linear drone flight pass (1080p/4K).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Multi-Sensor Fusion Engine:</strong> Fuses visual odometry with flight telemetry (GPS, IMU, Barometer, and RTK corrections) for absolute scale.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Real-Time Semantic Understanding:</strong> Identifies and filters dynamic cars/people while classifying buildings, roads, and vegetation.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Rapid Results in Minutes:</strong> Generates clean, georeferenced textured meshes and digital twins within 4–8 minutes.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Applications Grid aligned with SIH Brief */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Real-World Impact
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mt-1">
            Engineered for High-Stakes Deployments
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            Tailored to meet the operational mandates of disaster relief authorities, defense surveillance, and municipal engineering corps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {applications.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.title}
                className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{app.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{app.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 sm:px-12 text-center bg-slate-950/60 border-t border-slate-800">
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Experience the Grand Finale Demonstration
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2">
          Inspect the full Jaipur Heritage Survey project with 3D viewport, point cloud lidar mode, and metric measurements.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onExploreDemo}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md"
          >
            Launch Live Demo
          </button>
          <button
            onClick={onGoToAuth}
            className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            Sign In with Demo Credentials
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 sm:px-12 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
        DRONE3D AI · Smart India Hackathon 2024 · Problem Statement ID: SIH26158
      </footer>
    </div>
  );
};
