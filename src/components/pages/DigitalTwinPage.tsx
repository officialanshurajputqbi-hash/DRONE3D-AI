import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Building,
  TreePine,
  Navigation,
  Zap,
  Mountain,
  Folder,
  Layers,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Viewer3D } from '../3d/Viewer3D';
import { DEMO_SCENE_OBJECTS } from '../../data/mockData';
import { SceneObject } from '../../types';
import { useStore } from '../../store/useStore';

export const DigitalTwinPage: React.FC = () => {
  const { selectedObject, setSelectedObject } = useStore();

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    site: true,
    buildings: true,
    roads: true,
    vegetation: false,
    infrastructure: false,
  });

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
  };

  const handleSelectBuilding = (obj: SceneObject) => {
    setSelectedObject(obj);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-[#050D18] overflow-hidden text-xs">
      {/* LEFT: 3D Digital Twin Viewport */}
      <div className="flex-1 h-full min-h-[400px] relative">
        <Viewer3D
          initialMode="textured"
          selectedObject={selectedObject}
          onSelectObject={setSelectedObject}
        />
      </div>

      {/* RIGHT: Interactive Hierarchical Object Tree Panel */}
      <div className="w-full md:w-88 bg-slate-900/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
        <div className="pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Digital Twin Topology
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-sm font-bold text-white mt-0.5">Scene Hierarchy & Assets</h2>
          <p className="text-[11px] text-slate-400">Click any asset node to focus and inspect in 3D</p>
        </div>

        {/* Tree Container */}
        <div className="space-y-1 font-medium text-slate-300">
          {/* Root Site Node */}
          <div>
            <div
              onClick={() => toggleNode('site')}
              className="flex items-center gap-1.5 p-1.5 rounded hover:bg-slate-800/80 cursor-pointer text-white font-bold"
            >
              {expandedNodes.site ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <Folder className="w-3.5 h-3.5 text-blue-400" />
              <span>Jaipur Heritage Survey Site</span>
            </div>

            {expandedNodes.site && (
              <div className="pl-5 space-y-1 mt-1 border-l border-slate-800/80 ml-2.5">
                {/* 1. Buildings Category */}
                <div>
                  <div
                    onClick={() => toggleNode('buildings')}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-200"
                  >
                    <div className="flex items-center gap-1.5">
                      {expandedNodes.buildings ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      <span>Buildings & Monoliths</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">8</span>
                  </div>

                  {expandedNodes.buildings && (
                    <div className="pl-4 space-y-0.5 mt-0.5 border-l border-slate-800 ml-2">
                      {DEMO_SCENE_OBJECTS.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => handleSelectBuilding(b)}
                          className={`p-1.5 rounded flex items-center justify-between cursor-pointer transition-colors ${
                            selectedObject?.id === b.id
                              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="truncate">{b.name}</span>
                          <span className="font-mono text-[10px] text-cyan-400 shrink-0 ml-1">{b.height}m</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Roads Category */}
                <div>
                  <div
                    onClick={() => toggleNode('roads')}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-200"
                  >
                    <div className="flex items-center gap-1.5">
                      {expandedNodes.roads ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Roads & Accessways</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">2</span>
                  </div>

                  {expandedNodes.roads && (
                    <div className="pl-4 space-y-0.5 mt-0.5 border-l border-slate-800 ml-2 text-slate-400">
                      <div className="p-1.5 rounded hover:bg-slate-800/50 cursor-pointer flex justify-between">
                        <span>Central North-South Highway</span>
                        <span className="font-mono text-[10px] text-slate-500">7.2m w</span>
                      </div>
                      <div className="p-1.5 rounded hover:bg-slate-800/50 cursor-pointer flex justify-between">
                        <span>East-West Heritage Causeway</span>
                        <span className="font-mono text-[10px] text-slate-500">5.5m w</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Vegetation Category */}
                <div>
                  <div
                    onClick={() => toggleNode('vegetation')}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-200"
                  >
                    <div className="flex items-center gap-1.5">
                      {expandedNodes.vegetation ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                      <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Vegetation Canopy</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">31.7%</span>
                  </div>
                </div>

                {/* 4. Infrastructure Category */}
                <div>
                  <div
                    onClick={() => toggleNode('infrastructure')}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-slate-800/60 cursor-pointer text-slate-200"
                  >
                    <div className="flex items-center gap-1.5">
                      {expandedNodes.infrastructure ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Utility Infrastructure</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">12</span>
                  </div>
                </div>

                {/* 5. Terrain Ground Datum */}
                <div className="p-1.5 rounded hover:bg-slate-800/50 cursor-pointer flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5 text-slate-400" />
                    <span>Digital Elevation Surface</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">432.8m MSL</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Object Live Status Card */}
        {selectedObject && (
          <div className="mt-auto p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                Telemetry Link Active
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                {selectedObject.condition}
              </span>
            </div>
            <p className="font-bold text-white text-xs">{selectedObject.name}</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-1">
              <div>Height: <span className="text-cyan-400 font-bold">{selectedObject.height} m</span></div>
              <div>Area: <span className="text-white font-bold">{selectedObject.area} m²</span></div>
              <div>Volume: <span className="text-white">{selectedObject.volume} m³</span></div>
              <div>Floors: <span className="text-white">{selectedObject.floors || 4} Lvls</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
