import React, { useState } from 'react';
import { Search, Brain, Workflow, ShieldCheck, Sparkles } from 'lucide-react';
import AgentExecutionPanel from '../components/AgentExecutionPanel';
import AgentGraph from '../components/AgentGraph';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { StatusBadge } from '../components/common/StatusBadge';

const ResearchWorkspace: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleRunResearch = async () => {
    if (!query.trim()) return;
    setIsExecuting(true);
    setReport(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Research execution failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const sampleQueries = [
    "Analyze the latest AI medical diagnosis landscape.",
    "Track quantum computing patent filings and competitor breakthroughs.",
    "Compare Nvidia Blackwell GPU architecture against competing hardware preprints.",
    "Search database for high priority insights"
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Workflow className="w-7 h-7 text-indigo-600" />
            AI Research Workspace & Multi-Agent Engine
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Universal AI Intelligence Bar • Parallel Agent Planning • Self-Evaluation Confidence Scoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status="LangGraph Active" />
          <ConfidenceBadge score="94.5%" />
        </div>
      </div>

      {/* Universal AI Research Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 shadow-xl text-white">
        <label className="block text-xs font-mono font-medium text-cyan-300 uppercase tracking-wider mb-2">
          UNIVERSAL AI RESEARCH & COMPETITIVE INTELLIGENCE BAR
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunResearch()}
              placeholder="Ask anything about a technology, competitor, research topic, patent, or industry..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder:text-slate-400"
              disabled={isExecuting}
            />
          </div>
          <button
            onClick={handleRunResearch}
            disabled={isExecuting || !query.trim()}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-95 disabled:opacity-40 transition-all shadow-lg flex items-center justify-center space-x-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>{isExecuting ? 'Running Agents...' : 'Execute Research Plan'}</span>
          </button>
        </div>

        {/* Sample Demo Queries */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">Demo Prompts:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(q)}
              className="bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1 rounded-lg border border-white/10 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Execution Topology & Agent Execution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentExecutionPanel
          events={report?.execution_events}
          selfEval={report?.self_evaluation}
        />
        <AgentGraph nodes={report?.agent_graph_nodes} />
      </div>

      {/* Report Section */}
      {report && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              360° Multi-Agent Intelligence Synthesis Report
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Execution Time: {report.execution_time_ms}ms
            </span>
          </div>

          {/* Context Memory Banner */}
          {report.context_memory?.memory_indicator && (
            <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl flex items-center space-x-2 text-xs text-indigo-900">
              <Brain className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-medium">{report.context_memory.memory_indicator}</span>
            </div>
          )}

          {/* Content Body */}
          <div className="prose max-w-none text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
            {report.response}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchWorkspace;
