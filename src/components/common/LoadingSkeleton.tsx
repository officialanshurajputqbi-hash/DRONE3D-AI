import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-full rounded-lg bg-slate-800/50 animate-pulse border border-slate-800"
        />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-5 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse space-y-4 ${className}`}>
      <div className="h-4 w-1/3 bg-slate-800 rounded" />
      <div className="h-8 w-1/2 bg-slate-800 rounded" />
      <div className="h-3 w-3/4 bg-slate-800 rounded" />
    </div>
  );
};
