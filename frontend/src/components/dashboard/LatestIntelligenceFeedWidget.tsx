import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface IntelItem {
  id: string;
  type: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  relevance: string;
  confidence: string;
}

const LatestIntelligenceFeedWidget: React.FC<{ items?: IntelItem[]; loading?: boolean }> = ({ items, loading }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  if (loading) {
    return <div className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const rawItems = items || [];
  const filteredItems = activeFilter === 'all'
    ? rawItems
    : rawItems.filter(item => item.type.toLowerCase() === activeFilter.toLowerCase());

  const getTargetRoute = (type: string) => {
    switch (type.toLowerCase()) {
      case 'research': return '/papers';
      case 'patent': return '/patents';
      case 'competitor': return '/competitors';
      case 'news': return '/news';
      case 'social': return '/social';
      default: return '/insights';
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'research': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'patent': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'competitor': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'news': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'social': return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-base text-slate-900">
            Latest Intelligence Event Stream
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {['all', 'research', 'patent', 'competitor', 'news'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-lg capitalize border transition-all ${
                activeFilter === f
                  ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <p className="text-xs text-slate-400 font-mono py-4 text-center">No intelligence events match filter.</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 hover:border-indigo-200 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getBadgeStyle(item.type)}`}>
                    {item.type}
                  </span>
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</span>
                </div>
                <Link
                  to={getTargetRoute(item.type)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 shrink-0"
                >
                  <span>Inspect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Source: {item.source} • {item.date}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Relevance: {item.relevance}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LatestIntelligenceFeedWidget;
