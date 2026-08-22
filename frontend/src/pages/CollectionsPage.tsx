import React from 'react';
import { Bookmark, ExternalLink } from 'lucide-react';

const CollectionsPage: React.FC = () => {
  const bookmarks = [
    {
      type: 'Research Paper',
      title: '3D Spatial Attention Transformers for Multi-Modal Automated CT Imaging',
      source: 'arXiv / PubMed',
      saved_at: '2026-08-22',
      url: 'https://arxiv.org/abs/2026-medical-ai'
    },
    {
      type: 'Patent Claim',
      title: 'Scalable Low-Latency Neuromorphic Memory Interconnects (US20260191A1)',
      source: 'USPTO / Google Patents',
      saved_at: '2026-08-21',
      url: 'https://patents.google.com/patent/US20260191A1/en'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-purple-600" />
            Bookmarked Collections & Saved Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Saved Papers • Priority Patents • Competitor Profiles • Bookmarked Insights
          </p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-mono font-medium">
          {bookmarks.length} Bookmarks Saved
        </span>
      </div>

      <div className="space-y-3">
        {bookmarks.map((bm, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100 shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                  {bm.type}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{bm.title}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Source: {bm.source} • Saved: {bm.saved_at}</p>
              </div>
            </div>

            <a
              href={bm.url}
              target="_blank"
              rel="noreferrer"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1 shrink-0 self-end sm:self-center"
            >
              <span>View Resource</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
