import React from 'react';
import { Link } from 'react-router-dom';
import { Workflow, CheckCircle2, Play, ArrowRight } from 'lucide-react';

interface ResearchJob {
  id: string;
  query: string;
  status: string;
  agents: string[];
  progress: number;
  confidence_score: number;
  started_at: string;
}

const ActiveResearchWidget: React.FC<{ jobs?: ResearchJob[]; loading?: boolean }> = ({ jobs, loading }) => {
  if (loading) {
    return <div className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const activeJobs = jobs && jobs.length > 0 ? jobs : [];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Workflow className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide font-mono text-cyan-300 uppercase">
            ACTIVE AI RESEARCH JOBS & EXECUTION PIPELINE
          </h3>
        </div>
        <Link
          to="/research"
          className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-medium flex items-center gap-1"
        >
          <span>Start New Research</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {activeJobs.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400 font-mono">
          No active research job currently executing.
        </div>
      ) : (
        <div className="space-y-3">
          {activeJobs.map((job) => (
            <div key={job.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  {job.query}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                  {job.status} ({job.progress}%)
                </span>
              </div>

              {/* Agents badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {job.agents.map((agent, i) => (
                  <span key={i} className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                    {agent}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveResearchWidget;
