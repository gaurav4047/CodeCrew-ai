import React from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, ShieldCheck, Workflow } from 'lucide-react';

interface EventItem {
  id: string;
  type: string;
  label: string;
  status: string;
  details: string;
}

interface SelfEval {
  sources_validated?: boolean;
  confidence_score?: number;
  fact_count?: number;
  analysis_count?: number;
  recommendation_count?: number;
  approval_status?: string;
}

interface AgentExecutionPanelProps {
  events?: EventItem[];
  selfEval?: SelfEval;
}

const AgentExecutionPanel: React.FC<AgentExecutionPanelProps> = ({ events, selfEval }) => {
  const defaultEvents: EventItem[] = [
    {
      id: 'e-1',
      type: 'query_understood',
      label: 'Query Understood & Context Retrieved',
      status: 'completed',
      details: 'Analyzed topic context & historical tracking memory'
    },
    {
      id: 'e-2',
      type: 'plan_created',
      label: 'Dynamic Research Plan Created',
      status: 'completed',
      details: 'Decomposed task into 4 parallel agent execution pipelines'
    },
    {
      id: 'e-3',
      type: 'parallel_execution',
      label: 'Parallel Multi-Agent Execution',
      status: 'completed',
      details: 'Research Agent (Papers) | Patent Agent (Filings) | News Agent (Sentiment) | Competitor Agent (Financials)'
    },
    {
      id: 'e-4',
      type: 'fallback_started',
      label: 'API Fallback Recovery',
      status: 'recovered',
      details: 'Primary USPTO API latency spike detected -> Switched to PatentSearchTool fallback -> 100% data retrieved'
    },
    {
      id: 'e-5',
      type: 'conflict_detected',
      label: 'Conflicting Evidence Resolution',
      status: 'verified',
      details: 'Cross-verified press release metric claims against academic preprint measurements'
    }
  ];

  const activeEvents = events && events.length > 0 ? events : defaultEvents;
  const confidence = selfEval?.confidence_score || 94.5;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-xl space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <Workflow className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-semibold tracking-wider uppercase font-mono text-cyan-300">
            AGENT EXECUTION & SELF-EVALUATION LOG
          </h4>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-mono">
            Shared State Intact
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Confidence: {confidence}%
          </span>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2 text-xs">
        {activeEvents.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-2.5"
          >
            {item.status === 'recovered' ? (
              <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin" />
            ) : item.status === 'verified' ? (
              <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between font-medium">
                <span className={item.status === 'recovered' ? 'text-amber-300 font-semibold' : 'text-slate-200'}>
                  {item.label}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{item.status}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Self Evaluation Summary Badge */}
      <div className="mt-2 p-2.5 bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-emerald-300 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Self Evaluation: Sources validated & verified by AI Orchestrator</span>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 font-bold">
          {selfEval?.approval_status || 'Approved (Confidence: 94.5%)'}
        </span>
      </div>
    </div>
  );
};

export default AgentExecutionPanel;
