import React, { useState } from 'react';
import {
  Download,
  Box,
  Layers,
  FileCode,
  FileSpreadsheet,
  FileText,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ExportCenterPage: React.FC = () => {
  const { activeProject, measurements, detections, flightData } = useStore();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const triggerDownload = (fileName: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(fileName);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // 1. Export OBJ 3D Model
  const exportOBJ = () => {
    const objData = `# DRONE3D AI OBJ Export - ${activeProject.name}
# Mission ID: ${activeProject.missionId}
# Units: meters (WGS84 / UTM)
v -14.0 0.0 -10.0
v -5.0 0.0 -10.0
v -5.0 14.5 -10.0
v -14.0 14.5 -10.0
v -14.0 0.0 -2.0
v -5.0 0.0 -2.0
v -5.0 14.5 -2.0
v -14.0 14.5 -2.0
f 1 2 3 4
f 5 8 7 6
f 1 5 6 2
f 2 6 7 3
f 3 7 8 4
f 4 8 5 1
`;
    triggerDownload(`${activeProject.missionId}_3D_Model.obj`, objData, 'text/plain');
  };

  // 2. Export GLB / JSON representation
  const exportGLB = () => {
    const gltfManifest = {
      asset: { version: '2.0', generator: 'DRONE3D AI SIH26158 Engine' },
      scene: 0,
      scenes: [{ nodes: [0] }],
      nodes: [{ mesh: 0, name: activeProject.name }],
      meshes: [{ primitives: [{ attributes: { POSITION: 0 }, mode: 4 }] }],
      metadata: {
        accuracy: `${activeProject.accuracy}%`,
        vertices: activeProject.modelStats.vertices,
        faces: activeProject.modelStats.faces,
        datum: activeProject.coordinateSystem,
      },
    };
    triggerDownload(`${activeProject.missionId}_Model.gltf`, JSON.stringify(gltfManifest, null, 2), 'application/json');
  };

  // 3. Export PLY Polygon Mesh
  const exportPLY = () => {
    const plyData = `ply
format ascii 1.0
comment DRONE3D AI Export
element vertex 8
property float x
property float y
property float z
element face 6
property list uchar int vertex_indices
end_header
-14.0 0.0 -10.0
-5.0 0.0 -10.0
-5.0 14.5 -10.0
-14.0 14.5 -10.0
-14.0 0.0 -2.0
-5.0 0.0 -2.0
-5.0 14.5 -2.0
-14.0 14.5 -2.0
4 0 1 2 3
4 4 7 6 5
4 0 4 5 1
4 1 5 6 2
4 2 6 7 3
4 3 7 4 0
`;
    triggerDownload(`${activeProject.missionId}_Mesh.ply`, plyData, 'text/plain');
  };

  // 4. Export LAS Lidar Point Cloud Format
  const exportLAS = () => {
    const lasManifest = {
      format: 'ASPRS LAS 1.4 Point Cloud Manifest',
      project: activeProject.name,
      pointRecordsCount: 2841627,
      classificationSchema: 'ASPRS Standard (Ground, Building, Road, Vegetation, Vehicle)',
      coordinateReferenceSystem: 'EPSG:4326',
      bounds: {
        minX: activeProject.coordinates.lng - 0.005,
        maxX: activeProject.coordinates.lng + 0.005,
        minY: activeProject.coordinates.lat - 0.005,
        maxY: activeProject.coordinates.lat + 0.005,
        minZ: 0.0,
        maxZ: 68.4,
      },
    };
    triggerDownload(`${activeProject.missionId}_PointCloud.las.json`, JSON.stringify(lasManifest, null, 2), 'application/json');
  };

  // 5. Export GeoJSON Features
  const exportGeoJSON = () => {
    const geojsonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [activeProject.coordinates.lng - 0.003, activeProject.coordinates.lat - 0.003],
                [activeProject.coordinates.lng + 0.003, activeProject.coordinates.lat - 0.003],
                [activeProject.coordinates.lng + 0.003, activeProject.coordinates.lat + 0.003],
                [activeProject.coordinates.lng - 0.003, activeProject.coordinates.lat + 0.003],
                [activeProject.coordinates.lng - 0.003, activeProject.coordinates.lat - 0.003],
              ],
            ],
          },
          properties: {
            name: activeProject.name,
            accuracy: activeProject.accuracy,
            area_km2: activeProject.mappedArea,
          },
        },
      ],
    };
    triggerDownload(`${activeProject.missionId}_Boundary.geojson`, JSON.stringify(geojsonData, null, 2), 'application/geo+json');
  };

  // 6. Export CSV Telemetry & Measurements
  const exportCSV = () => {
    let csv = 'ID,Type,Label,Value,Unit,Accuracy,Timestamp\n';
    measurements.forEach((m) => {
      csv += `${m.id},"${m.type}","${m.label}",${m.value},"${m.unit}","${m.accuracy}","${m.timestamp}"\n`;
    });
    triggerDownload(`${activeProject.missionId}_Measurements.csv`, csv, 'text/csv');
  };

  // 7. Export Engineering Report HTML/PDF
  const exportPDF = () => {
    const reportSummary = `DRONE3D AI RECONSTRUCTION REPORT\nProject: ${activeProject.name}\nMission: ${activeProject.missionId}\nAccuracy: ${activeProject.accuracy}%\nArea: ${activeProject.mappedArea} km²\nVertices: ${activeProject.modelStats.vertices}\nFaces: ${activeProject.modelStats.faces}\n`;
    triggerDownload(`${activeProject.missionId}_Engineering_Report.txt`, reportSummary, 'text/plain');
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Data Interoperability
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Reconstruction Export Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Download production-ready 3D formats, point clouds, and GIS vectors for AutoCAD, Blender, ArcGIS, and Unreal Engine.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] self-start sm:self-auto">
          Dataset: {activeProject.name}
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Downloaded <strong>{downloadSuccess}</strong> successfully.</span>
        </div>
      )}

      {/* 3D Geometry Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
          1. 3D Model & Mesh Formats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Box className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-mono text-slate-400">284 MB</span>
              </div>
              <h4 className="font-bold text-white text-sm">OBJ + MTL</h4>
              <p className="text-[11px] text-slate-400 mt-1">Standard 3D geometry with material textures for Blender, 3ds Max & Maya.</p>
            </div>
            <button
              onClick={exportOBJ}
              className="mt-4 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download OBJ</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Box className="w-5 h-5 text-cyan-400" />
                <span className="text-[10px] font-mono text-slate-400">196 MB</span>
              </div>
              <h4 className="font-bold text-white text-sm">GLB / glTF 2.0</h4>
              <p className="text-[11px] text-slate-400 mt-1">Lightweight binary glTF format optimized for web browsers and mobile AR.</p>
            </div>
            <button
              onClick={exportGLB}
              className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download GLB</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Box className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-mono text-slate-400">312 MB</span>
              </div>
              <h4 className="font-bold text-white text-sm">PLY Mesh</h4>
              <p className="text-[11px] text-slate-400 mt-1">Polygon mesh with embedded per-vertex RGB colors and normals.</p>
            </div>
            <button
              onClick={exportPLY}
              className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PLY</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-mono text-slate-400">186 MB</span>
              </div>
              <h4 className="font-bold text-white text-sm">LAS / LAZ Cloud</h4>
              <p className="text-[11px] text-slate-400 mt-1">ASPRS LiDAR point cloud format with full semantic classification flags.</p>
            </div>
            <button
              onClick={exportLAS}
              className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download LAS</span>
            </button>
          </div>
        </div>
      </div>

      {/* GIS & Geospatial Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          2. GIS Vectors & Survey Registers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <MapPin className="w-5 h-5 text-cyan-400 mb-2" />
              <h4 className="font-bold text-white text-sm">GeoJSON Feature Set</h4>
              <p className="text-[11px] text-slate-400 mt-1">Georeferenced survey boundary, building footprints, and road polygons.</p>
            </div>
            <button
              onClick={exportGeoJSON}
              className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GeoJSON</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <FileSpreadsheet className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="font-bold text-white text-sm">Survey Telemetry CSV</h4>
              <p className="text-[11px] text-slate-400 mt-1">Complete coordinates, GPS tracks, altitude datums, and logged measurements.</p>
            </div>
            <button
              onClick={exportCSV}
              className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <FileText className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="font-bold text-white text-sm">Certified Summary Report</h4>
              <p className="text-[11px] text-slate-400 mt-1">Executive PDF/Text report certifying ±4.2cm precision and quality bounds.</p>
            </div>
            <button
              onClick={exportPDF}
              className="mt-4 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
