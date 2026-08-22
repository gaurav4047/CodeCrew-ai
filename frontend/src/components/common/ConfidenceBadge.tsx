import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ConfidenceBadgeProps {
  score: number | string;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, className = '' }) => {
  const formattedScore = typeof score === 'number' ? `${score}%` : score.includes('%') ? score : `${score}%`;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap ${className}`}
    >
      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
      <span>Confidence: {formattedScore}</span>
    </span>
  );
};
