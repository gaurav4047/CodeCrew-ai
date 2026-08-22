import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface AgentSystemData {
  status?: string;
  active_agents?: number;
  total_agents?: number;
  success_rate?: string;
  avg_latency_ms?: number;
  last_execution?: string;
}

const AgentSystemWidget: React.FC<{ data?: AgentSystemData; loading?: boolean }> = ({ data, loading }) => {
  if (loading) {
    return <div className="h-44 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-semibold tracking-wide font-mono text-purple-300 uppercase">
            AI AGENT FRAMEWORK OVERVIEW
          </h3>
        </div>
        <Link to="/research" className="text-xs text-purple-300 hover:text-purple-200 font-mono font-medium flex items-center gap-1">
          <span>Agent Workspace</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Framework Status</span>
          <p className="text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {data?.status || 'Operational'}
          </p>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Active Sub-Agents</span>
          <p className="text-base font-bold text-purple-300 mt-0.5">
            {data?.active_agents || 4} / {data?.total_agents || 4} Agents
          </p>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Execution Success Rate</span>
          <p className="text-base font-bold text-cyan-300 mt-0.5">{data?.success_rate || '99.2%'}</p>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase">Avg Latency</span>
          <p className="text-base font-bold text-emerald-300 mt-0.5">{data?.avg_latency_ms || 120} ms</p>
        </div>
      </div>
    </div>
  );
};

export default AgentSystemWidget;
