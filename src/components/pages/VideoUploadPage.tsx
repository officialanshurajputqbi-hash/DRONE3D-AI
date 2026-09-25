import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  ArrowRight,
  Compass,
  Clock,
  Sparkles,
  Film,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AppPageId } from '../layout/Sidebar';

interface VideoUploadPageProps {
  onProceedToPipeline: () => void;
  onProceedToFlightData: () => void;
}

export const VideoUploadPage: React.FC<VideoUploadPageProps> = ({
  onProceedToPipeline,
  onProceedToFlightData,
}) => {
  const { uploadedVideo, setUploadedVideo, activeProject } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(uploadedVideo ? 100 : 0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateFileUpload = (file?: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');

    const fileName = file ? file.name : 'DJI_0421_Jaipur_Heritage_4K.MP4';
    const fileSize = file ? `${(file.size / (1024 * 1024 * 1024)).toFixed(1)} GB` : '4.2 GB';

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 10;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(100);

        setUploadedVideo({
          name: fileName,
          size: fileSize,
          duration: '12:34',
          resolution: '3840×2160 (4K UHD)',
          fps: 30,
          codec: 'H.265 / HEVC',
          hasGPS: true,
          totalFrames: 22620,
          estProcessingTime: '04:28 min',
          file,
        });
      } else {
        setUploadProgress(current);
      }
    }, 120);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['mp4', 'mov', 'avi'].includes(ext || '')) {
        setUploadError('Unsupported format. Please upload MP4, MOV, or AVI drone video.');
        return;
      }
      simulateFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['mp4', 'mov', 'avi'].includes(ext || '')) {
        setUploadError('Unsupported format. Please upload MP4, MOV, or AVI drone video.');
        return;
      }
      simulateFileUpload(file);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            Input Ingestion · Step 1
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Single-Pass Drone Video Ingestion
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload linear continuous aerial video. Hardware demuxers extract embedded telemetry and frames.
          </p>
        </div>

        <button
          onClick={() => simulateFileUpload()}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Demo 4K Video</span>
        </button>
      </div>

      {uploadError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
          isDragging
            ? 'border-blue-500 bg-blue-950/20'
            : 'border-slate-800 hover:border-blue-500/50 bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,.mov,.avi,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-white mb-1">
          Drag & Drop Drone Video File Here
        </h3>
        <p className="text-slate-400 max-w-sm mb-4 leading-relaxed">
          Supports 4K UHD and 1080p single-pass drone aerial recordings (.MP4, .MOV, .AVI). Max size: 10 GB.
        </p>

        <button
          type="button"
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-sm"
        >
          Browse Local Files
        </button>
      </div>

      {/* Upload Progress Bar if active */}
      {isUploading && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300">Demuxing 4K stream & parsing NMEA subtitle track...</span>
            <span className="font-mono text-cyan-400">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Uploaded Video Metadata Card & Automated Extraction Preview */}
      {uploadedVideo && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileVideo className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="font-bold text-white text-sm">{uploadedVideo.name}</h4>
                  <p className="text-slate-400 text-[11px] font-mono">
                    {uploadedVideo.size} · {uploadedVideo.codec} · {uploadedVideo.fps} FPS
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified & Ingested
              </span>
            </div>

            {/* Video Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Resolution</span>
                <p className="font-mono font-bold text-white mt-0.5">{uploadedVideo.resolution}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Flight Duration</span>
                <p className="font-mono font-bold text-white mt-0.5">{uploadedVideo.duration}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Total Stream Frames</span>
                <p className="font-mono font-bold text-cyan-400 mt-0.5">
                  {uploadedVideo.totalFrames.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Est. Processing</span>
                <p className="font-mono font-bold text-emerald-400 mt-0.5">{uploadedVideo.estProcessingTime}</p>
              </div>
            </div>

            {/* Extracted Frame Strips Preview */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-300 block mb-2">
                Sample Extracted Keyframes (Laplacian Variance &gt; 180)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'KF-001 (00:02)', alt: '118.2m AGL' },
                  { label: 'KF-048 (02:40)', alt: '119.5m AGL' },
                  { label: 'KF-112 (06:14)', alt: '120.4m AGL' },
                  { label: 'KF-184 (11:58)', alt: '118.0m AGL' },
                ].map((f, i) => (
                  <div
                    key={f.label}
                    className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between h-20 text-[10px]"
                  >
                    <div className="flex items-center justify-between text-slate-400 font-mono">
                      <span>{f.label}</span>
                      <Film className="w-3 h-3 text-cyan-400" />
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Altitude:</span>
                      <span className="font-mono text-cyan-400 font-bold">{f.alt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={onProceedToFlightData}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Inspect Flight Telemetry (GPS / IMU)</span>
            </button>

            <button
              onClick={onProceedToPipeline}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-md shadow-blue-500/25 flex items-center gap-2"
            >
              <span>Begin AI Reconstruction Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
