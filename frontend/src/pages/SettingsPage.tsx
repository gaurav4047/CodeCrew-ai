import React from 'react';
import { Settings } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            System Telemetry & Resource Awareness
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            API Quotas • LLM Model Telemetry • Agent Orchestrator Controls • System Status
          </p>
        </div>
        <StatusBadge status="Healthy" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500">LLM Provider</span>
          <p className="text-lg font-bold text-slate-900 mt-1">Groq API</p>
          <span className="text-[10px] text-emerald-600">Model: groq/compound</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500">Active Sub-Agents</span>
          <p className="text-lg font-bold text-purple-700 mt-1">4 Active Agents</p>
          <span className="text-[10px] text-purple-600">Research, Patent, News, Market</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500">Avg Execution Latency</span>
          <p className="text-lg font-bold text-cyan-700 mt-1">120 ms</p>
          <span className="text-[10px] text-cyan-600">Parallel Execution</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500">System API Quota</span>
          <p className="text-lg font-bold text-emerald-700 mt-1">98.4% Available</p>
          <span className="text-[10px] text-emerald-600">Rate Limit Healthy</span>
        </div>
      </div>

      {/* Config Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          Enterprise Security & LLM API Configuration
        </h3>
        <div className="space-y-3 max-w-lg text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Active LLM Model</label>
            <input
              type="text"
              readOnly
              value="groq/compound (Groq Llama 3 360° Synthesis)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Groq API Key Status</label>
            <input
              type="text"
              readOnly
              value="gsk_9XlQ...1J (Configured & Active)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-emerald-700 font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
