import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, ArrowUpRight } from 'lucide-react';

interface PatentData {
  total_monitored?: number;
  recent_filings?: number;
  top_assignees?: string[];
  technology_clusters?: string[];
}

const PatentLandscapeWidget: React.FC<{ data?: PatentData; loading?: boolean }> = ({ data, loading }) => {
  if (loading) {
    return <div className="h-44 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-base text-slate-900">Patent & IP Intelligence Landscape</h3>
        </div>
        <Link to="/patents" className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
          <span>View Patents</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
          <span className="text-[10px] text-indigo-800 font-mono font-bold uppercase">Patents Monitored</span>
          <p className="text-xl font-bold text-indigo-950 font-mono mt-0.5">{data?.total_monitored || 28}</p>
        </div>
        <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
          <span className="text-[10px] text-indigo-800 font-mono font-bold uppercase">Recent Filings</span>
          <p className="text-xl font-bold text-indigo-950 font-mono mt-0.5">{data?.recent_filings || 3}</p>
        </div>
      </div>

      <div>
        <span className="text-[11px] font-semibold text-slate-700 block mb-1">Top Active Assignees:</span>
        <div className="flex flex-wrap gap-1.5">
          {(data?.top_assignees || ["Interconnect Tech", "MedAI Global", "Nvidia Corp"]).map((top, i) => (
            <span key={i} className="bg-indigo-50 text-indigo-900 text-xs px-2.5 py-1 rounded-lg font-mono border border-indigo-100">
              {top}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatentLandscapeWidget;
