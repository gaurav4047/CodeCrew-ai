import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface TrendItem {
  topic: string;
  direction: string;
  growth: string;
  category: string;
  papers: number;
  patents: number;
  competitors: number;
}

const TrendRadarWidget: React.FC<{ items?: TrendItem[]; loading?: boolean }> = ({ items, loading }) => {
  if (loading) {
    return <div className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const list = items || [
    { topic: "3D Spatial Attention Radiology", direction: "up", growth: "+142% MoM", category: "Emerging", papers: 18, patents: 6, competitors: 4 },
    { topic: "Neuromorphic Memory Interconnects", direction: "up", growth: "+88% MoM", category: "Growing", papers: 14, patents: 12, competitors: 7 },
    { topic: "FP4 Low-Precision Matrix Acceleration", direction: "stable", growth: "+35% MoM", category: "Stable", papers: 24, patents: 15, competitors: 9 }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900">Emerging Technology Trend Radar</h3>
        </div>
        <Link to="/trends" className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1">
          <span>View Trend Radar</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {list.map((t, idx) => (
          <div key={idx} className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900">{t.topic}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-bold">
                  {t.category}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                Papers: {t.papers} • Patents: {t.patents} • Rivals: {t.competitors}
              </span>
            </div>

            <span className="text-sm font-bold text-emerald-600 font-mono shrink-0 flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-0.5" />
              {t.growth}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendRadarWidget;
