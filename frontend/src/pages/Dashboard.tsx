import { useEffect, useState } from 'react';
import { insightsAPI } from '../services/api';
import type { InsightStats } from '../types';
import { BarChart3, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState<InsightStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await insightsAPI.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const cards = [
    {
      name: 'Total Insights',
      value: stats?.total_insights || 0,
      icon: BarChart3,
      color: 'bg-blue-500',
    },
    {
      name: 'Unread Insights',
      value: stats?.unread_insights || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'Recent (24h)',
      value: stats?.recent_insights || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'High Priority',
      value: stats?.high_priority_insights || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon className={`h-6 w-6 ${card.color} text-white rounded-md p-1`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {card.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Welcome to Competitive Intelligence
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                This dashboard provides real-time insights from research papers, patents,
                news, and social media sources. Configure your tracking preferences to
                start monitoring competitive intelligence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Configure tracking in the Tracking section</li>
                    <li>• View latest insights in the Insights section</li>
                    <li>• Set up alerts for high-priority updates</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Research papers (arXiv, PubMed)</li>
                    <li>• Patent databases (Google Patents, USPTO)</li>
                    <li>• News APIs and RSS feeds</li>
                    <li>• Social media (Twitter, Reddit)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
