import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Project,
  ProcessingStage,
  ViewerMode,
  SceneObject,
  MeasurementRecord,
  AIDetectionItem,
  DamageZone,
  InspectionRecord,
  TelemetryPoint,
} from '../types';
import {
  DEFAULT_DEMO_PROJECT,
  INITIAL_PROJECTS,
  PIPELINE_STAGES,
  DEMO_SCENE_OBJECTS,
  INITIAL_MEASUREMENTS,
  AI_DETECTIONS,
  DAMAGE_ZONES,
  INSPECTION_RECORDS,
  generateDemoFlightTrack,
} from '../data/mockData';

export interface UploadedVideoInfo {
  name: string;
  size: string;
  duration: string;
  resolution: string;
  fps: number;
  codec: string;
  hasGPS: boolean;
  totalFrames: number;
  estProcessingTime: string;
  file?: File;
}

export interface FlightDataInfo {
  pointsCount: number;
  flightDistance: string;
  maxAltitude: string;
  avgSpeed: string;
  flightDuration: string;
  points: TelemetryPoint[];
  fileName?: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
}

const STORAGE_KEYS = {
  PROJECTS: 'drone3d_projects',
  ACTIVE_PROJECT_ID: 'drone3d_active_project_id',
  USER: 'drone3d_user',
  THEME: 'drone3d_theme',
  MEASUREMENTS: 'drone3d_measurements',
  DAMAGE_ZONES: 'drone3d_damage_zones',
  INSPECTIONS: 'drone3d_inspections',
};

// Global event bus for reactive updates across components without external store library
type Listener = () => void;
const listeners = new Set<Listener>();
function notify() {
  listeners.forEach((l) => l());
}

// In-memory persistent state holder
let stateProjects: Project[] = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_PROJECTS;
})();

let stateActiveProjectId: string = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
    if (saved && stateProjects.some((p) => p.id === saved)) return saved;
  } catch {
    // fallback
  }
  return DEFAULT_DEMO_PROJECT.id;
})();

let stateUser: UserProfile | null = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return {
    name: 'Anshu Rajput',
    email: 'demo@drone3d.ai',
    role: 'Lead GIS Specialist',
    organization: 'SIH Grand Finale Lab',
  };
})();

let stateViewerMode: ViewerMode = 'textured';
let stateSelectedObject: SceneObject | null = DEMO_SCENE_OBJECTS[0];
let stateMeasurements: MeasurementRecord[] = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INITIAL_MEASUREMENTS;
})();

let stateDamageZones: DamageZone[] = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DAMAGE_ZONES);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return DAMAGE_ZONES;
})();

let stateInspections: InspectionRecord[] = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return INSPECTION_RECORDS;
})();

let stateStages: ProcessingStage[] = PIPELINE_STAGES;
let stateProcessingStatus: 'idle' | 'running' | 'paused' | 'completed' = 'completed';

let stateUploadedVideo: UploadedVideoInfo | null = {
  name: 'DJI_0421_Jaipur_Heritage_4K.MP4',
  size: '4.2 GB',
  duration: '12:34',
  resolution: '3840×2160 (4K UHD)',
  fps: 30,
  codec: 'H.265 / HEVC',
  hasGPS: true,
  totalFrames: 22620,
  estProcessingTime: '04:28 min',
};

