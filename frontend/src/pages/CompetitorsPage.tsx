import React from 'react';
import { Building2, Globe, TrendingUp, Layers, Cpu } from 'lucide-react';
import { SourceBadge } from '../components/common/SourceBadge';

const CompetitorsPage: React.FC = () => {
  const competitors = [
    {
      name: 'Nvidia Corporation',
      website: 'https://nvidia.com',
      industry: 'Semiconductors & AI Hardware',
      products: ['Blackwell B200 GPU', 'DGX SuperPOD', 'CUDA-X AI Software'],
      technology: 'FP4 Tensor Cores, Sparse Matrix Accelerators, NVLink 5',
      market_cap: '$3.2 Trillion',
      patent_count: 1420,
      recent_activity: 'Filed FP4 Sparse Matrix Patent US20260191A1; Announced DGX SuperPOD deployment for clinical health labs.'
    },
    {
      name: 'MedAI Global Health Ltd.',
      website: 'https://medai-health.org',
      industry: 'AI Medical Diagnostics & Medical Imaging',
      products: ['RadiologyVision 3D', 'CardioDetect AI', 'PathoScan Net'],
      technology: '3D Spatial Attention Transformers, Federated Learning',
      market_cap: '$450 Million (Series C)',
      patent_count: 84,
      recent_activity: 'Published 12,000-case CT diagnostic sensitivity paper in arXiv; Granted US20260844B2 diagnostic patent.'
    },
    {
      name: 'Quantum Interconnect Systems',
      website: 'https://quantum-interconnect.io',
      industry: 'Quantum Computing & Microelectronics',
      products: ['Qubit-Bridge 4', 'Neuromorphic Interconnect 3D'],
      technology: 'Silicon Interposers, Cryogenic Logic Gates',
      market_cap: '$280 Million (Series B)',
      patent_count: 38,
      recent_activity: 'Submitted EP4029112A1 patent application for low-latency cryogenic interconnects.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-600" />
            Competitor Intelligence & Profiles
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Corporate Metrics • Product Pipelines • IP Strategy • Strategic Moves
          </p>
        </div>
        <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-mono font-medium">
          {competitors.length} Active Competitors Monitored
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {competitors.map((comp, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{comp.name}</h3>
                  <p className="text-xs text-amber-700 font-medium">{comp.industry}</p>
                </div>
                <a
                  href={comp.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                  title="Visit Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>

              <div className="mt-3 space-y-2.5 text-xs text-slate-700">
                <div>
                  <span className="font-semibold text-slate-900 flex items-center gap-1 mb-1">
                    <Layers className="w-3.5 h-3.5 text-amber-600" /> Key Products:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {comp.products.map((prod, i) => (
                      <span key={i} className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200/80 font-mono text-[11px]">
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-900 flex items-center gap-1 mb-1">
                    <Cpu className="w-3.5 h-3.5 text-amber-600" /> Technology Stack:
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100 font-sans">
                    {comp.technology}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-900 flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Monitored Activity:
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-emerald-50/50 p-2 rounded-xl border border-emerald-100 text-emerald-950 font-sans">
                    {comp.recent_activity}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Valuation: <strong className="text-slate-900">{comp.market_cap}</strong></span>
              <SourceBadge source={`Patents: ${comp.patent_count}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorsPage;
