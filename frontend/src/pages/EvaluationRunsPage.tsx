import React, { useEffect, useState } from 'react';
import { RefreshCw, Play, ArrowLeft } from 'lucide-react';
import { evaluationAPI } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Link } from 'react-router-dom';

const EvaluationRunsPage: React.FC = () => {
  const [testCases, setTestCases] = useState<any[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [consistencyData, setConsistencyData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await evaluationAPI.getTestCases();
      setTestCases(data);
      if (data.length > 0) {
        setSelectedTestId(data[0].test_id);
        const res = await evaluationAPI.runRepeatedConsistency(data[0].test_id, 5);
        setConsistencyData(res);
      }
    } catch (err: any) {
      console.error('Failed to fetch evaluation runs data:', err);
      setError('Unable to retrieve repeated consistency metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleRunConsistency = async () => {
    if (!selectedTestId) return;
    setIsTesting(true);
    try {
      const res = await evaluationAPI.runRepeatedConsistency(selectedTestId, 5);
      setConsistencyData(res);
    } catch (err) {
      console.error('Run consistency error:', err);
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton count={3} height="h-36" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            Repeated-Run Consistency Evaluation
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Run Test Cases 3 to 5 Times • Measure Answer Stability • Compare Latency & Token Variance
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/evaluation"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchInitialData} />}

      {/* Select Test Case Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Target Test Case</label>
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-2.5 bg-white text-xs font-medium text-slate-900"
          >
            {testCases.map((t) => (
              <option key={t.test_id} value={t.test_id}>
                [{t.category}] {t.name} ({t.test_id})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRunConsistency}
          disabled={isTesting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-colors shadow-xs flex items-center space-x-1.5 shrink-0 self-end sm:self-center"
        >
          <Play className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
          <span>{isTesting ? 'Running 5 Iterations...' : 'Execute 5 Repeated Runs'}</span>
        </button>
      </div>

      {/* Consistency Results Card */}
      {consistencyData && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400">{consistencyData.test_id}</span>
              <h3 className="font-bold text-lg text-slate-900 mt-0.5">{consistencyData.test_name}</h3>
            </div>

            <div className="flex items-center space-x-3 font-mono text-xs">
              <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-xl border border-blue-200">
                Consistency Score: <strong>{consistencyData.consistency_score}%</strong>
              </div>
              <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                Variance: <strong>{consistencyData.variance}</strong>
              </div>
            </div>
          </div>

          {/* Repeated Runs Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-mono text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5 text-left">Run Iteration</th>
                  <th className="px-6 py-3.5 text-left">Execution Status</th>
                  <th className="px-6 py-3.5 text-left">Response Snippet</th>
                  <th className="px-6 py-3.5 text-right">Latency</th>
                  <th className="px-6 py-3.5 text-right">Tokens Used</th>
                  <th className="px-6 py-3.5 text-right">Tool Calls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-mono">
                {consistencyData.runs.map((run: any) => (
                  <tr key={run.run_number} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">Run #{run.run_number}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-sans">{run.response_snippet}</td>
                    <td className="px-6 py-4 text-right text-slate-900 font-bold">{run.latency_ms} ms</td>
                    <td className="px-6 py-4 text-right text-purple-700 font-bold">{run.tokens_used} tokens</td>
                    <td className="px-6 py-4 text-right text-indigo-700 font-bold">{run.tool_calls} calls</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationRunsPage;
