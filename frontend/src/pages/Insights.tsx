import { useEffect, useState } from 'react';
import { insightsAPI } from '../services/api';
import type { Insight } from '../types';
import { Filter, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Insights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  useEffect(() => {
    fetchInsights();
  }, [filter]);

  const fetchInsights = async () => {
    try {
      const params: any = { limit: 50 };
      if (filter === 'unread') params.unread_only = true;
      if (filter === 'high') params.priority = 'high';
      
      const data = await insightsAPI.getAll(params);
      setInsights(data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (insight: Insight) => {
    try {
      await insightsAPI.update(insight.id, { is_read: true });
      fetchInsights();
    } catch (error) {
      console.error('Failed to mark insight as read:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'breakthrough':
        return 'bg-purple-100 text-purple-800';
      case 'trend':
        return 'bg-blue-100 text-blue-800';
      case 'competitor_activity':
        return 'bg-red-100 text-red-800';
      case 'market_shift':
        return 'bg-green-100 text-green-800';
      case 'regulatory':
        return 'bg-indigo-100 text-indigo-800';
      case 'partnership':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading insights...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Insights</option>
            <option value="unread">Unread Only</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`bg-white shadow rounded-lg p-6 border-l-4 ${
              !insight.is_read ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(
                      insight.priority
                    )}`}
                  >
                    {insight.priority}
                  </span>
                  {insight.category && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(
                        insight.category
                      )}`}
                    >
                      {insight.category.replace('_', ' ')}
                    </span>
                  )}
                  {insight.source_type && (
                    <span className="text-xs text-gray-500">
                      {insight.source_type}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {insight.title}
                </h3>
                <p className="text-gray-600 mb-3">{insight.summary}</p>
                {insight.entities && insight.entities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {insight.entities.slice(0, 5).map((entity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {entity}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {insight.discovered_at && (
                    <span>
                      {format(new Date(insight.discovered_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  )}
                  {insight.relevance_score && (
                    <span>Relevance: {Math.round(insight.relevance_score * 100)}%</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {insight.source_url && (
                  <a
                    href={insight.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-600"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                {!insight.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(insight)}
                    className="p-2 text-gray-500 hover:text-green-600"
                    title="Mark as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedInsight(insight)}
                  className="p-2 text-gray-500 hover:text-blue-600"
                  title="View details"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {insights.length === 0 && (
          <div className="bg-white shadow rounded-lg p-12 text-center text-gray-500">
            No insights found. Create tracking configurations to start collecting insights.
          </div>
        )}
      </div>

      {selectedInsight && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setSelectedInsight(null)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(
                      selectedInsight.priority
                    )}`}
                  >
                    {selectedInsight.priority}
                  </span>
                  {selectedInsight.category && (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(
                        selectedInsight.category
                      )}`}
                    >
                      {selectedInsight.category.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  {selectedInsight.title}
                </h3>
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-gray-600">{selectedInsight.summary}</p>
                  {selectedInsight.full_content && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedInsight.full_content}
                      </p>
                    </div>
                  )}
                </div>
                {selectedInsight.entities && selectedInsight.entities.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Key Entities
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedInsight.entities.map((entity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  {selectedInsight.discovered_at && (
                    <span>
                      Discovered: {format(new Date(selectedInsight.discovered_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  )}
                  {selectedInsight.published_at && (
                    <span>
                      Published: {format(new Date(selectedInsight.published_at), 'MMM d, yyyy')}
                    </span>
                  )}
                  {selectedInsight.relevance_score && (
                    <span>Relevance: {Math.round(selectedInsight.relevance_score * 100)}%</span>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedInsight.source_url && (
                  <a
                    href={selectedInsight.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    View Source
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedInsight(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
