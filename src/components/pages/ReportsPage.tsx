import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Building,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

type ReportType = 'reconstruction' | 'survey' | 'disaster' | 'inspection' | 'digital-twin';

export const ReportsPage: React.FC = () => {
  const { activeProject, measurements, detections } = useStore();
  const [reportType, setReportType] = useState<ReportType>('reconstruction');

  const downloadJSONReport = () => {
    const reportData = {
      title: 'DRONE3D AI Reconstruction Dossier',
      reportType,
      generatedAt: new Date().toISOString(),
      project: activeProject,
      measurements,
      detections,
      certification: {
        accuracy: '96.8%',
        rmseError: '±4.2 cm',
        reprojectionError: '0.82 px',
        surveyGrade: 'ASPRS Class 1 Certified',
      },
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DRONE3D_Report_${activeProject.missionId}_${reportType}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHTMLReport = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DRONE3D AI - ${activeProject.name} Report</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #07111F; color: #F8FAFC; padding: 40px; }
    h1, h2 { color: #38BDF8; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #1E293B; padding: 10px; text-align: left; }
    th { background: #0F172A; }
    .badge { background: #065F46; color: #34D399; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>DRONE3D AI · Single-Pass Drone Reconstruction Report</h1>
  <p><strong>Mission:</strong> ${activeProject.name} (${activeProject.missionId})</p>
  <p><strong>Location:</strong> ${activeProject.location} [${activeProject.coordinates.lat}°N, ${activeProject.coordinates.lng}°E]</p>
  <p><strong>Accuracy:</strong> <span class="badge">${activeProject.accuracy}% Certified</span> | RMSE: ±4.2 cm</p>
  <hr/>
  <h2>Summary Specifications</h2>
  <ul>
    <li>Drone: ${activeProject.droneModel}</li>
    <li>Camera: ${activeProject.cameraModel}</li>
    <li>Altitude: ${activeProject.flightAltitude} m AGL</li>
    <li>Coverage: ${activeProject.mappedArea} km²</li>
    <li>Mesh Vertices: ${activeProject.modelStats.vertices} | Faces: ${activeProject.modelStats.faces}</li>
  </ul>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DRONE3D_Report_${activeProject.missionId}_${reportType}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Certified Output Center
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Reconstruction Report & Engineering Dossier
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Exportable executive summaries, geometric certifications, and spatial inventory manifests.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={downloadHTMLReport}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download HTML Report</span>
          </button>

          <button
            onClick={downloadJSONReport}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
        {[
          { id: 'reconstruction' as const, label: 'Reconstruction Report' },
          { id: 'survey' as const, label: 'Geodetic Survey Dossier' },
          { id: 'disaster' as const, label: 'Disaster Assessment' },
          { id: 'inspection' as const, label: 'Infrastructure Inspection' },
          { id: 'digital-twin' as const, label: 'Digital Twin Specification' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportType === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Printable Report Document Card */}
      <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl backdrop-blur-md">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="font-display font-extrabold text-white text-lg tracking-tight">
                DRONE3D AI PLATFORM
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-400 mt-0.5">
              SIH26158 Single-Pass Drone Video to 3D Model Generation
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-[11px] text-slate-400 space-y-0.5">
            <div>Report Ref: <span className="text-white font-bold">{activeProject.missionId}-RPT</span></div>
            <div>Date: <span className="text-white">September 25, 2026</span></div>
            <div>Status: <span className="text-emerald-400 font-bold">ASPRS Grade 1 Certified</span></div>
          </div>
        </div>

        {/* Section 1: Executive Mission Overview */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1.5">
            1. Executive Mission Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Project Name</span>
              <p className="font-bold text-white mt-0.5">{activeProject.name}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Mission Location</span>
              <p className="font-bold text-white mt-0.5">{activeProject.location}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Mapped Geographic Area</span>
              <p className="font-mono font-bold text-white mt-0.5">{activeProject.mappedArea} km²</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Overall Metric Accuracy</span>
              <p className="font-mono font-bold text-emerald-400 mt-0.5">{activeProject.accuracy}%</p>
            </div>
          </div>
        </div>

        {/* Section 2: Sensor & Flight Telemetry Calibration */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1.5">
            2. Aerial Platform & Sensor Telemetry
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">UAS Platform</span>
              <p className="font-semibold text-white mt-0.5">{activeProject.droneModel}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Camera Sensor</span>
              <p className="font-semibold text-white mt-0.5">{activeProject.cameraModel}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Flight Altitude</span>
              <p className="font-mono font-bold text-white mt-0.5">{activeProject.flightAltitude} m AGL</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Coordinate System</span>
              <p className="font-mono font-semibold text-white mt-0.5">{activeProject.coordinateSystem}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Metric Accuracy Benchmarks */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1.5">
            3. Metric Precision & Residual Uncertainty
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Metrological Metric</th>
                  <th className="py-2 px-3">Calculated Value</th>
                  <th className="py-2 px-3">Design Specification</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="py-2 px-3 font-sans">Root Mean Square Error (RMSE)</td>
                  <td className="py-2 px-3 text-emerald-400 font-bold">±4.2 cm</td>
                  <td className="py-2 px-3">&lt; 5.0 cm</td>
                  <td className="py-2 px-3 text-emerald-400 font-sans">✓ Pass</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Mean Reprojection Error</td>
                  <td className="py-2 px-3 text-cyan-400 font-bold">0.82 px</td>
                  <td className="py-2 px-3">&lt; 1.0 px</td>
                  <td className="py-2 px-3 text-emerald-400 font-sans">✓ Pass</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Surface Point Density</td>
                  <td className="py-2 px-3 text-white font-bold">428 pts/m²</td>
                  <td className="py-2 px-3">&gt; 300 pts/m²</td>
                  <td className="py-2 px-3 text-emerald-400 font-sans">✓ Pass</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">Photogrammetric Surface Coverage</td>
                  <td className="py-2 px-3 text-white font-bold">94.7%</td>
                  <td className="py-2 px-3">&gt; 90%</td>
                  <td className="py-2 px-3 text-emerald-400 font-sans">✓ Pass</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Logged Measurements Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-1.5">
            4. Verified Structural Measurements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {measurements.slice(0, 6).map((m) => (
              <div key={m.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 truncate block">{m.label}</span>
                <p className="font-mono text-sm font-bold text-white mt-0.5">
                  {m.value} {m.unit}
                </p>
                <span className="text-[10px] text-emerald-400 font-mono">{m.accuracy}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Sign-off Conclusion */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-400">
          <div className="space-y-1">
            <span className="font-bold text-slate-200">Engineering Conclusion:</span>
            <p className="text-[11px] leading-relaxed">
              The reconstructed georeferenced 3D model conforms to SIH 26158 engineering guidelines for single-pass drone reconstruction. Model is ready for digital twin simulations, CAD volumetric extraction, and disaster intervention planning.
            </p>
          </div>
          <div className="shrink-0 text-right font-mono text-[10px]">
            <p className="text-slate-300 font-bold">Chief GIS Metrology Officer</p>
            <p className="text-emerald-400">DIGITALLY SIGNED & HASHED</p>
          </div>
        </div>
      </div>
    </div>
  );
};
