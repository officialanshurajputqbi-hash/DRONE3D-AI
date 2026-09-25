import { useState, useEffect, useRef, useCallback } from 'react';
import { ProcessingStage } from '../types';
import { PIPELINE_STAGES } from '../data/mockData';
import { useStore } from '../store/useStore';

export function useProcessing() {
  const { setProcessingStages: saveGlobalStages, setProcessingStatus: saveGlobalStatus } = useStore();

  const [stages, setStages] = useState<ProcessingStage[]>(() => {
    return PIPELINE_STAGES.map((s) => ({ ...s }));
  });
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(268); // default to 04:28
  const [isCompleted, setIsCompleted] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stageTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Format elapsed seconds to MM:SS
  const formatTime = useCallback((totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Sync to global store when stages change
  useEffect(() => {
    saveGlobalStages(stages);
  }, [stages, saveGlobalStages]);

  // Elapsed timer ticker
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Pipeline execution logic
  const startProcessing = useCallback(() => {
    // Reset all stages to pending
    const initial = PIPELINE_STAGES.map((s, idx) => ({
      ...s,
      status: (idx === 0 ? 'processing' : 'pending') as ProcessingStage['status'],
      progress: idx === 0 ? 5 : 0,
    }));
    setStages(initial);
    setCurrentStageIndex(0);
    setIsRunning(true);
    setIsCompleted(false);
    setElapsedSeconds(0);
    saveGlobalStatus('running');
  }, [saveGlobalStatus]);

  const pauseProcessing = useCallback(() => {
    setIsRunning(false);
    saveGlobalStatus('paused');
  }, [saveGlobalStatus]);

  const resumeProcessing = useCallback(() => {
    setIsRunning(true);
    saveGlobalStatus('running');
  }, [saveGlobalStatus]);

  const resetPipeline = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    const finished = PIPELINE_STAGES.map((s) => ({
      ...s,
      status: 'completed' as const,
      progress: 100,
    }));
    setStages(finished);
    setCurrentStageIndex(PIPELINE_STAGES.length - 1);
    setIsRunning(false);
    setIsCompleted(true);
    setElapsedSeconds(268);
    saveGlobalStatus('completed');
  }, [saveGlobalStatus]);

  // Simulation stepper
  useEffect(() => {
    if (!isRunning || currentStageIndex < 0 || currentStageIndex >= stages.length) {
      return;
    }

    const currentStage = stages[currentStageIndex];
    if (currentStage.status === 'completed') {
      // Advance to next stage
      if (currentStageIndex + 1 < stages.length) {
        const nextIndex = currentStageIndex + 1;
        setStages((prev) =>
          prev.map((s, idx) =>
            idx === nextIndex ? { ...s, status: 'processing', progress: 5 } : s
          )
        );
        setCurrentStageIndex(nextIndex);
      } else {
        // All stages done
        setIsRunning(false);
        setIsCompleted(true);
        saveGlobalStatus('completed');
      }
      return;
    }

    // Step progress inside active stage
    const interval = setInterval(() => {
      setStages((prev) => {
        const updated = [...prev];
        const active = { ...updated[currentStageIndex] };

        // Faster progress step for responsive demo feel (~1.2 - 2.5s per stage)
        const increment = Math.floor(Math.random() * 14) + 12;
        const newProgress = Math.min(100, active.progress + increment);
        active.progress = newProgress;

        if (newProgress >= 100) {
          active.status = 'completed';
          clearInterval(interval);
        }

        updated[currentStageIndex] = active;
        return updated;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isRunning, currentStageIndex, stages, saveGlobalStatus]);

  return {
    stages,
    currentStageIndex,
    isRunning,
    isCompleted,
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    activeStage: currentStageIndex >= 0 && currentStageIndex < stages.length ? stages[currentStageIndex] : null,
    overallAccuracy: 96.8,
    coverage: 94.7,
    densePoints: '2.84M',
    startProcessing,
    pauseProcessing,
    resumeProcessing,
    resetPipeline,
  };
}