let stateFlightData: FlightDataInfo | null = {
  pointsCount: 1000,
  flightDistance: '12.4 km',
  maxAltitude: '122.4 m',
  avgSpeed: '7.5 m/s',
  flightDuration: '12m 34s',
  points: generateDemoFlightTrack(26.9124, 75.7873),
  fileName: 'JHS_2026_Flight_Telemetry_RTK.csv',
};

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const activeProject = useMemo(() => {
    return stateProjects.find((p) => p.id === stateActiveProjectId) || stateProjects[0] || DEFAULT_DEMO_PROJECT;
  }, []);

  const setActiveProject = useCallback((id: string) => {
    stateActiveProjectId = id;
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
    } catch {}
    notify();
  }, []);

  const addProject = useCallback((project: Project) => {
    stateProjects = [project, ...stateProjects];
    stateActiveProjectId = project.id;
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(stateProjects));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, project.id);
    } catch {}
    notify();
  }, []);

  const deleteProject = useCallback((id: string) => {
    if (stateProjects.length <= 1) return; // Keep at least one
    stateProjects = stateProjects.filter((p) => p.id !== id);
    if (stateActiveProjectId === id) {
      stateActiveProjectId = stateProjects[0].id;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(stateProjects));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, stateActiveProjectId);
    } catch {}
    notify();
  }, []);

  const duplicateProject = useCallback((id: string) => {
    const target = stateProjects.find((p) => p.id === id);
    if (!target) return;
    const duplicated: Project = {
      ...target,
      id: 'prj-' + Date.now(),
      name: `${target.name} (Copy)`,
      missionId: `${target.missionId}-COPY`,
      createdAt: new Date().toISOString(),
    };
    stateProjects = [duplicated, ...stateProjects];
    stateActiveProjectId = duplicated.id;
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(stateProjects));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, duplicated.id);
    } catch {}
    notify();
  }, []);

  const setViewerMode = useCallback((mode: ViewerMode) => {
    stateViewerMode = mode;
    notify();
  }, []);

  const setSelectedObject = useCallback((obj: SceneObject | null) => {
    stateSelectedObject = obj;
    notify();
  }, []);

  const addMeasurement = useCallback((item: MeasurementRecord) => {
    stateMeasurements = [item, ...stateMeasurements];
    try {
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(stateMeasurements));
    } catch {}
    notify();
  }, []);

  const removeMeasurement = useCallback((id: string) => {
    stateMeasurements = stateMeasurements.filter((m) => m.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(stateMeasurements));
    } catch {}
    notify();
  }, []);

  const updateDamageZoneStatus = useCallback((id: string, status: DamageZone['status']) => {
    stateDamageZones = stateDamageZones.map((z) => (z.id === id ? { ...z, status } : z));
    try {
      localStorage.setItem(STORAGE_KEYS.DAMAGE_ZONES, JSON.stringify(stateDamageZones));
    } catch {}
    notify();
  }, []);

  const updateInspectionStatus = useCallback((id: string, status: InspectionRecord['status']) => {
    stateInspections = stateInspections.map((i) => (i.id === id ? { ...i, status } : i));
    try {
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(stateInspections));
    } catch {}
    notify();
  }, []);

  const setUploadedVideo = useCallback((info: UploadedVideoInfo | null) => {
    stateUploadedVideo = info;
    notify();
  }, []);

  const setFlightData = useCallback((data: FlightDataInfo | null) => {
    stateFlightData = data;
    notify();
  }, []);

  const setProcessingStages = useCallback((stages: ProcessingStage[]) => {
    stateStages = stages;
    notify();
  }, []);

  const setProcessingStatus = useCallback((status: 'idle' | 'running' | 'paused' | 'completed') => {
    stateProcessingStatus = status;
    notify();
  }, []);

  const loginUser = useCallback((email: string) => {
    stateUser = {
      name: email.split('@')[0] || 'Demo Specialist',
      email,
      role: 'GIS & Reconstruction Lead',
      organization: 'SIH Grand Finale Lab',
    };
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(stateUser));
    } catch {}
    notify();
  }, []);

  const logoutUser = useCallback(() => {
    stateUser = null;
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {}
    notify();
  }, []);

  const resetToDefaultDemo = useCallback(() => {
    stateProjects = INITIAL_PROJECTS;
    stateActiveProjectId = DEFAULT_DEMO_PROJECT.id;
    stateStages = PIPELINE_STAGES;
    stateProcessingStatus = 'completed';
    stateMeasurements = INITIAL_MEASUREMENTS;
    stateDamageZones = DAMAGE_ZONES;
    stateInspections = INSPECTION_RECORDS;
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, DEFAULT_DEMO_PROJECT.id);
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(INITIAL_MEASUREMENTS));
      localStorage.setItem(STORAGE_KEYS.DAMAGE_ZONES, JSON.stringify(DAMAGE_ZONES));
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(INSPECTION_RECORDS));
    } catch {}
    notify();
  }, []);

  return {
    user: stateUser,
    projects: stateProjects,
    activeProject,
    processingStages: stateStages,
    processingStatus: stateProcessingStatus,
    uploadedVideo: stateUploadedVideo,
    flightData: stateFlightData,
    detections: AI_DETECTIONS,
    measurements: stateMeasurements,
    viewerMode: stateViewerMode,
    selectedObject: stateSelectedObject,
    damageZones: stateDamageZones,
    inspections: stateInspections,
    sceneObjects: DEMO_SCENE_OBJECTS,

    // Actions
    setActiveProject,
    addProject,
    deleteProject,
    duplicateProject,
    setViewerMode,
    setSelectedObject,
    addMeasurement,
    removeMeasurement,
    updateDamageZoneStatus,
    updateInspectionStatus,
    setUploadedVideo,
    setFlightData,
    setProcessingStages,
    setProcessingStatus,
    loginUser,
    logoutUser,
    resetToDefaultDemo,
  };
}
