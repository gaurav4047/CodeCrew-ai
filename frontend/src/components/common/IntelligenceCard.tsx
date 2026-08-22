import React from 'react';
import { StatusBadge } from './StatusBadge';
import { ConfidenceBadge } from './ConfidenceBadge';
import { FactInferenceBadge } from './FactInferenceBadge';
import { SourceBadge } from './SourceBadge';
import { ExternalLink, Layers, ArrowUpRight } from 'lucide-react';

export interface IntelligenceCardProps {
  id?: string | number;
  type?: string;
  severity?: string;
  title: string;
  summary: string;
  impact?: string;
  confidence?: number | string;
  evidenceCount?: number | string;
  source?: string;
  sourceUrl?: string;
  date?: string;
  isFact?: boolean;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const IntelligenceCard: React.FC<IntelligenceCardProps> = ({
  severity,
  title,
  summary,
  impact,
  confidence,
  evidenceCount,
  source,
  sourceUrl,
  date,
  isFact,
  actionText = 'View Details',
  onAction,
  className = ''
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between ${className}`}>
      <div className="space-y-2.5">
        {/* Header Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {severity && <StatusBadge status={severity} />}
            <FactInferenceBadge isFact={isFact} />
          </div>
          {date && <span className="text-xs text-slate-400 font-mono">{date}</span>}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 leading-snug hover:text-indigo-600 transition-colors">
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
              <span>{title}</span>
              <ExternalLink className="w-4 h-4 text-indigo-600 shrink-0 inline" />
            </a>
          ) : (
            <span>{title}</span>
          )}
        </h3>

        {/* Short Summary */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-sans">
          {summary}
        </p>

        {/* Cleanly Spaced Metadata Row (Impact, Confidence, Evidence) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 min-w-0 text-xs">
          {impact && (
            <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium border border-slate-200">
              Impact: <strong className="text-slate-900 font-semibold">{impact}</strong>
            </span>
          )}
          {confidence !== undefined && <ConfidenceBadge score={confidence} />}
          {evidenceCount !== undefined && (
            <span className="bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold border border-indigo-100 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{evidenceCount} Evidence Sources</span>
            </span>
          )}
          {source && <SourceBadge source={source} />}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono text-[11px]">Intelligence Record</span>
        {onAction ? (
          <button
            onClick={onAction}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
          >
            <span>{actionText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        ) : sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
          >
            <span>{actionText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
};
