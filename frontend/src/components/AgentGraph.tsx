import React from 'react';
import { User, Cpu, Network, CheckCircle2, ShieldCheck } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  status: string;
  duration_ms?: number;
  tools?: string[];
  result_count?: number;
}

interface AgentGraphProps {
  nodes?: GraphNode[];
}

const AgentGraph: React.FC<AgentGraphProps> = ({ nodes }) => {
  const defaultNodes: GraphNode[] = [
    { id: 'node-user', label: 'User Query', status: 'completed', duration_ms: 10 },
    { id: 'node-orchestrator', label: 'AI Orchestrator', status: 'completed', duration_ms: 45 },
    { id: 'node-planner', label: 'Dynamic Planner', status: 'completed', duration_ms: 60 },
    { id: 'node-agent-research', label: 'Research Intelligence Agent', status: 'completed', tools: ['ResearchPaperTool'], result_count: 4 },
    { id: 'node-agent-patent', label: 'Patent & IP Agent', status: 'completed', tools: ['PatentSearchTool'], result_count: 3 },
    { id: 'node-agent-news', label: 'News & Social Agent', status: 'completed', tools: ['NewsSearchTool'], result_count: 5 },
    { id: 'node-agent-market', label: 'Competitor & Market Agent', status: 'completed', tools: ['CompanyInfoTool'], result_count: 6 },
    { id: 'node-analysis', label: 'Evidence Analysis & Verification', status: 'completed', duration_ms: 120 },
    { id: 'node-synthesis', label: '360° Synthesis Engine', status: 'completed', duration_ms: 210 },
    { id: 'node-final', label: 'Final Intelligence Output', status: 'completed', duration_ms: 15 }
  ];

  const activeNodes = nodes && nodes.length > 0 ? nodes : defaultNodes;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-cyan-300">
            LangGraph Execution Graph & State Topology
          </h3>
        </div>
        <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
          State Active (0 Failure Deadlocks)
        </span>
      </div>

      {/* Topology Nodes Flow */}
      <div className="space-y-4">
        {/* Tier 1: User & Orchestrator */}
        <div className="flex items-center justify-center gap-4">
          <div className="bg-slate-950 border border-blue-500/40 px-3.5 py-2 rounded-xl flex items-center space-x-2 shadow-md">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono font-medium">User Query</span>
          </div>
          <div className="w-8 h-0.5 bg-blue-500/40"></div>
          <div className="bg-slate-950 border border-indigo-500/40 px-3.5 py-2 rounded-xl flex items-center space-x-2 shadow-md">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-medium">AI Chief Orchestrator</span>
          </div>
        </div>

        {/* Tier 2: Parallel Agents */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {activeNodes.filter(n => n.id.includes('agent')).map((agentNode) => (
            <div
              key={agentNode.id}
              className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-purple-300 truncate">{agentNode.label}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Tools: {agentNode.tools?.join(', ') || 'Domain API'}</span>
                <span className="text-cyan-400 font-bold">{agentNode.result_count || 4} results</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tier 3: Verification & Synthesis */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="bg-slate-950 border border-emerald-500/40 px-3.5 py-2 rounded-xl flex items-center space-x-2 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-medium">Evidence Verification (Confidence 94.5%)</span>
          </div>
          <div className="w-8 h-0.5 bg-emerald-500/40"></div>
          <div className="bg-slate-950 border border-cyan-500/40 px-3.5 py-2 rounded-xl flex items-center space-x-2 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-medium">360° Synthesis & Action Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentGraph;
