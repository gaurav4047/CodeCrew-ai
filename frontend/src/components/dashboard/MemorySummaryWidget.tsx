import React from 'react';
import { Brain, CheckCircle2 } from 'lucide-react';

interface MemoryData {
  status?: string;
  active_topics_count?: number;
  retention_turns?: number;
  last_update?: string;
}

const MemorySummaryWidget: React.FC<{ data?: MemoryData; loading?: boolean }> = ({ data, loading }) => {
  if (loading) {
    return <div className="h-36 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide font-mono text-purple-300 uppercase">
            AI AGENT MEMORY ENGINE STATUS
          </h3>
        </div>
        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono border border-purple-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {data?.status || 'Active'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Active Topics</span>
          <p className="text-base font-bold text-purple-300 mt-0.5">{data?.active_topics_count || 1} Topic</p>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Retention Context</span>
          <p className="text-base font-bold text-cyan-300 mt-0.5">{data?.retention_turns || 10} Turns</p>
        </div>
      </div>
    </div>
  );
};

export default MemorySummaryWidget;
