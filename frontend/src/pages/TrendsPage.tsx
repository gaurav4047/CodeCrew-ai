import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

const TrendsPage: React.FC = () => {
  const trends = [
    {
      category: 'Emerging',
      severity: 'high',
      topic: '3D Spatial Attention in Radiology',
      growth: '+142% MoM',
      papers: 18,
      patents: 6,
      competitors: 4,
      summary: 'Rapid adoption of multi-modal attention transformers across automated CT & MRI diagnostic radiology systems.'
    },
    {
      category: 'Growing',
      severity: 'medium',
      topic: 'Neuromorphic Microchip Memory Interconnects',
      growth: '+88% MoM',
      papers: 14,
      patents: 12,
      competitors: 7,
      summary: 'High patent filing activity around sub-nanosecond cryogenic interposers for AI edge compute.'
    },
    {
      category: 'Stable',
      severity: 'low',
      topic: 'FP4 Low-Precision LLM Inference',
      growth: '+35% MoM',
      papers: 24,
      patents: 15,
      competitors: 9,
      summary: 'Consolidation of tensor core architecture standards across enterprise datacenters.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            Technology Trend Radar & Trajectories
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Emerging • Growing • Stable • Declining Trajectory Metrics
          </p>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-mono font-medium">
          Trend Trajectory Engine Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trends.map((t, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <StatusBadge status={t.category} />
                <span className="text-sm font-bold text-emerald-600 font-mono flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-0.5" />
                  {t.growth}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 mt-3">{t.topic}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-sans">
                {t.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-purple-50 p-2 rounded-xl border border-purple-100">
                <span className="text-purple-700 font-bold block text-sm">{t.papers}</span>
                <span className="text-[10px] text-slate-500">Papers</span>
              </div>
              <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100">
                <span className="text-indigo-700 font-bold block text-sm">{t.patents}</span>
                <span className="text-[10px] text-slate-500">Patents</span>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                <span className="text-amber-700 font-bold block text-sm">{t.competitors}</span>
                <span className="text-[10px] text-slate-500">Rivals</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendsPage;
