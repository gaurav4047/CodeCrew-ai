import React from 'react';
import { CheckCircle2, Brain, Sparkles, MessageSquare } from 'lucide-react';

interface FactInferenceBadgeProps {
  type?: 'fact' | 'inference' | 'recommendation' | 'signal' | string;
  isFact?: boolean;
  className?: string;
}

export const FactInferenceBadge: React.FC<FactInferenceBadgeProps> = ({ type, isFact, className = '' }) => {
  const normType = isFact ? 'fact' : (type || 'fact').toLowerCase();

  switch (normType) {
    case 'fact':
    case 'verified_fact':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
          <span>Verified Fact</span>
        </span>
      );
    case 'inference':
    case 'ai_inference':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 ${className}`}>
          <Brain className="w-3 h-3 text-indigo-700 shrink-0" />
          <span>AI Inference</span>
        </span>
      );
    case 'recommendation':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-100 text-cyan-900 border border-cyan-300 ${className}`}>
          <Sparkles className="w-3 h-3 text-cyan-700 shrink-0" />
          <span>Recommendation</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 ${className}`}>
          <MessageSquare className="w-3 h-3 text-amber-700 shrink-0" />
          <span>Public Signal</span>
        </span>
      );
  }
};
