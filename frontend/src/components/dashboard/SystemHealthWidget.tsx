import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface DataSourceHealth {
  source: string;
  status: string;
  last_sync: string;
}

interface SystemHealthData {
  backend_status?: string;
  database_status?: string;
  llm_provider?: string;
  agent_framework?: string;
  external_apis?: string;
  background_jobs?: string;
}

const SystemHealthWidget: React.FC<{
  health?: SystemHealthData;
  sources?: DataSourceHealth[];
  loading?: boolean;
}> = ({ health, sources, loading }) => {
  if (loading) {
    return <div className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const defaultSources = sources || [
    { source: "arXiv & PubMed", status: "Connected", last_sync: "5 mins ago" },
    { source: "USPTO & EPO Patents", status: "Connected", last_sync: "10 mins ago" },
    { source: "News APIs & Press Releases", status: "Connected", last_sync: "2 mins ago" },
    { source: "Public Social Feeds", status: "Connected", last_sync: "1 min ago" }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900">Platform & Data Source Health</h3>
        </div>
        <Link to="/settings" className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1">
          <span>View Telemetry</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-950 mb-2">
        <span>Backend: {health?.backend_status || 'Healthy'}</span>
        <span>LLM: {health?.llm_provider || 'Groq API (groq/compound)'}</span>
        <span>Framework: {health?.agent_framework || 'LangGraph Stateful Engine'}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        {defaultSources.map((ds, idx) => (
          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{ds.source}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {ds.status}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">Last Sync: {ds.last_sync}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemHealthWidget;
