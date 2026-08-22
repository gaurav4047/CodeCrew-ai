import React from 'react';

interface SourceBadgeProps {
  source: string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
      Source: {source}
    </span>
  );
};
