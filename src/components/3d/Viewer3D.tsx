import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  Layers,
  Ruler,
  Tag,
  Crosshair,
  Building,
  MapPin,
  CheckCircle2,
  Box,
  Compass,
} from 'lucide-react';
import { ViewerMode, SceneObject } from '../../types';
import { DEMO_SCENE_OBJECTS } from '../../data/mockData';

interface Viewer3DProps {
  initialMode?: ViewerMode;
  selectedObject?: SceneObject | null;
  onSelectObject?: (obj: SceneObject | null) => void;
  onAddMeasurement?: (label: string, value: number, unit: string) => void;
  activeMeasurementTool?: 'distance' | 'height' | 'area' | 'volume' | null;
}

export const Viewer3D: React.FC<Viewer3DProps> = ({
  initialMode = 'textured',
  selectedObject: externalSelected,
  onSelectObject,
  onAddMeasurement,
  activeMeasurementTool = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<ViewerMode>(initialMode);
  const [internalSelected, setInternalSelected] = useState<SceneObject | null>(
    externalSelected || DEMO_SCENE_OBJECTS[0]
  );
  const [activeTool, setActiveTool] = useState<
    'select' | 'distance' | 'height' | 'area' | 'volume' | 'marker' | 'section'
  >(activeMeasurementTool || 'select');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [measurementOverlay, setMeasurementOverlay] = useState<{
    type: string;
    text: string;
    pos: { x: number; y: number };
  } | null>(null);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const highlightBoxRef = useRef<THREE.BoxHelper | null>(null);
  const measureLineRef = useRef<THREE.Line | null>(null);
  const measurePointsRef = useRef<THREE.Points | null>(null);
  const droneSplineRef = useRef<THREE.Group | null>(null);
  const modeMaterialsRef = useRef<Map<string, { textured: THREE.Material; solid: THREE.Material; wireframe: THREE.Material }>>(new Map());

  // Mouse camera control tracking
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraPolarRef = useRef({ radius: 48, theta: Math.PI / 4, phi: Math.PI / 3.4 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 4, 0));

  // Sync internal and external selected object
  useEffect(() => {
    if (externalSelected) {
      setInternalSelected(externalSelected);
    }
  }, [externalSelected]);

  // Handle building selection update
  const selectBuilding = useCallback((obj: SceneObject | null) => {
    setInternalSelected(obj);
    if (onSelectObject) onSelectObject(obj);

    if (!sceneRef.current) return;

    if (highlightBoxRef.current) {
      sceneRef.current.remove(highlightBoxRef.current);
      highlightBoxRef.current.dispose();
      highlightBoxRef.current = null;
    }

    if (obj) {
      const mesh = buildingMeshesRef.current.get(obj.id);
      if (mesh) {
        const box = new THREE.BoxHelper(mesh, 0x06b6d4);
        sceneRef.current.add(box);
        highlightBoxRef.current = box;
      }
    }
  }, [onSelectObject]);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Clean previous canvases if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x07111F);
    scene.fog = new THREE.FogExp2(0x07111F, 0.009);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
    sunLight.position.set(35, 55, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 0.4);
    rimLight.position.set(-25, 20, -25);
    scene.add(rimLight);

    // 5. Grid Ground
    const grid = new THREE.GridHelper(90, 45, 0x1e3a8a, 0x0f172a);
    grid.position.y = -0.05;
    scene.add(grid);

    // 6. Procedural Terrain (non-flat with subtle rolling topography)
    const terrainGeo = new THREE.PlaneGeometry(80, 80, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      // create natural undulations away from central roads
      const distFromCenter = Math.sqrt(x * x + z * z);
      const bump = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 1.4;
      const elevation = Math.max(-0.2, (distFromCenter > 15 ? (distFromCenter - 15) * 0.08 : 0) + bump);
      posAttr.setY(i, elevation - 0.2);
    }
    terrainGeo.computeVertexNormals();

    const terrainMatTextured = new THREE.MeshStandardMaterial({
      color: 0x111c2e,
      roughness: 0.85,
      metalness: 0.1,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMatTextured);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 7. Roads
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const mainRoadGeo = new THREE.PlaneGeometry(6, 80);
    mainRoadGeo.rotateX(-Math.PI / 2);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.position.y = 0.02;
    mainRoad.receiveShadow = true;
    scene.add(mainRoad);

    const crossRoadGeo = new THREE.PlaneGeometry(80, 5);
    crossRoadGeo.rotateX(-Math.PI / 2);
    const crossRoad = new THREE.Mesh(crossRoadGeo, roadMat);
    crossRoad.position.y = 0.02;
    crossRoad.receiveShadow = true;
    scene.add(crossRoad);

    // Road dash lines
    const dashLineMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
    for (let z = -35; z <= 35; z += 5) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 2.5), dashLineMat);
      dash.rotateX(-Math.PI / 2);
      dash.position.set(0, 0.03, z);
      scene.add(dash);
    }

    // 8. Generate 8 Distinct Buildings
    const buildingConfigs = [
      { id: 'B-101', x: -14, z: -10, w: 9, d: 8, h: 14.5, color: 0x2563eb, roofColor: 0x06b6d4, hasDome: true },
      { id: 'B-102', x: -15, z: 12, w: 8, d: 7, h: 11.2, color: 0x3b82f6, roofColor: 0x1d4ed8 },
      { id: 'B-103', x: 12, z: -14, w: 6, d: 6, h: 18.8, color: 0x1e40af, roofColor: 0x60a5fa, isTower: true },
      { id: 'B-104', x: 15, z: 10, w: 10, d: 9, h: 8.8, color: 0x2563eb, roofColor: 0x0284c7 },
      { id: 'B-105', x: -6, z: -22, w: 7, d: 7, h: 13.0, color: 0xd97706, roofColor: 0xb45309 },
      { id: 'B-106', x: -24, z: 2, w: 6, d: 6, h: 7.6, color: 0x3b82f6, roofColor: 0x1e3a8a },
      { id: 'B-107', x: 6, z: 24, w: 7, d: 5, h: 16.5, color: 0x2563eb, roofColor: 0x0ea5e9, hasArch: true },
      { id: 'B-108', x: 24, z: -4, w: 8, d: 9, h: 9.8, color: 0x1d4ed8, roofColor: 0x0369a1 },
    ];

    buildingMeshesRef.current.clear();
    modeMaterialsRef.current.clear();

    buildingConfigs.forEach((b) => {
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(b.x, 0, b.z);

      // Main structure
      const bodyGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      bodyGeo.translate(0, b.h / 2, 0);

      // Materials for 3 modes
      const texturedMat = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.4,
        metalness: 0.25,
      });
      const solidMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.6,
        metalness: 0.1,
      });
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
      });

      modeMaterialsRef.current.set(b.id, {
        textured: texturedMat,
        solid: solidMat,
        wireframe: wireframeMat,
      });

      const bodyMesh = new THREE.Mesh(bodyGeo, texturedMat);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      bodyMesh.userData = { id: b.id };
      buildingGroup.add(bodyMesh);

      // Roof details
      const roofCapGeo = new THREE.BoxGeometry(b.w * 0.94, 0.4, b.d * 0.94);
      const roofMat = new THREE.MeshStandardMaterial({ color: b.roofColor || 0x0284c7, roughness: 0.3 });
      const roofCap = new THREE.Mesh(roofCapGeo, roofMat);
      roofCap.position.set(0, b.h + 0.2, 0);
      roofCap.castShadow = true;
      buildingGroup.add(roofCap);

      // Extra architectural accents
      if (b.hasDome) {
        const dome = new THREE.Mesh(
          new THREE.SphereGeometry(2.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5, roughness: 0.2 })
        );
        dome.position.set(0, b.h + 0.3, 0);
        buildingGroup.add(dome);
      }

      if (b.isTower) {
        const antenna = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.2, 4, 8),
          new THREE.MeshStandardMaterial({ color: 0xef4444 })
        );
        antenna.position.set(0, b.h + 2.2, 0);
        buildingGroup.add(antenna);
      }

      scene.add(buildingGroup);
      buildingMeshesRef.current.set(b.id, bodyMesh);
    });

    // 9. Trees (low poly vegetation)
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });

    const treePositions = [
      [-8, 6], [-6, 8], [-9, 14], [-7, 18], [8, -8], [9, -12], [7, -16],
      [-20, -15], [-22, -18], [20, 16], [22, 19], [-3, 14], [3, 16]
    ];

    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.8, 6), treeTrunkMat);
      trunk.position.y = 0.9;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4), treeFoliageMat);
      foliage.position.y = 2.4;
      foliage.castShadow = true;
      tree.add(foliage);

      scene.add(tree);
    });

    // 10. Drone Flight Path Spline & Beacon
    const droneGroup = new THREE.Group();
    droneSplineRef.current = droneGroup;

    const curvePoints = [
      new THREE.Vector3(-28, 22, -28),
      new THREE.Vector3(-15, 20, -10),
      new THREE.Vector3(0, 19, 0),
      new THREE.Vector3(14, 21, 12),
      new THREE.Vector3(26, 23, 26),
      new THREE.Vector3(18, 19, -20),
      new THREE.Vector3(-4, 18, -12),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints, true);
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(120));
    const curveMaterial = new THREE.LineDashedMaterial({
      color: 0x06b6d4,
      dashSize: 1.2,
      gapSize: 0.6,
      linewidth: 2,
    });
    const splineLine = new THREE.Line(curveGeometry, curveMaterial);
    splineLine.computeLineDistances();
    droneGroup.add(splineLine);

    // Waypoint beacons
    curvePoints.forEach((pt) => {
      const beaconGeo = new THREE.SphereGeometry(0.4, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(pt);
      droneGroup.add(beacon);
    });

    // Drone miniature model at first point
    const droneBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.3, 1.6),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 })
    );
    droneBody.position.copy(curvePoints[0]);
    droneGroup.add(droneBody);

    scene.add(droneGroup);

    // 11. Initial selection highlight
    if (internalSelected) {
      const targetMesh = buildingMeshesRef.current.get(internalSelected.id);
      if (targetMesh) {
        const box = new THREE.BoxHelper(targetMesh, 0x06b6d4);
        scene.add(box);
        highlightBoxRef.current = box;
      }
    }

    // 12. Render loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Drone hover animation
      if (droneBody) {
        droneBody.position.y = curvePoints[0].y + Math.sin(elapsedTime * 3) * 0.4;
        droneBody.rotation.y = elapsedTime * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 13. Resize handler
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
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // Update camera coordinates helper
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraPolarRef.current;
    const target = cameraTargetRef.current;

    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(target);
  };

  // Sync mode changes to materials
  useEffect(() => {
    buildingMeshesRef.current.forEach((mesh, id) => {
      const mats = modeMaterialsRef.current.get(id);
      if (!mats) return;

      if (mode === 'textured') {
        mesh.material = mats.textured;
      } else if (mode === 'solid') {
        mesh.material = mats.solid;
      } else if (mode === 'wireframe') {
        mesh.material = mats.wireframe;
      } else if (mode === 'pointcloud') {
        mesh.material = mats.wireframe; // Clean wireframe abstraction for mesh
      }
    });
  }, [mode]);

  // Mouse event listeners for orbit & pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 2) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    if (e.buttons === 1) {
      // Left drag: Rotate
      cameraPolarRef.current.theta -= deltaX * 0.008;
      cameraPolarRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.02, cameraPolarRef.current.phi - deltaY * 0.008)
      );
      updateCameraPosition();
    } else if (e.buttons === 2 || e.shiftKey) {
      // Right drag / Shift: Pan target
      const forward = new THREE.Vector3();
      cameraRef.current?.getWorldDirection(forward);
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      cameraTargetRef.current.addScaledVector(right, -deltaX * 0.05);
      cameraTargetRef.current.y += deltaY * 0.05;
      updateCameraPosition();
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraPolarRef.current.radius = Math.max(
      8,
      Math.min(120, cameraPolarRef.current.radius + e.deltaY * 0.04)
    );
    updateCameraPosition();
  };

  // Click Raycaster for Object Selection & Measurements
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = canvasContainerRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // If measurement mode is active
    if (activeTool === 'distance' || activeTool === 'height' || activeTool === 'area' || activeTool === 'volume') {
      const distanceVal = activeTool === 'distance' ? 24.8 : activeTool === 'height' ? 18.4 : activeTool === 'area' ? 1284 : 14820;
      const unit = activeTool === 'distance' || activeTool === 'height' ? 'm' : activeTool === 'area' ? 'm²' : 'm³';
      const label = activeTool === 'distance' ? 'Linear Distance' : activeTool === 'height' ? 'Vertical Height' : activeTool === 'area' ? 'Polygon Area' : 'Enclosed Volume';

      setMeasurementOverlay({
        type: activeTool,
        text: `${label}: ${distanceVal} ${unit}`,
        pos: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      });

      if (onAddMeasurement) {
        onAddMeasurement(label, distanceVal, unit);
      }
      return;
    }

    // Object selection mode
    const meshesArray = Array.from(buildingMeshesRef.current.values());
    const intersects = raycaster.intersectObjects(meshesArray, false);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const buildingId = clickedMesh.userData.id;
      const found = DEMO_SCENE_OBJECTS.find((b) => b.id === buildingId) || null;
      selectBuilding(found);
    }
  };

  const handleResetCamera = () => {
    cameraPolarRef.current = { radius: 48, theta: Math.PI / 4, phi: Math.PI / 3.4 };
    cameraTargetRef.current.set(0, 4, 0);
    updateCameraPosition();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-[#050D18] overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen' : ''
      }`}
    >
      {/* 1. LEFT 3D TOOLBAR */}
      <div className="z-10 flex md:flex-col items-center justify-between md:justify-start gap-1 p-2 md:w-14 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 shrink-0">
        <div className="flex md:flex-col gap-1 w-full items-center">
          <button
            onClick={() => {
              setActiveTool('select');
              setMeasurementOverlay(null);
            }}
            title="Inspect & Select Object"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTool === 'select'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Crosshair className="w-4 h-4" />
          </button>

          <div className="h-px w-6 bg-slate-800 my-1 hidden md:block" />

          {/* Measurements */}
          <button
            onClick={() => setActiveTool('distance')}
            title="Measure Distance"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTool === 'distance'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Ruler className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('height')}
            title="Measure Vertical Height"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTool === 'height'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('area')}
            title="Measure Polygon Area"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTool === 'area'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Box className="w-4 h-4" />
          </button>

          <div className="h-px w-6 bg-slate-800 my-1 hidden md:block" />

          <button
            onClick={() => setActiveTool('marker')}
            title="Place Geospatial POI Marker"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTool === 'marker'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetCamera}
            title="Reset Camera View"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* View Mode Dropdown or Pills */}
        <div className="flex md:flex-col gap-1 items-center pb-1">
          <button
            onClick={() => setMode('textured')}
            title="Textured Mesh Mode"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all text-xs font-bold ${
              mode === 'textured'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            TEX
          </button>
          <button
            onClick={() => setMode('solid')}
            title="Solid Clay Shading"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all text-xs font-bold ${
              mode === 'solid'
                ? 'bg-slate-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            SLD
          </button>
          <button
            onClick={() => setMode('wireframe')}
            title="Wireframe Geometry"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all text-xs font-bold ${
              mode === 'wireframe'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            WFR
          </button>
        </div>
      </div>

      {/* 2. MAIN 3D VIEWPORT CANVAS */}
      <div
        className="relative flex-1 h-full min-h-[360px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div ref={canvasContainerRef} className="w-full h-full" />

        {/* HUD Overlay - Project & Coordinates Bar */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-wrap items-center gap-2">
          <div className="pointer-events-auto px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100">Jaipur Heritage Survey</span>
            <span className="text-slate-500 text-xs">/</span>
            <span className="font-mono text-[11px] text-cyan-400">EPSG:4326 · UTM 43N</span>
          </div>

          <div className="pointer-events-auto px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 hidden sm:flex items-center gap-3 text-[11px] text-slate-300 font-mono">
            <span>26.9124°N, 75.7873°E</span>
            <span>Alt: 120.0m</span>
          </div>
        </div>

        {/* Navigation Helper */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 backdrop-blur-md border border-slate-800 text-[11px] text-slate-400">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Left-Drag: Rotate · Right-Drag / Shift: Pan · Wheel: Zoom · Click: Select Object</span>
        </div>

        {/* Active Measurement Popover */}
        {measurementOverlay && (
          <div
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-1.5 rounded-lg bg-blue-900/90 border border-blue-400/80 shadow-2xl backdrop-blur-md text-xs font-semibold text-white animate-in zoom-in-95 duration-150"
            style={{ left: measurementOverlay.pos.x, top: measurementOverlay.pos.y }}
          >
            {measurementOverlay.text}
          </div>
        )}
      </div>

      {/* 3. RIGHT INSPECTOR PANEL */}
      <div className="z-10 w-full md:w-80 bg-slate-900/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-slate-800 flex flex-col p-4 overflow-y-auto shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reconstruction Mesh
            </h3>
            <p className="text-sm font-bold text-slate-100">Model Telemetry</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            ±4.2 cm Certified
          </span>
        </div>

        {/* Mesh Statistics */}
        <div className="grid grid-cols-2 gap-2 my-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Vertices</span>
            <p className="font-mono text-sm font-bold text-slate-100 mt-0.5">2.84M</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Faces</span>
            <p className="font-mono text-sm font-bold text-slate-100 mt-0.5">5.62M</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Point Density</span>
            <p className="font-mono text-sm font-bold text-slate-100 mt-0.5">428 pts/m²</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Coverage</span>
            <p className="font-mono text-sm font-bold text-emerald-400 mt-0.5">94.7%</p>
          </div>
        </div>

        {/* Selected 3D Object Information */}
        <div className="mt-2 pt-3 border-t border-slate-800 flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              Object Details
            </span>
            {internalSelected && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30">
                {internalSelected.id}
              </span>
            )}
          </div>

          {internalSelected ? (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20">
                <p className="text-xs font-bold text-slate-100">{internalSelected.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{internalSelected.roofType}</p>
              </div>

              <div className="space-y-1.5 divide-y divide-slate-800/80">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Height</span>
                  <span className="font-mono font-bold text-cyan-400">{internalSelected.height} m</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Footprint Area</span>
                  <span className="font-mono font-semibold text-slate-200">{internalSelected.area} m²</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Enclosed Volume</span>
                  <span className="font-mono font-semibold text-slate-200">{internalSelected.volume} m³</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Coordinates</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    {internalSelected.coordinates.lat.toFixed(4)}, {internalSelected.coordinates.lng.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Condition</span>
                  <span className="text-emerald-400 font-medium">{internalSelected.condition}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Inspection</span>
                  <span className="text-blue-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {internalSelected.inspectionStatus}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              Click any building in the 3D scene to inspect dimensions, area, and structural telemetry.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-3 border-t border-slate-800 mt-auto space-y-1.5">
          <button
            onClick={() => setActiveTool('distance')}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Ruler className="w-3.5 h-3.5 text-blue-400" />
            Measure Distance & Dimensions
          </button>
        </div>
      </div>
    </div>
  );
};
