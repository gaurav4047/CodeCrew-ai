import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layers, ArrowLeft, Clock } from 'lucide-react';
import { observabilityAPI } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

const TracesPage: React.FC = () => {
  const { traceId } = useParams<{ traceId?: string }>();
  const [traces, setTraces] = useState<any[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await observabilityAPI.getTraces();
      setTraces(data);

      if (traceId) {
        const found = data.find((t: any) => t.trace_id === traceId);
        if (found) setSelectedTrace(found);
      } else if (data.length > 0) {
        setSelectedTrace(data[0]);
      }
    } catch (err: any) {
      console.error('Failed to fetch traces:', err);
      setError('Unable to load trace logs from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTraces();
  }, [traceId]);

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Agent Trace Explorer & Step Timeline
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Individual Step Execution • Latency Tracking • Token Breakdown • Masked Sensitive Credentials
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/observability"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Observability Dashboard</span>
          </Link>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchTraces} />}

      {isLoading ? (
        <LoadingSkeleton count={3} height="h-36" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traces List Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-900">Recorded Traces ({traces.length})</span>
              <span className="text-[11px] font-mono text-slate-400">Live Trace Log</span>
            </div>

            {traces.length === 0 ? (
              <EmptyState title="No Traces Recorded" description="Run an AI research query to capture execution traces." />
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {traces.map((trace) => (
                  <button
                    key={trace.trace_id}
                    onClick={() => setSelectedTrace(trace)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1.5 ${
                      selectedTrace?.trace_id === trace.trace_id
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-slate-900">{trace.trace_id}</span>
                      <StatusBadge status={trace.task_success ? 'completed' : 'failed'} />
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-1 font-medium">{trace.user_request}</p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                      <span>{trace.execution_time_ms}ms</span>
                      <span>{trace.total_tokens} tokens</span>
                      <span>{trace.total_tool_calls} tools</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Individual Trace Detail Inspector */}
          {selectedTrace ? (
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">TRACE ID: {selectedTrace.trace_id}</span>
                    <h3 className="font-bold text-base text-slate-900 mt-0.5">{selectedTrace.user_request}</h3>
                  </div>
                  <StatusBadge status={selectedTrace.task_success ? 'completed' : 'failed'} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans block text-[10px]">Total Duration</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedTrace.execution_time_ms} ms</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans block text-[10px]">Total Tokens</span>
                    <span className="font-bold text-purple-700 text-sm">{selectedTrace.total_tokens} tokens</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans block text-[10px]">Tool Calls</span>
                    <span className="font-bold text-indigo-700 text-sm">{selectedTrace.total_tool_calls} calls</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 font-sans block text-[10px]">Errors & Retries</span>
                    <span className={`font-bold text-sm ${selectedTrace.error_count > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {selectedTrace.error_count} err / {selectedTrace.retry_count} retry
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Steps Sequence Visualizer */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Step-by-Step Timeline Sequence
                </h3>

                <div className="space-y-4">
                  {selectedTrace.steps.map((step: any) => (
                    <div
                      key={step.step_id}
                      className={`p-4 rounded-xl border transition-all space-y-2 ${
                        step.status === 'failed' || step.status === 'simulated_error'
                          ? 'bg-rose-50/80 border-rose-300'
                          : step.status === 'retried'
                          ? 'bg-amber-50/80 border-amber-300'
                          : 'bg-slate-50/80 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs border-b border-slate-200/60 pb-2">
                        <div className="flex items-center space-x-2 font-mono">
                          <span className="bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            #{step.step_number}
                          </span>
                          <span className="font-bold text-slate-900">{step.label}</span>
                        </div>
                        <div className="flex items-center space-x-2 font-mono text-[11px]">
                          <span className="text-slate-400">{step.timestamp}</span>
                          <span className="font-bold text-slate-700">{step.duration_ms}ms</span>
                          <StatusBadge status={step.status} />
                        </div>
                      </div>

                      {/* Step Input & Output Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">STEP INPUT:</span>
                          <pre className="bg-slate-900 text-cyan-300 p-2.5 rounded-lg overflow-x-auto text-[11px] leading-tight">
                            {JSON.stringify(step.input, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">STEP OUTPUT:</span>
                          <pre className="bg-slate-900 text-emerald-300 p-2.5 rounded-lg overflow-x-auto text-[11px] leading-tight">
                            {JSON.stringify(step.output, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Error details if failed */}
                      {step.error_details && (
                        <div className="bg-rose-100 text-rose-900 p-3 rounded-lg border border-rose-300 text-xs font-mono flex items-start space-x-2 mt-2">
                          <span className="text-rose-600 shrink-0 font-bold">⚠️</span>
                          <span>{step.error_details}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <EmptyState title="Select a Trace" description="Select a trace from the left panel to inspect step details." />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TracesPage;
