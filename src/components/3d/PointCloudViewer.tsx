import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sliders,
  Filter,
  Layers,
  RotateCcw,
  Maximize2,
  Info,
  Check,
} from 'lucide-react';

type ColorMode = 'rgb' | 'elevation' | 'classification' | 'intensity';

interface PointCloudViewerProps {
  onMeasure?: (val: string) => void;
}

export const PointCloudViewer: React.FC<PointCloudViewerProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [colorMode, setColorMode] = useState<ColorMode>('classification');
  const [pointSize, setPointSize] = useState<number>(3.5);
  const [density, setDensity] = useState<number>(100);
  const [clipHeight, setClipHeight] = useState<number>(35);
  const [selectedClass, setSelectedClass] = useState<Record<string, boolean>>({
    ground: true,
    building: true,
    road: true,
    vegetation: true,
    vehicle: true,
  });

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsMeshRef = useRef<THREE.Points | null>(null);
  const rawDataRef = useRef<{
    positions: Float32Array;
    colorsRGB: Float32Array;
    colorsElevation: Float32Array;
    colorsClass: Float32Array;
    colorsIntensity: Float32Array;
    classes: string[];
    count: number;
  } | null>(null);

  // Camera orbit state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const cameraPolarRef = useRef({ radius: 55, theta: 0.8, phi: 1.1 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 5, 0));

  // Generate 8,000+ demo points with realistic geospatial attributes
  useEffect(() => {
    const count = 9000;
    const positions = new Float32Array(count * 3);
    const colorsRGB = new Float32Array(count * 3);
    const colorsElevation = new Float32Array(count * 3);
    const colorsClass = new Float32Array(count * 3);
    const colorsIntensity = new Float32Array(count * 3);
    const classes: string[] = [];

    const classColors: Record<string, [number, number, number]> = {
      ground: [0.65, 0.52, 0.38],      // Brown / Sandy
      building: [0.15, 0.45, 0.95],    // Blue
      road: [0.35, 0.4, 0.48],         // Slate Gray
      vegetation: [0.1, 0.75, 0.4],    // Green
      vehicle: [0.95, 0.65, 0.1],      // Amber
    };

    let pIdx = 0;
    let cIdx = 0;

    for (let i = 0; i < count; i++) {
      // Spatial distribution: central urban grid with road corridor and buildings
      const randType = Math.random();
      let x = 0;
      let y = 0;
      let z = 0;
      let type = 'ground';
      let r = 0.5, g = 0.5, b = 0.5;

      if (randType < 0.35) {
        // Ground
        type = 'ground';
        x = (Math.random() - 0.5) * 60;
        z = (Math.random() - 0.5) * 60;
        y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 1.2;
        r = 0.4 + Math.random() * 0.15;
        g = 0.35 + Math.random() * 0.1;
        b = 0.25 + Math.random() * 0.1;
      } else if (randType < 0.65) {
        // Building roofs & walls
        type = 'building';
        // Pick one of 4 building cluster seeds
        const seed = Math.floor(Math.random() * 4);
        const seeds = [
          { cx: -15, cz: -12, w: 10, d: 9, maxH: 18 },
          { cx: 16, cz: -14, w: 8, d: 8, maxH: 24 },
          { cx: -14, cz: 14, w: 9, d: 8, maxH: 14 },
          { cx: 15, cz: 12, w: 12, d: 10, maxH: 12 },
        ][seed];

        x = seeds.cx + (Math.random() - 0.5) * seeds.w;
        z = seeds.cz + (Math.random() - 0.5) * seeds.d;
        // Either wall point or roof point
        y = Math.random() < 0.4 ? seeds.maxH : Math.random() * seeds.maxH;
        r = 0.2 + (y / seeds.maxH) * 0.4;
        g = 0.4 + (y / seeds.maxH) * 0.3;
        b = 0.8 + (y / seeds.maxH) * 0.2;
      } else if (randType < 0.8) {
        // Road corridor
        type = 'road';
        if (Math.random() < 0.5) {
          x = (Math.random() - 0.5) * 6;
          z = (Math.random() - 0.5) * 60;
        } else {
          x = (Math.random() - 0.5) * 60;
          z = (Math.random() - 0.5) * 5;
        }
        y = 0.05 + Math.random() * 0.1;
        r = 0.22 + Math.random() * 0.05;
        g = 0.25 + Math.random() * 0.05;
        b = 0.28 + Math.random() * 0.05;
      } else if (randType < 0.95) {
        // Vegetation cluster
        type = 'vegetation';
        const tx = (Math.random() - 0.5) * 50;
        const tz = (Math.random() - 0.5) * 50;
        x = tx + (Math.random() - 0.5) * 4;
        z = tz + (Math.random() - 0.5) * 4;
        y = 0.8 + Math.random() * 4.2;
        r = 0.08 + Math.random() * 0.1;
        g = 0.55 + Math.random() * 0.3;
        b = 0.2 + Math.random() * 0.1;
      } else {
        // Vehicles
        type = 'vehicle';
        x = (Math.random() - 0.5) * 4;
        z = (Math.random() - 0.5) * 40;
        y = 0.3 + Math.random() * 1.2;
        r = 0.85 + Math.random() * 0.15;
        g = 0.6 + Math.random() * 0.2;
        b = 0.1;
      }

      positions[pIdx] = x;
      positions[pIdx + 1] = y;
      positions[pIdx + 2] = z;

      // RGB
      colorsRGB[cIdx] = r;
      colorsRGB[cIdx + 1] = g;
      colorsRGB[cIdx + 2] = b;

      // Elevation Heatmap (0m to 25m)
      const elevNorm = Math.min(1, Math.max(0, y / 25));
      colorsElevation[cIdx] = elevNorm < 0.5 ? elevNorm * 2 : 1;
      colorsElevation[cIdx + 1] = elevNorm < 0.5 ? 1 : 1 - (elevNorm - 0.5) * 2;
      colorsElevation[cIdx + 2] = elevNorm < 0.3 ? 1 - elevNorm * 3 : 0.1;

      // Classification Colors
      const cCol = classColors[type] || [0.5, 0.5, 0.5];
      colorsClass[cIdx] = cCol[0];
      colorsClass[cIdx + 1] = cCol[1];
      colorsClass[cIdx + 2] = cCol[2];

      // Intensity (pseudo LiDAR return)
      const intensity = 0.2 + Math.random() * 0.8;
      colorsIntensity[cIdx] = intensity;
      colorsIntensity[cIdx + 1] = intensity;
      colorsIntensity[cIdx + 2] = intensity;

      classes.push(type);
      pIdx += 3;
      cIdx += 3;
    }

    rawDataRef.current = {
      positions,
      colorsRGB,
      colorsElevation,
      colorsClass,
      colorsIntensity,
      classes,
      count,
    };
  }, []);

  // Update Three.js canvas setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !rawDataRef.current) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050d18);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCamera();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Ground Grid Helper
    const grid = new THREE.GridHelper(70, 35, 0x1e3a8a, 0x0f172a);
    grid.position.y = -0.1;
    scene.add(grid);

    // 5. Point Cloud Buffer Geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(rawDataRef.current.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(rawDataRef.current.colorsClass, 3));

    const material = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    });

    const pointsMesh = new THREE.Points(geometry, material);
    pointsMeshRef.current = pointsMesh;
    scene.add(pointsMesh);

    // 6. Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  const updateCamera = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraPolarRef.current;
    const target = cameraTargetRef.current;
    cameraRef.current.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta)
    );
    cameraRef.current.lookAt(target);
  };

  // Re-color or filter points when state updates
  useEffect(() => {
    if (!pointsMeshRef.current || !rawDataRef.current) return;

    const data = rawDataRef.current;
    let chosenColors = data.colorsClass;

    if (colorMode === 'rgb') chosenColors = data.colorsRGB;
    else if (colorMode === 'elevation') chosenColors = data.colorsElevation;
    else if (colorMode === 'intensity') chosenColors = data.colorsIntensity;

    const geo = pointsMeshRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const colorAttr = geo.attributes.color as THREE.BufferAttribute;

    const maxKeepIndex = Math.floor((data.count * density) / 100);

    for (let i = 0; i < data.count; i++) {
      const pIdx = i * 3;
      const type = data.classes[i];
      const isClassVisible = selectedClass[type] ?? true;
      const isUnderClip = data.positions[pIdx + 1] <= clipHeight;
      const isWithinDensity = i < maxKeepIndex;

      if (isClassVisible && isUnderClip && isWithinDensity) {
        colorAttr.setXYZ(i, chosenColors[pIdx], chosenColors[pIdx + 1], chosenColors[pIdx + 2]);
      } else {
        // Move outside view or set alpha/black
        colorAttr.setXYZ(i, 0, 0, 0);
      }
    }

    colorAttr.needsUpdate = true;

    // Update material point size
    if (pointsMeshRef.current.material instanceof THREE.PointsMaterial) {
      pointsMeshRef.current.material.size = pointSize;
      pointsMeshRef.current.material.needsUpdate = true;
    }
  }, [colorMode, pointSize, density, clipHeight, selectedClass]);

  // Mouse camera interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    if (e.buttons === 1) {
      cameraPolarRef.current.theta -= deltaX * 0.008;
      cameraPolarRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, cameraPolarRef.current.phi - deltaY * 0.008)
      );
      updateCamera();
    } else if (e.buttons === 2) {
      cameraTargetRef.current.y += deltaY * 0.04;
      updateCamera();
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraPolarRef.current.radius = Math.max(12, Math.min(100, cameraPolarRef.current.radius + e.deltaY * 0.05));
    updateCamera();
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-[#050D18] overflow-hidden">
      {/* Canvas Viewport */}
      <div
        className="relative flex-1 h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div ref={containerRef} className="w-full h-full" />

        {/* Viewport Floating Info */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-white">Dense Point Cloud (LAS / LAZ)</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-cyan-400">2,841,627 pts</span>
          </div>
        </div>

        {/* Color Mode Switcher */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 p-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60">
          {(['classification', 'rgb', 'elevation', 'intensity'] as ColorMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setColorMode(m)}
              className={`px-2.5 py-1 text-xs font-semibold rounded capitalize transition-all ${
                colorMode === m
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Control Sidebar */}
      <div className="w-full md:w-80 bg-slate-900/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Point Cloud Controls
          </h3>
          <p className="text-sm font-bold text-white mt-0.5">Filter & Density Settings</p>
        </div>

        {/* Sliders */}
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1.5">
              <span>Point Display Size</span>
              <span className="font-mono font-bold text-cyan-400">{pointSize.toFixed(1)} px</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={pointSize}
              onChange={(e) => setPointSize(parseFloat(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1.5">
              <span>Point Decimation Density</span>
              <span className="font-mono font-bold text-cyan-400">{density}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={density}
              onChange={(e) => setDensity(parseInt(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1.5">
              <span>Elevation Clip Height</span>
              <span className="font-mono font-bold text-cyan-400">{clipHeight} m</span>
            </div>
            <input
              type="range"
              min="2"
              max="35"
              step="1"
              value={clipHeight}
              onChange={(e) => setClipHeight(parseInt(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* ASPRS Classification Filter Checkboxes */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            Class Visibility (ASPRS)
          </h4>

          {[
            { id: 'ground', label: 'Ground (Class 2)', color: 'bg-[#A68461]', count: '42%' },
            { id: 'building', label: 'Building (Class 6)', color: 'bg-[#2563EB]', count: '28%' },
            { id: 'road', label: 'Road / Asphalt', color: 'bg-[#59667A]', count: '15%' },
            { id: 'vegetation', label: 'High Vegetation (Class 5)', color: 'bg-[#10B981]', count: '12%' },
            { id: 'vehicle', label: 'Vehicles (Class 64)', color: 'bg-[#F59E0B]', count: '3%' },
          ].map((item) => (
            <label
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors text-xs"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-slate-200">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate-400">{item.count}</span>
                <input
                  type="checkbox"
                  checked={selectedClass[item.id]}
                  onChange={(e) =>
                    setSelectedClass((prev) => ({ ...prev, [item.id]: e.target.checked }))
                  }
                  className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                />
              </div>
            </label>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-auto p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <Info className="w-3.5 h-3.5" />
            <span>Metric Georeferencing</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Sparse and dense point clouds are calibrated using real-time kinematic (RTK) GNSS and IMU integration for sub-5cm root mean square error.
          </p>
        </div>
      </div>
    </div>
  );
};
