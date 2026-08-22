import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowUpRight } from 'lucide-react';

interface TrackingItem {
  id: number;
  name: string;
  type: string;
  interval: string;
  active: boolean;
}

const TrackingOverviewWidget: React.FC<{ items?: TrackingItem[]; loading?: boolean }> = ({ items, loading }) => {
  if (loading) {
    return <div className="h-44 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const list = items || [
    { id: 1, name: "AI Medical Diagnosis & Imaging Patents", type: "research_and_patents", interval: "60 mins", active: true },
    { id: 2, name: "Quantum Computing & Chipmakers", type: "competitors_and_news", interval: "30 mins", active: true }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900">Active Monitoring & Tracking Targets</h3>
        </div>
        <Link to="/tracking" className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1">
          <span>Manage Tracking</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2">
        {list.map((t) => (
          <div key={t.id} className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">{t.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">Interval: {t.interval} • Active Sync</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded">
              Running
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingOverviewWidget;
