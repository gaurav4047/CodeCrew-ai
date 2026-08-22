import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { WIDGET_REGISTRY } from '../components/dashboard/WidgetRegistry';
import { LayoutDashboard, RefreshCw, AlertCircle, Sparkles, Compass, Cpu } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'focus' | 'discovery' | 'system'>('focus');

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardAPI.getSummary();
      setSummaryData(data);
    } catch (err: any) {
      console.error('Failed to fetch dashboard summary:', err);
      setError('Unable to load real-time dashboard data. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 font-sans">
            <LayoutDashboard className="w-7 h-7 text-indigo-600" />
            Executive Command Center
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Curated High-Impact Intelligence • Critical Threats & Opportunities • Real-Time Telemetry
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchSummary}
            disabled={isLoading}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Command Center</span>
          </button>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-mono font-semibold">
            Live Stream Active
          </span>
        </div>
      </div>

      {/* Section View Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold">
          <button
            onClick={() => setActiveTab('focus')}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
              activeTab === 'focus'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Executive Focus (Default)</span>
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
              activeTab === 'discovery'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Market & Discovery</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
              activeTab === 'system'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-300" />
            <span>System & Telemetry</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
          Showing {activeTab === 'focus' ? 'Curated Top Priority Items' : activeTab === 'discovery' ? 'Market Domain Analysis' : 'Platform & Agent Telemetry'}
        </span>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center space-x-3 text-xs text-rose-900">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1">
            <strong className="block font-semibold">Dashboard Data Offline</strong>
            <span>{error}</span>
          </div>
          <button
            onClick={fetchSummary}
            className="bg-rose-600 text-white font-semibold px-3 py-1.5 rounded-lg shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top Section: Executive KPI Overview Bar (Always visible) */}
      {WIDGET_REGISTRY.filter((w) => w.id === 'kpi_overview' && w.enabled).map((widget) => {
        const WidgetComp = widget.component;
        return <WidgetComp key={widget.id} data={summaryData} loading={isLoading} />;
      })}

      {/* TAB 1: EXECUTIVE FOCUS (Curated Top Items View) */}
      {activeTab === 'focus' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Active AI Research + Latest Intelligence */}
            <div className="lg:col-span-2 space-y-6">
              {WIDGET_REGISTRY.filter((w) => w.id === 'active_research' && w.enabled).map((widget) => {
                const WidgetComp = widget.component;
                return <WidgetComp key={widget.id} jobs={summaryData?.active_research_jobs} loading={isLoading} />;
              })}

              {WIDGET_REGISTRY.filter((w) => w.id === 'latest_intelligence' && w.enabled).map((widget) => {
                const WidgetComp = widget.component;
                return <WidgetComp key={widget.id} items={summaryData?.latest_intelligence} loading={isLoading} />;
              })}
            </div>

            {/* Right Column: Threats/Opportunities + Priority Alerts */}
            <div className="space-y-6">
              {WIDGET_REGISTRY.filter((w) => w.id === 'threat_opportunity' && w.enabled).map((widget) => {
                const WidgetComp = widget.component;
                return <WidgetComp key={widget.id} data={summaryData?.threats_and_opportunities} loading={isLoading} />;
              })}

              {WIDGET_REGISTRY.filter((w) => w.id === 'alerts_overview' && w.enabled).map((widget) => {
                const WidgetComp = widget.component;
                return <WidgetComp key={widget.id} items={summaryData?.alerts_summary} loading={isLoading} />;
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MARKET & DISCOVERY */}
      {activeTab === 'discovery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WIDGET_REGISTRY.filter((w) => w.id === 'research_overview' && w.enabled).map((widget) => {
              const WidgetComp = widget.component;
              return <WidgetComp key={widget.id} data={summaryData?.research_landscape} loading={isLoading} />;
            })}
            {WIDGET_REGISTRY.filter((w) => w.id === 'patent_landscape' && w.enabled).map((widget) => {
              const WidgetComp = widget.component;
              return <WidgetComp key={widget.id} data={summaryData?.patent_landscape} loading={isLoading} />;
            })}
            {WIDGET_REGISTRY.filter((w) => w.id === 'competitor_overview' && w.enabled).map((widget) => {
              const WidgetComp = widget.component;
              return <WidgetComp key={widget.id} items={summaryData?.competitor_overview} loading={isLoading} />;
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WIDGET_REGISTRY.filter((w) => w.id === 'industry_social' && w.enabled).map((widget) => {
              const WidgetComp = widget.component;
              return <WidgetComp key={widget.id} items={summaryData?.industry_social_signals} loading={isLoading} />;
            })}
            {WIDGET_REGISTRY.filter((w) => w.id === 'trend_radar' && w.enabled).map((widget) => {
              const WidgetComp = widget.component;
              return <WidgetComp key={widget.id} items={summaryData?.trend_radar} loading={isLoading} />;
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM & TELEMETRY */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WIDGET_REGISTRY.filter((w) => w.id === 'agent_system' && w.enabled).map((widget) => {
              const WidgetComp = widget.component;
              return <WidgetComp key={widget.id} data={summaryData?.agent_system} loading={isLoading} />;
            })}
            {WIDGET_REGISTRY.filter((w) => w.id === 'agentic_capability' && w.enabled).map((widget) => {
              const WidgetComp = widget.component;
              return <WidgetComp key={widget.id} data={summaryData?.agentic_capabilities} loading={isLoading} />;
            })}
            {WIDGET_REGISTRY.filter((w) => w.id === 'tracking_overview' && w.enabled).map((widget) => {
              const WidgetComp = widget.component;
              return <WidgetComp key={widget.id} items={summaryData?.tracking_summary} loading={isLoading} />;
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {WIDGET_REGISTRY.filter((w) => w.id === 'system_health' && w.enabled).map((widget) => {
              const WidgetComp = widget.component;
              return (
                <WidgetComp
                  key={widget.id}
                  health={summaryData?.system_health}
                  sources={summaryData?.data_sources_health}
                  loading={isLoading}
                />
              );
            })}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WIDGET_REGISTRY.filter((w) => w.id === 'graph_summary' && w.enabled).map((widget) => {
                  const WidgetComp = widget.component;
                  return <WidgetComp key={widget.id} data={summaryData?.knowledge_graph_summary} loading={isLoading} />;
                })}
                {WIDGET_REGISTRY.filter((w) => w.id === 'reports_summary' && w.enabled).map((widget) => {
                  const WidgetComp = widget.component;
                  return <WidgetComp key={widget.id} data={summaryData?.reports_summary} loading={isLoading} />;
                })}
              </div>
              {WIDGET_REGISTRY.filter((w) => w.id === 'memory_summary' && w.enabled).map((widget) => {
                const WidgetComp = widget.component;
                return <WidgetComp key={widget.id} data={summaryData?.memory_summary} loading={isLoading} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
