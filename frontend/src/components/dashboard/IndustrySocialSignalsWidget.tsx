import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowUpRight } from 'lucide-react';

interface SignalItem {
  topic: string;
  source: string;
  sentiment: string;
  mentions: string;
  is_verified_fact: boolean;
}

const IndustrySocialSignalsWidget: React.FC<{ items?: SignalItem[]; loading?: boolean }> = ({ items, loading }) => {
  if (loading) {
    return <div className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const list = items || [
    { topic: "3D Spatial Attention CT Diagnostics", source: "Public Developer Forums", sentiment: "88% Positive", mentions: "1,420 (+84% 7d)", is_verified_fact: false },
    { topic: "FDA Breakthrough Device Status", source: "Regulatory Press", sentiment: "95% Positive", mentions: "412 (+15% 7d)", is_verified_fact: true }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-5 h-5 text-sky-600" />
          <h3 className="font-bold text-base text-slate-900">Industry News & Public Social Signals</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <Link to="/news" className="text-sky-600 hover:underline font-medium">News</Link>
          <span>•</span>
          <Link to="/social" className="text-purple-600 hover:underline font-medium flex items-center gap-1">
            <span>Social</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="space-y-2.5">
        {list.map((sig, idx) => (
          <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{sig.topic}</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                sig.is_verified_fact
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {sig.is_verified_fact ? 'Verified Fact' : 'Public Signal'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-0.5">
              <span>Source: {sig.source}</span>
              <span className="text-purple-700 font-bold">{sig.mentions} ({sig.sentiment})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustrySocialSignalsWidget;
