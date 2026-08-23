import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, ArrowLeft, Star, UserCheck, Sparkles } from 'lucide-react';
import { evaluationAPI } from '../services/api';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';

const EvaluationResultDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [testCase, setTestCase] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Human Review Rating State (1 to 5)
  const [evaluatorName, setEvaluatorName] = useState('Dr. Elena Vance');
  const [ratings, setRatings] = useState<{ [key: string]: number }>({
    correctness: 5,
    relevance: 5,
    evidence_quality: 5,
    completeness: 4,
    safety: 5,
    clarity: 5,
    task_completion: 5
  });
  const [comment, setComment] = useState('');

  const fetchDetailData = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [testData, reviewData] = await Promise.all([
        evaluationAPI.getTestCaseById(id),
        evaluationAPI.getHumanReviews(id)
      ]);
      setTestCase(testData);
      setReviews(reviewData);
    } catch (err: any) {
      console.error('Failed to fetch test case detail:', err);
      setError('Unable to load evaluation details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailData();
  }, [id]);

  const handleRatingChange = (dimension: string, value: number) => {
    setRatings((prev) => ({ ...prev, [dimension]: value }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    try {
      await evaluationAPI.submitHumanReview({
        test_id: id,
        evaluator: evaluatorName,
        ratings,
        comment
      });
      setComment('');
      fetchDetailData();
    } catch (err) {
      console.error('Submit review error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton count={3} height="h-36" />
      </div>
    );
  }

  if (!testCase) {
    return <ErrorState message="Test case record not found." onRetry={fetchDetailData} />;
  }

  const dimensions = [
    { key: 'correctness', label: '1. Correctness' },
    { key: 'relevance', label: '2. Relevance' },
    { key: 'evidence_quality', label: '3. Evidence Quality' },
    { key: 'completeness', label: '4. Completeness' },
    { key: 'safety', label: '5. Safety & Guardrails' },
    { key: 'clarity', label: '6. Clarity' },
    { key: 'task_completion', label: '7. Task Completion' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
            <span>TEST ID: {testCase.test_id}</span>
            <span>•</span>
            <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">
              {testCase.category}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            {testCase.name}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/evaluation/test-cases"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition-colors flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Test Suite</span>
          </Link>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchDetailData} />}

      {/* Metrics & Groundedness Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900">Automated Metric Evaluation Summary</h3>

          <div className="flex items-center space-x-2">
            <span
              className={`font-mono text-xs px-3 py-1 rounded-full font-bold border ${
                testCase.metrics?.groundedness_status === 'Grounded'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : testCase.metrics?.groundedness_status === 'Partially Grounded'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}
            >
              Groundedness: {testCase.metrics?.groundedness_status}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-sans block text-[10px]">Accuracy Score</span>
            <span className="font-bold text-emerald-600 text-sm">{testCase.metrics?.accuracy}%</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-sans block text-[10px]">Task Completion</span>
            <span className="font-bold text-indigo-600 text-sm">{testCase.metrics?.task_completion}%</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-sans block text-[10px]">Hallucination Rate</span>
            <span className="font-bold text-emerald-600 text-sm">{testCase.metrics?.hallucination_rate}%</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-sans block text-[10px]">Recovery Rate</span>
            <span className="font-bold text-purple-600 text-sm">{testCase.metrics?.recovery_rate}%</span>
          </div>
        </div>

        {/* Agent Response Card */}
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-2 text-xs font-mono">
          <span className="text-slate-400 block text-[10px]">LAST CAPTURED AGENT RESPONSE:</span>
          <p className="leading-relaxed text-cyan-200">{testCase.last_response}</p>
        </div>
      </div>

      {/* Human Evaluation Review Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            Human Evaluator Rating & Review Interface
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono font-medium">
            1 to 5 Star Rating Scale
          </span>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Evaluator Name / Role</label>
            <input
              type="text"
              required
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              className="w-full max-w-md border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
            />
          </div>

          {/* Rating Dimensions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dimensions.map((dim) => (
              <div key={dim.key} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 block">{dim.label}</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => handleRatingChange(dim.key, star)}
                      className={`p-1 transition-colors ${
                        ratings[dim.key] >= star ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-slate-700 ml-2">
                    {ratings[dim.key]} / 5
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Evaluator Comments & Observations</label>
            <textarea
              rows={3}
              placeholder="Add qualitative remarks regarding correctness, groundedness, or safety..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isSubmitting ? 'Submitting Review...' : 'Submit Human Evaluation Review'}</span>
          </button>
        </form>

        {/* Existing Reviews List */}
        {reviews.length > 0 && (
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Submitted Human Evaluation Reviews ({reviews.length})
            </h4>

            <div className="space-y-2">
              {reviews.map((rev) => (
                <div key={rev.eval_id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{rev.evaluator}</span>
                    <span className="bg-amber-100 text-amber-900 font-mono font-bold px-2 py-0.5 rounded">
                      Average Rating: {rev.average_score} ★
                    </span>
                  </div>
                  {rev.comment && <p className="text-xs text-slate-600 font-sans italic">{rev.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationResultDetail;
