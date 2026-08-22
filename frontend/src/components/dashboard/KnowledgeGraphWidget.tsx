import React from 'react';
import { Link } from 'react-router-dom';
import { Network, ArrowUpRight } from 'lucide-react';

interface KnowledgeGraphData {
  entities_count?: number;
  relationships_count?: number;
  new_connections?: number;
  last_updated?: string;
}

const KnowledgeGraphWidget: React.FC<{ data?: KnowledgeGraphData; loading?: boolean }> = ({ data, loading }) => {
  if (loading) {
    return <div className="h-36 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide font-mono text-cyan-300 uppercase">
            KNOWLEDGE GRAPH SUMMARY
          </h3>
        </div>
        <Link to="/graph" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-medium flex items-center gap-1">
          <span>Open Knowledge Graph</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <span className="text-cyan-400 font-bold text-base block">{data?.entities_count || 6}</span>
          <span className="text-[10px] text-slate-400 uppercase">Entities</span>
        </div>
        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <span className="text-purple-400 font-bold text-base block">{data?.relationships_count || 4}</span>
          <span className="text-[10px] text-slate-400 uppercase">Relationships</span>
        </div>
        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
          <span className="text-emerald-400 font-bold text-base block">+{data?.new_connections || 2}</span>
          <span className="text-[10px] text-slate-400 uppercase">New Links</span>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphWidget;
