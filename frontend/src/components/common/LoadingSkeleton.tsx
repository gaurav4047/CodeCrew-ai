import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 3, height = 'h-32', className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`bg-slate-200/80 rounded-2xl animate-pulse ${height} w-full`} />
      ))}
    </div>
  );
};
