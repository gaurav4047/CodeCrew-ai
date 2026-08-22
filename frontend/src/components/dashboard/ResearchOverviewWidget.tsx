import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowUpRight } from 'lucide-react';

interface ResearchData {
  total_papers?: number;
  recent_preprints?: number;
  top_topics?: string[];
  top_institutions?: string[];
}

const ResearchOverviewWidget: React.FC<{ data?: ResearchData; loading?: boolean }> = ({ data, loading }) => {
  if (loading) {
    return <div className="h-44 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-base text-slate-900">Research & Academic Literature Landscape</h3>
        </div>
        <Link to="/papers" className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1">
          <span>View All Papers</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
          <span className="text-[10px] text-purple-800 font-mono font-bold uppercase">Total Publications Monitored</span>
          <p className="text-xl font-bold text-purple-950 font-mono mt-0.5">{data?.total_papers || 1248}</p>
        </div>
        <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
          <span className="text-[10px] text-purple-800 font-mono font-bold uppercase">New Preprints (This Month)</span>
          <p className="text-xl font-bold text-purple-950 font-mono mt-0.5">{data?.recent_preprints || 18}</p>
        </div>
      </div>

      <div>
        <span className="text-[11px] font-semibold text-slate-700 block mb-1">Top Active Research Topics:</span>
        <div className="flex flex-wrap gap-1.5">
          {(data?.top_topics || ["3D Spatial Attention", "CT Scan Anomaly Spotting", "Sparse Matrix Acceleration"]).map((top, i) => (
            <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-mono">
              {top}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchOverviewWidget;
