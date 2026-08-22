import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowUpRight } from 'lucide-react';

interface CompetitorItem {
  name: string;
  activity: string;
  status: string;
  recent: string;
}

const CompetitorOverviewWidget: React.FC<{ items?: CompetitorItem[]; loading?: boolean }> = ({ items, loading }) => {
  if (loading) {
    return <div className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const list = items || [
    { name: "Nvidia Corporation", activity: "High Activity", status: "active_moves", recent: "Filed Sparse Matrix Patent US20260191A1" },
    { name: "MedAI Global Health", activity: "Moderate Activity", status: "research_leader", recent: "Published 12k CT scan diagnostic arXiv paper" },
    { name: "Quantum Interconnect Systems", activity: "Emerging Rival", status: "patent_filing", recent: "EP4029112A1 Cryo-Logic Interconnect claim" }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-base text-slate-900">Competitor Intelligence Overview</h3>
        </div>
        <Link to="/competitors" className="text-xs text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1">
          <span>View Competitors</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {list.map((comp, idx) => (
          <div key={idx} className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{comp.name}</span>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                {comp.activity}
              </span>
            </div>
            <p className="text-xs text-slate-600">{comp.recent}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorOverviewWidget;
