import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layers,
  MapPin,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Eye,
  Info,
  Maximize2,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

type MapLayer = 'satellite' | 'street' | 'terrain';

interface POIMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  elevation: number;
  category: string;
  color: string;
}

export const GISMap: React.FC = () => {
  const { activeProject } = useStore();

  const [activeLayer, setActiveLayer] = useState<MapLayer>('satellite');
  const [showFlightPath, setShowFlightPath] = useState(true);
  const [showBoundary, setShowBoundary] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [showPOIs, setShowPOIs] = useState(true);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const [cursorGeo, setCursorGeo] = useState<{
    lat: number;
    lng: number;
    elev: number;
    utm: string;
  }>({
    lat: activeProject.coordinates.lat,
    lng: activeProject.coordinates.lng,
    elev: 432.5,
    utm: '43N 578210 2977450',
  });

  const [selectedPOI, setSelectedPOI] = useState<POIMarker | null>(null);

  const centerLat = activeProject.coordinates.lat;
  const centerLng = activeProject.coordinates.lng;

  const markers: POIMarker[] = [
    {
      id: 'poi-1',
      name: 'Main Heritage Pavilion (B-101)',
      lat: centerLat + 0.0004,
      lng: centerLng + 0.0004,
      elevation: 432.8,
      category: 'Monument',
      color: '#3B82F6',
    },
    {
      id: 'poi-2',
      name: 'North Bastion Wall & Buttress',
      lat: centerLat + 0.0011,
      lng: centerLng + 0.0012,
      elevation: 446.2,
      category: 'Fortification',
      color: '#EF4444',
    },
    {
      id: 'poi-3',
      name: 'Eastern Watchtower B-103',
      lat: centerLat + 0.0014,
      lng: centerLng + 0.0009,
      elevation: 454.0,
      category: 'Structure',
      color: '#06B6D4',
    },
    {
      id: 'poi-4',
      name: 'Survey Datum Reference Marker GCP-01',
      lat: centerLat - 0.0008,
      lng: centerLng - 0.0006,
      elevation: 428.1,
      category: 'RTK Datum',
      color: '#10B981',
    },
  ];

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2 - pan.x) / zoom;
    const relY = (e.clientY - rect.top - rect.height / 2 - pan.y) / zoom;

    const latDelta = -relY * 0.000008;
    const lngDelta = relX * 0.000008;

    const currentLat = Number((centerLat + latDelta).toFixed(6));
    const currentLng = Number((centerLng + lngDelta).toFixed(6));
    const currentElev = Number((430 + Math.sin(relX * 0.02) * Math.cos(relY * 0.02) * 12).toFixed(1));

    setCursorGeo({
      lat: currentLat,
      lng: currentLng,
      elev: currentElev,
      utm: `43N ${(578200 + relX * 2).toFixed(0)} ${(2977400 - relY * 2).toFixed(0)}`,
    });

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((z) => Math.max(0.6, Math.min(4.5, z * factor)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedPOI(null);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-[#07111F] overflow-hidden select-none">
      {/* 1. MAP VIEWPORT CANVAS */}
      <div
        className="relative flex-1 h-full cursor-crosshair overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Render Layer Background */}
        <div
          className="absolute inset-0 transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Base Map Graphic */}
          <svg className="w-full h-full min-w-[1200px] min-h-[900px]" viewBox="0 0 1200 900">
            <defs>
              <pattern id="gis-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(37,99,235,0.08)" strokeWidth="1" />
              </pattern>
              <pattern id="street-texture" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="#0B1728" />
                <path d="M 0 20 L 40 20 M 20 0 L 20 40" stroke="#1E293B" strokeWidth="3" />
              </pattern>
              <linearGradient id="terrain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B1A30" />
                <stop offset="50%" stopColor="#0F2442" />
                <stop offset="100%" stopColor="#081426" />
              </linearGradient>
            </defs>

            {/* Base Layer Shading */}
            {activeLayer === 'satellite' && (
              <rect width="100%" height="100%" fill="url(#terrain-grad)" />
            )}
            {activeLayer === 'street' && (
              <rect width="100%" height="100%" fill="url(#street-texture)" />
            )}
            {activeLayer === 'terrain' && (
              <rect width="100%" height="100%" fill="#071322" />
            )}

            {/* Grid Overlay */}
            <rect width="100%" height="100%" fill="url(#gis-grid)" />

            {/* Elevation Contours */}
            {showContours && (
              <g opacity="0.35" stroke="#06B6D4" strokeWidth="1" fill="none" strokeDasharray="3 3">
                <ellipse cx="600" cy="450" rx="380" ry="240" />
                <ellipse cx="600" cy="450" rx="320" ry="200" />
                <ellipse cx="600" cy="450" rx="260" ry="160" />
                <ellipse cx="600" cy="450" rx="190" ry="120" />
                <ellipse cx="600" cy="450" rx="120" ry="80" />
              </g>
            )}

            {/* Reconstruction Survey Boundary Polygon */}
            {showBoundary && (
              <g>
                <polygon
                  points="320,240 880,210 940,680 340,710"
                  fill="rgba(16,185,129,0.06)"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <text x="330" y="235" fill="#10B981" fontSize="12" fontFamily="JetBrains Mono" fontWeight="600">
                  SURVEY BOUNDARY: 2.84 km²
                </text>
              </g>
            )}

            {/* Simulated Roads & Built Footprints */}
            <g>
              {/* Main Arterial Highway */}
              <line x1="200" y1="450" x2="1000" y2="450" stroke="#1E293B" strokeWidth="18" />
              <line x1="200" y1="450" x2="1000" y2="450" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8 6" />

              <line x1="600" y1="150" x2="600" y2="750" stroke="#1E293B" strokeWidth="14" />
              <line x1="600" y1="150" x2="600" y2="750" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 6" />

              {/* Building Footprint Polygons */}
              <rect x="420" y="340" width="110" height="90" fill="rgba(37,99,235,0.4)" stroke="#3B82F6" strokeWidth="2" rx="4" />
              <text x="435" y="390" fill="#93C5FD" fontSize="11" fontWeight="bold">B-101</text>

              <rect x="430" y="490" width="95" height="85" fill="rgba(37,99,235,0.3)" stroke="#3B82F6" strokeWidth="2" rx="4" />
              <text x="445" y="535" fill="#93C5FD" fontSize="11" fontWeight="bold">B-102</text>

              <rect x="670" y="320" width="80" height="80" fill="rgba(37,99,235,0.3)" stroke="#3B82F6" strokeWidth="2" rx="4" />
              <text x="685" y="365" fill="#93C5FD" fontSize="11" fontWeight="bold">B-103</text>

              <rect x="680" y="480" width="120" height="100" fill="rgba(37,99,235,0.4)" stroke="#3B82F6" strokeWidth="2" rx="4" />
              <text x="705" y="535" fill="#93C5FD" fontSize="11" fontWeight="bold">B-104</text>
            </g>

            {/* Drone Single-Pass Flight Trajectory */}
            {showFlightPath && (
              <g>
                <path
                  d="M 340 280 L 860 280 L 860 360 L 340 360 L 340 440 L 860 440 L 860 520 L 340 520 L 340 600 L 860 600"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                />
                {/* Waypoints */}
                {[
                  [340, 280], [860, 280], [860, 360], [340, 360],
                  [340, 440], [860, 440], [860, 520], [340, 520],
                  [340, 600], [860, 600],
                ].map(([wx, wy], idx) => (
                  <circle key={idx} cx={wx} cy={wy} r="4" fill="#38BDF8" stroke="#0C4A6E" strokeWidth="1.5" />
                ))}

                {/* Drone Icon Indicator at midpoint */}
                <g transform="translate(600, 440)">
                  <circle cx="0" cy="0" r="14" fill="rgba(6,182,212,0.25)" className="animate-ping" />
                  <circle cx="0" cy="0" r="8" fill="#06B6D4" />
                  <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke="#FFFFFF" strokeWidth="2" />
                </g>
              </g>
            )}

            {/* POI Markers */}
            {showPOIs && (
              <g>
                {markers.map((m, idx) => {
                  const mx = 600 + (m.lng - centerLng) * 180000;
                  const my = 450 - (m.lat - centerLat) * 180000;

                  return (
                    <g
                      key={m.id}
                      transform={`translate(${mx}, ${my})`}
                      className="cursor-pointer"
                      onClick={() => setSelectedPOI(m)}
                    >
                      <circle cx="0" cy="0" r="10" fill={m.color} fillOpacity="0.3" />
                      <circle cx="0" cy="0" r="5" fill={m.color} stroke="#FFFFFF" strokeWidth="1.5" />
                      <text
                        x="10"
                        y="4"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="600"
                        filter="drop-shadow(0px 1px 3px rgba(0,0,0,0.8))"
                      >
                        {m.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* HUD Top Bar - Geospatial Status */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
          <div className="pointer-events-auto px-3.5 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60 flex items-center gap-2.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-white">GIS Map View</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-cyan-400">Jaipur Heritage Survey (UTM 43N)</span>
          </div>
        </div>

        {/* HUD Top Right - Layer Switcher */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60">
          {(['satellite', 'street', 'terrain'] as MapLayer[]).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1 text-xs font-semibold rounded capitalize transition-all ${
                activeLayer === layer
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* HUD Bottom Left - Real-time Cursor Coordinates */}
        <div className="absolute bottom-4 left-4 z-10 px-3.5 py-2 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/60 font-mono text-[11px] text-slate-300 space-y-0.5">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold">LAT: {cursorGeo.lat}° N</span>
            <span className="text-cyan-400 font-bold">LNG: {cursorGeo.lng}° E</span>
            <span className="text-emerald-400 font-bold">ALT: {cursorGeo.elev} m MSL</span>
          </div>
          <div className="text-slate-400 text-[10px]">
            UTM: {cursorGeo.utm} · WGS84 Reference Ellipsoid
          </div>
        </div>

        {/* Floating Zoom & Reset Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(4.5, z * 1.25))}
            className="w-9 h-9 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 flex items-center justify-center transition-colors shadow-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z / 1.25))}
            className="w-9 h-9 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 flex items-center justify-center transition-colors shadow-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="w-9 h-9 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 flex items-center justify-center transition-colors shadow-lg"
            title="Reset Center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. GIS SIDEBAR CONTROLS & POI DETAILS */}
      <div className="w-full md:w-80 bg-slate-900/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            GIS Layer Management
          </h3>
          <p className="text-sm font-bold text-white mt-0.5">Spatial Data Overlays</p>
        </div>

        {/* Overlay Checkboxes */}
        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors">
            <span className="text-slate-200">Flight Path & Waypoints</span>
            <input
              type="checkbox"
              checked={showFlightPath}
              onChange={(e) => setShowFlightPath(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors">
            <span className="text-slate-200">Reconstruction Boundary</span>
            <input
              type="checkbox"
              checked={showBoundary}
              onChange={(e) => setShowBoundary(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors">
            <span className="text-slate-200">Elevation Contours (DEM)</span>
            <input
              type="checkbox"
              checked={showContours}
              onChange={(e) => setShowContours(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors">
            <span className="text-slate-200">Points of Interest (POIs)</span>
            <input
              type="checkbox"
              checked={showPOIs}
              onChange={(e) => setShowPOIs(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
            />
          </label>
        </div>

        {/* Selected POI Inspector */}
        <div className="pt-3 border-t border-slate-800 flex-1">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Selected Geolocation Target
          </h4>

          {selectedPOI ? (
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  {selectedPOI.category}
                </span>
                <p className="font-bold text-white text-sm mt-1">{selectedPOI.name}</p>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-slate-300 divide-y divide-slate-800">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-sans">Latitude</span>
                  <span>{selectedPOI.lat}° N</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-sans">Longitude</span>
                  <span>{selectedPOI.lng}° E</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-sans">Elevation MSL</span>
                  <span className="text-emerald-400 font-bold">{selectedPOI.elevation} m</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-800/30 border border-dashed border-slate-800 text-center text-xs text-slate-400">
              Click any marker on the map to inspect geodetic coordinates and elevation datum.
            </div>
          )}
        </div>

        {/* Survey Metadata Footnote */}
        <div className="mt-auto p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Georeference Datum</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Projected into Universal Transverse Mercator (UTM Zone 43 North). Geoid model: EGM96 with RTK-PPK baseline corrections.
          </p>
        </div>
      </div>
    </div>
  );
};
