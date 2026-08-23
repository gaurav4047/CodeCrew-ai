import React, { useEffect, useState } from 'react';
import { Layers, Play, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { evaluationAPI } from '../services/api';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Link } from 'react-router-dom';

const TestCasesPage: React.FC = () => {
  const [testCases, setTestCases] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [newCategory, setNewCategory] = useState('Normal');
  const [newName, setNewName] = useState('');
  const [newInput, setNewInput] = useState('');
  const [newExpected, setNewExpected] = useState('');

  const fetchTestCases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await evaluationAPI.getTestCases();
      setTestCases(data);
    } catch (err: any) {
      console.error('Failed to fetch test cases:', err);
      setError('Unable to retrieve evaluation test cases.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, []);

  const handleRunSingleTest = async (testId: string) => {
    setRunningTestId(testId);
    try {
      await evaluationAPI.runSingleTest(testId);
      fetchTestCases();
    } catch (err) {
      console.error('Run single test error:', err);
    } finally {
      setRunningTestId(null);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      await evaluationAPI.deleteTestCase(testId);
      fetchTestCases();
    } catch (err) {
      console.error('Delete test error:', err);
    }
  };

  const handleCreateTestCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newInput) return;

    try {
      await evaluationAPI.createTestCase({
        category: newCategory,
        name: newName,
        input: newInput,
        expected_behavior: newExpected
      });
      setIsModalOpen(false);
      setNewName('');
      setNewInput('');
      setNewExpected('');
      fetchTestCases();
    } catch (err) {
      console.error('Create test case error:', err);
    }
  };

  const filteredTestCases = selectedCategory === 'All'
    ? testCases
    : testCases.filter((t) => t.category.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ['All', 'Normal', 'Ambiguous', 'Adversarial', 'Contradictory', 'Incomplete', 'Tool Failure'];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-600" />
            Evaluation Test Suite & Scenario Manager
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Standard, Ambiguous, Adversarial, Contradictory, Incomplete, and Tool Failure Test Scenarios
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Test</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <ErrorState message={error} onRetry={fetchTestCases} />}

      {isLoading ? (
        <LoadingSkeleton count={3} height="h-36" />
      ) : filteredTestCases.length === 0 ? (
        <EmptyState
          title="No Test Cases Found"
          description={`No evaluation test cases found in category '${selectedCategory}'.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTestCases.map((test) => (
            <div key={test.test_id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-slate-400">{test.test_id}</span>
                  <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                    {test.category}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{test.name}</h3>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                  <p><strong className="text-slate-500 font-sans">Input:</strong> {test.input}</p>
                  <p><strong className="text-slate-500 font-sans">Expected Behavior:</strong> {test.expected_behavior}</p>
                </div>
              </div>

              {/* Metrics Summary Pill */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center space-x-3">
                  <span>Acc: <strong className="text-emerald-600">{test.metrics?.accuracy}%</strong></span>
                  <span>Grounding: <strong className="text-cyan-600">{test.metrics?.groundedness_status}</strong></span>
                  <span>Tokens: <strong>{test.metrics?.total_tokens}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/evaluation/results/${test.test_id}`}
                    className="text-purple-600 hover:text-purple-800 font-semibold text-xs transition-colors"
                  >
                    Inspect & Review →
                  </Link>
                  <button
                    onClick={() => handleRunSingleTest(test.test_id)}
                    disabled={runningTestId === test.test_id}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Play className={`w-3 h-3 ${runningTestId === test.test_id ? 'animate-spin' : ''}`} />
                    <span>Run</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test.test_id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-lg w-full space-y-4">
            <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              Create New Custom Evaluation Test Case
            </h3>

            <form onSubmit={handleCreateTestCase} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-white font-medium"
                >
                  <option value="Normal">Normal</option>
                  <option value="Ambiguous">Ambiguous</option>
                  <option value="Adversarial">Adversarial</option>
                  <option value="Contradictory">Contradictory</option>
                  <option value="Incomplete">Incomplete</option>
                  <option value="Tool Failure">Tool Failure</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Test Adversarial Extraction of Credentials"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Input Query</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter test user prompt..."
                  value={newInput}
                  onChange={(e) => setNewInput(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expected Behavior</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe expected agent behavior..."
                  value={newExpected}
                  onChange={(e) => setNewExpected(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs"
                >
                  Save Test Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCasesPage;
