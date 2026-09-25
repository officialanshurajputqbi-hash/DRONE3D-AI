export type ProjectStatus = 'completed' | 'processing' | 'queued' | 'urgent';

export interface ProjectCoordinates {
  lat: number;
  lng: number;
}

export interface ModelStats {
  vertices: string;
  faces: string;
  pointDensity: string;
  reprojectionError: string;
  fileSize: string;
  coverage: string;
}

export interface Project {
  id: string;
  name: string;
  missionId: string;
  location: string;
  coordinates: ProjectCoordinates;
  droneModel: string;
  cameraModel: string;
  videoResolution: string;
  flightDate: string;
  flightAltitude: number;
  flightSpeed: number;
  coordinateSystem: string;
  imuEnabled: boolean;
  baroEnabled: boolean;
  rtkEnabled: boolean;
  accuracy: number;
  mappedArea: number; // in km²
  status: ProjectStatus;
  createdAt: string;
  processingTime?: string;
  modelStats: ModelStats;
  thumbnail?: string;
}

export type StageStatus = 'pending' | 'processing' | 'completed' | 'warning' | 'failed';

export interface ProcessingStage {
  id: string;
  stepNumber: number;
  name: string;
  description: string;
  status: StageStatus;
  progress: number;
  duration: string;
  confidence: number;
  input: string;
  output: string;
}

export type ViewerMode = 'textured' | 'solid' | 'wireframe' | 'pointcloud';

export interface SceneObject {
  id: string;
  name: string;
  category: 'building' | 'road' | 'vegetation' | 'infrastructure' | 'terrain';
  height: number;
  area: number;
  volume: number;
  coordinates: ProjectCoordinates;
  condition: 'Normal' | 'Minor Wear' | 'Defect Flagged' | 'Severe Damage';
  inspectionStatus: 'Inspected' | 'Pending Review' | 'Flagged';
  floors?: number;
  roofType?: string;
}

export type MeasurementType = 'distance' | 'height' | 'area' | 'volume' | 'elevation' | 'slope';

export interface MeasurementRecord {
  id: string;
  type: MeasurementType;
  value: number;
  unit: string;
  accuracy: string;
  timestamp: string;
  label: string;
}

export interface AIDetectionItem {
  id: string;
  category: string;
  count: number | string;
  confidence: number;
  type: 'static' | 'dynamic' | 'anomaly' | 'infrastructure';
  status: string;
  detail: string;
  color: string;
}

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface DamageZone {
  id: string;
  zone: string;
  priority: PriorityLevel;
  damageLevel: string;
  accessStatus: 'Blocked' | 'Partial' | 'Open';
  status: 'Open' | 'Investigating' | 'Resolved';
  coordinates: ProjectCoordinates;
  description: string;
}

export interface InspectionRecord {
  id: string;
  objectName: string;
  issue: string;
  severity: PriorityLevel;
  confidence: number;
  status: 'Open' | 'Review' | 'Resolved';
  dimensions: string;
  date: string;
  locationDetails: string;
}

export interface TelemetryPoint {
  index: number;
  time: string;
  lat: number;
  lng: number;
  alt: number;
  speed: number;
  yaw: number;
  pitch: number;
  roll: number;
}
