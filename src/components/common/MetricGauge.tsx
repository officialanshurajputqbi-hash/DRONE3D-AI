import React from 'react';

interface MetricGaugeProps {
  value: number;
  label: string;
  unit?: string;
  color?: string;
  max?: number;
  sublabel?: string;
  size?: number;
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({
  value,
  label,
  unit = '%',
  color = '#10B981',
  max = 100,
  sublabel,
  size = 130,
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(148, 163, 184, 0.12)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>

        {/* Central Metric Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
            {value.toFixed(1)}
            <span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span>
          </span>
          {sublabel && (
            <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      <span className="mt-2 text-xs font-medium text-slate-300 tracking-wide text-balance">
        {label}
      </span>
    </div>
  );
};
