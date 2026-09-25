import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Activity,
  Box,
  ShieldCheck,
} from 'lucide-react';
import { useProcessing } from '../../hooks/useProcessing';
import { AppPageId } from '../layout/Sidebar';

interface PipelinePageProps {
  onNavigateToViewer: () => void;
}

export const PipelinePage: React.FC<PipelinePageProps> = ({ onNavigateToViewer }) => {
  const {
    stages,
    currentStageIndex,
    isRunning,
    isCompleted,
    formattedTime,
    overallAccuracy,
    coverage,
    densePoints,
    startProcessing,
    pauseProcessing,
    resumeProcessing,
    resetPipeline,
  } = useProcessing();

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            SIH26158 AI Engine
          </span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Automated 18-Stage Reconstruction Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sequential telemetry fusion, multi-view bundle adjustment, and metric surface meshing.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isRunning && !isCompleted && (
            <button
              onClick={startProcessing}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START PROCESSING</span>
            </button>
          )}

          {isRunning && (
            <button
              onClick={pauseProcessing}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center gap-2 transition-colors active:scale-95"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {!isRunning && !isCompleted && currentStageIndex > 0 && (
            <button
              onClick={resumeProcessing}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 transition-colors active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume</span>
            </button>
          )}

          <button
            onClick={resetPipeline}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-colors"
            title="Fast-forward / Complete Demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Fast Complete</span>
          </button>

          {isCompleted && (
            <button
              onClick={onNavigateToViewer}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <Box className="w-4 h-4" />
              <span>Open 3D Model</span>
            </button>
          )}
        </div>
      </div>

      {/* Pipeline Status Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Pipeline Status</span>
          <p className="font-mono text-base sm:text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
            {isRunning ? (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span className="text-blue-400">Processing Stage {currentStageIndex + 1}/18</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Reconstruction Complete</span>
              </>
            ) : (
              <span className="text-slate-400">Standby</span>
            )}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Processing Time</span>
          <p className="font-mono text-base sm:text-lg font-bold text-cyan-400 mt-0.5">
            {formattedTime}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Overall Accuracy</span>
          <p className="font-mono text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
            {overallAccuracy}%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Surface Coverage</span>
          <p className="font-mono text-base sm:text-lg font-bold text-white mt-0.5">
            {coverage}%
          </p>
        </div>
      </div>

      {/* Step by Step Timeline List */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Pipeline Execution Timeline
          </h3>
          <span className="font-mono text-[11px] text-slate-400">
            18 Steps · SuperPoint + LightGlue + MVS
          </span>
        </div>

        <div className="space-y-2.5">
          {stages.map((stage, idx) => {
            const isCurrent = idx === currentStageIndex && isRunning;
            const isDone = stage.status === 'completed';

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-950/30 border-blue-500/80 shadow-md shadow-blue-500/10'
                    : isDone
                    ? 'bg-slate-950/40 border-slate-800/80'
                    : 'bg-slate-950/20 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isCurrent
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : stage.stepNumber}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-100 text-xs flex items-center gap-2">
                        <span>{stage.name}</span>
                        {isDone && (
                          <span className="text-[10px] font-mono font-normal text-emerald-400">
                            (Confidence: {stage.confidence}%)
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400">{stage.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right shrink-0">
                    <span className="font-mono text-[11px] text-slate-400">{stage.duration}</span>
                    <span
                      className={`font-mono text-xs font-bold min-w-[3rem] ${
                        isDone
                          ? 'text-emerald-400'
                          : isCurrent
                          ? 'text-blue-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-150 ${
                      isDone
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-400'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>

                {/* Micro Input/Output Details */}
                <div className="flex flex-col sm:flex-row justify-between text-[10px] text-slate-400 pt-1 font-mono gap-1">
                  <div>
                    <span className="text-slate-500">IN:</span> {stage.input}
                  </div>
                  <div>
                    <span className="text-slate-500">OUT:</span> {stage.output}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
