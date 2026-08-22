import React, { useEffect, useState } from 'react';
import { insightsAPI } from '../services/api';
import type { Insight } from '../types';
import { Filter, ExternalLink, Check, AlertCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { FactInferenceBadge } from '../components/common/FactInferenceBadge';
import { SourceBadge } from '../components/common/SourceBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

const Insights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = { limit: 50 };
      if (filter === 'unread') params.unread_only = true;
      if (filter === 'high') params.priority = 'high';

      const data = await insightsAPI.getAll(params);
      setInsights(data);
    } catch (err: any) {
      console.error('Failed to fetch insights:', err);
      setError('Unable to load AI insights from backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [filter]);

  const handleMarkAsRead = async (insight: Insight) => {
    try {
      await insightsAPI.update(insight.id, { is_read: true });
      fetchInsights();
    } catch (error) {
      console.error('Failed to mark insight as read:', error);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            AI Intelligence Insights & Findings
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Peer-Reviewed Papers • USPTO Patents • Industry Press • Strategic Analysis
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-xs bg-transparent font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Insights ({insights.length})</option>
              <option value="unread">Unread Only</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <button
            onClick={fetchInsights}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && <ErrorState message={error} onRetry={fetchInsights} />}

      {/* Loading state */}
      {isLoading ? (
        <LoadingSkeleton count={4} height="h-40" />
      ) : insights.length === 0 ? (
        <EmptyState
          title="No AI Insights Found"
          description="Configure tracking targets or execute an AI research query to generate insights."
        />
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all space-y-3 ${
                !insight.is_read ? 'border-l-4 border-l-blue-600 border-slate-200 shadow-sm' : 'border-slate-200 opacity-90'
              }`}
            >
              {/* Badges Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={insight.priority} />
                  <FactInferenceBadge isFact={insight.category !== 'trend'} />
                  {insight.category && (
                    <span className="bg-slate-100 text-slate-700 text-[11px] font-mono font-medium px-2 py-0.5 rounded capitalize">
                      {insight.category.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                  {insight.discovered_at && (
                    <span>{format(new Date(insight.discovered_at), 'MMM d, yyyy HH:mm')}</span>
                  )}
                </div>
              </div>

              {/* Title & Summary */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                  {insight.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {insight.summary}
                </p>
              </div>

              {/* Entity Badges */}
              {insight.entities && insight.entities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {insight.entities.slice(0, 5).map((entity, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50 text-indigo-800 text-[11px] font-mono px-2.5 py-0.5 rounded-lg border border-indigo-100"
                    >
                      {entity}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Metadata & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  {insight.relevance_score && (
                    <ConfidenceBadge score={Math.round(insight.relevance_score * 100)} />
                  )}
                  {insight.source_type && <SourceBadge source={insight.source_type} />}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {insight.source_url && (
                    <a
                      href={insight.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                      title="View Source"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {!insight.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(insight)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-medium border border-emerald-200 flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedInsight(insight)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <StatusBadge status={selectedInsight.priority} />
                <FactInferenceBadge isFact={selectedInsight.category !== 'trend'} />
              </div>
              <button
                onClick={() => setSelectedInsight(null)}
                className="text-slate-400 hover:text-slate-900 text-sm font-bold font-mono"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{selectedInsight.title}</h3>

            <div className="space-y-2 text-xs text-slate-700">
              <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedInsight.summary}
              </p>

              {selectedInsight.full_content && (
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-slate-800 font-mono text-[11px] whitespace-pre-wrap">
                  {selectedInsight.full_content}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                Discovered: {format(new Date(selectedInsight.discovered_at), 'MMM d, yyyy HH:mm')}
              </span>
              <button
                onClick={() => setSelectedInsight(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl border border-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
