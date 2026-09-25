import React, { useState } from 'react';
import {
  PlusCircle,
  UploadCloud,
  Compass,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AppPageId } from '../layout/Sidebar';
import { Project } from '../../types';

interface NewProjectPageProps {
  onProjectCreated: (page: AppPageId) => void;
}

export const NewProjectPage: React.FC<NewProjectPageProps> = ({ onProjectCreated }) => {
  const { addProject } = useStore();

  const [name, setName] = useState('');
  const [missionId, setMissionId] = useState(`MSN-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('26.9124');
  const [longitude, setLongitude] = useState('75.7873');
  const [droneModel, setDroneModel] = useState('DJI Matrice 350 RTK');
  const [cameraModel, setCameraModel] = useState('Zenmuse P1');
  const [videoResolution, setVideoResolution] = useState('4K (3840×2160)');
  const [flightDate, setFlightDate] = useState('2026-09-25');
  const [flightAltitude, setFlightAltitude] = useState('120');
  const [flightSpeed, setFlightSpeed] = useState('7.5');
  const [coordinateSystem, setCoordinateSystem] = useState('WGS 84 / UTM Zone 43N');

  // Optional sensor inputs
  const [imuEnabled, setImuEnabled] = useState(true);
  const [baroEnabled, setBaroEnabled] = useState(true);
  const [rtkEnabled, setRtkEnabled] = useState(true);
  const [cameraIntrinsicsEnabled, setCameraIntrinsicsEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: Project = {
      id: `prj-${Date.now()}`,
      name: name.trim(),
      missionId: missionId.trim(),
      location: location.trim() || 'Survey Site, India',
      coordinates: {
        lat: parseFloat(latitude) || 26.9124,
        lng: parseFloat(longitude) || 75.7873,
      },
      droneModel,
      cameraModel,
      videoResolution,
      flightDate,
      flightAltitude: parseFloat(flightAltitude) || 100,
      flightSpeed: parseFloat(flightSpeed) || 8.0,
      coordinateSystem,
      imuEnabled,
      baroEnabled,
      rtkEnabled,
      accuracy: 96.8,
      mappedArea: 2.84,
      status: 'queued',
      createdAt: new Date().toISOString(),
      modelStats: {
        vertices: '2.84M',
        faces: '5.62M',
        pointDensity: '428 pts/m²',
        reprojectionError: '0.82 px',
        fileSize: '284 MB',
        coverage: '94.7%',
      },
    };

    addProject(newProject);
    onProjectCreated('upload-video');
  };

  const loadHeritagePreset = () => {
    setName('Udaipur Lakefront Heritage Inspection');
    setLocation('Udaipur, Rajasthan, India');
    setLatitude('24.5854');
    setLongitude('73.7125');
    setMissionId('UDZ-2026-004');
    setDroneModel('DJI Matrice 350 RTK');
    setCameraModel('Zenmuse P1');
    setFlightAltitude('115');
    setFlightSpeed('7.0');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            SIH26158 Project Configuration
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            New Reconstruction Project
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure single-pass drone mission parameters, coordinate systems, and sensor fusion flags.
          </p>
        </div>

        <button
          type="button"
          onClick={loadHeritagePreset}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Preset</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Mandatory Project Identifiers */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
            <Compass className="w-4 h-4" />
            <span>1. Mandatory Project Information & Georeference</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jaipur Heritage Survey"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Mission ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={missionId}
                onChange={(e) => setMissionId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Location Description</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Jaipur, Rajasthan, India"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Latitude (WGS 84) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Longitude (WGS 84) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Coordinate System</label>
              <select
                value={coordinateSystem}
                onChange={(e) => setCoordinateSystem(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option>WGS 84 / UTM Zone 43N</option>
                <option>WGS 84 / UTM Zone 44N</option>
                <option>EPSG:4326 (Geographic Lat/Long)</option>
                <option>EPSG:3857 (Web Mercator)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Flight Date</label>
              <input
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Mandatory Drone & Camera Specifications */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800">
            <Layers className="w-4 h-4" />
            <span>2. Drone Platform & Aerial Sensor Specs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Drone Platform</label>
              <select
                value={droneModel}
                onChange={(e) => setDroneModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option>DJI Matrice 350 RTK</option>
                <option>DJI Matrice 300 RTK</option>
                <option>DJI Mavic 3 Enterprise</option>
                <option>Autel EVO II Pro RTK</option>
                <option>Custom Fixed-Wing VTOL</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Camera Payload</label>
              <select
                value={cameraModel}
                onChange={(e) => setCameraModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option>Zenmuse P1 (45MP Full-Frame)</option>
                <option>Zenmuse H20T Hybrid</option>
                <option>Hasselblad L2D-20c</option>
                <option>Sony Alpha 7R IV (Airborne)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Video Stream Quality</label>
              <select
                value={videoResolution}
                onChange={(e) => setVideoResolution(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option>4K (3840×2160) @ 30 FPS</option>
                <option>4K (3840×2160) @ 60 FPS</option>
                <option>1080p (1920×1080) @ 60 FPS</option>
                <option>1080p (1920×1080) @ 30 FPS</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Altitude (m AGL)</label>
              <input
                type="number"
                value={flightAltitude}
                onChange={(e) => setFlightAltitude(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Optional Sensor Fusion Parameters (as defined in SIH Brief) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4" />
              <span>3. Optional Sensor Fusion Modules (Problem Statement Specs)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Real-Time EKF Fusion</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Per SIH 26158 guidelines, video and GPS are mandatory. Enabling additional telemetry feeds improves absolute metric scale and reduces drift.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={imuEnabled}
                onChange={(e) => setImuEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 mt-0.5"
              />
              <div>
                <p className="font-semibold text-slate-200">IMU Angular Velocity & Attitude</p>
                <p className="text-[11px] text-slate-400 mt-0.5">High-rate gyro/accelerometer data to constrain visual odometry rotation.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={baroEnabled}
                onChange={(e) => setBaroEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 mt-0.5"
              />
              <div>
                <p className="font-semibold text-slate-200">Barometric Altitude Sensor</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Corrects vertical GNSS DOP uncertainty for sub-decimeter Z height accuracy.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={cameraIntrinsicsEnabled}
                onChange={(e) => setCameraIntrinsicsEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 mt-0.5"
              />
              <div>
                <p className="font-semibold text-slate-200">Camera Intrinsic Parameters</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Focal length, principal point, and radial distortion coefficients (k1, k2, p1, p2).</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={rtkEnabled}
                onChange={(e) => setRtkEnabled(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 mt-0.5"
              />
              <div>
                <p className="font-semibold text-slate-200">RTK / PPK Corrections</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Carrier-phase differential GNSS logging for sub-centimeter positional accuracy.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 active:scale-95"
          >
            <span>Create Project & Upload Video</span>
            <UploadCloud className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
