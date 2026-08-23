import React, { useEffect, useState } from 'react';
import { TrendingUp, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { evaluationAPI } from '../services/api';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Link } from 'react-router-dom';

const EvaluationBaselineCompare: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await evaluationAPI.getBaselineComparison();
      setData(res);
    } catch (err: any) {
      console.error('Failed to fetch baseline comparison:', err);
      setError('Unable to load baseline evaluation comparison matrix.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

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
            <TrendingUp className="w-6 h-6 text-amber-600" />
            Baseline vs Improved Agent Evaluation Comparison Matrix
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Empirical Re-evaluation Comparison • Accuracy • Groundedness • Latency • Token Reduction
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

      {error && <ErrorState message={error} onRetry={fetchComparison} />}

      {data && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Empirical Metric Re-Evaluation Results
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-mono font-medium">
              Re-evaluation Complete
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-medium">
            {data.improvement_summary}
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-mono text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5 text-left">Evaluation Metric</th>
                  <th className="px-6 py-3.5 text-left">Baseline Agent</th>
                  <th className="px-6 py-3.5 text-left">Improved Agent (LangGraph)</th>
                  <th className="px-6 py-3.5 text-right">Measured Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white font-mono">
                {data.comparison_matrix.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 font-sans text-sm">{row.metric}</td>
                    <td className="px-6 py-4 text-slate-600 bg-rose-50/50 font-semibold">{row.baseline}</td>
                    <td className="px-6 py-4 text-slate-900 font-bold bg-emerald-50/50">{row.improved}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md font-bold">
                        {row.change}
                      </span>
                    </td>
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

export default EvaluationBaselineCompare;
