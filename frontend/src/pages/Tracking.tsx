import React, { useEffect, useState } from 'react';
import { trackingAPI } from '../services/api';
import type { TrackingConfig } from '../types';
import { Plus, Edit, Trash2, Power, Target, RefreshCw } from 'lucide-react';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

const Tracking: React.FC = () => {
  const [configs, setConfigs] = useState<TrackingConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<TrackingConfig | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    tracking_type: 'research' as TrackingConfig['tracking_type'],
    keywords: '',
    check_interval_minutes: 60,
  });

  const fetchConfigs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await trackingAPI.getAll();
      setConfigs(data);
    } catch (err: any) {
      console.error('Failed to fetch tracking configs:', err);
      setError('Unable to retrieve tracking configurations from backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const configData = {
        ...formData,
        keywords: formData.keywords.split(',').map((k) => k.trim()).filter((k) => k),
        sources: {},
      };

      if (editingConfig) {
        await trackingAPI.update(editingConfig.id, configData);
      } else {
        await trackingAPI.create(configData);
      }

      setShowModal(false);
      setEditingConfig(null);
      setFormData({
        name: '',
        tracking_type: 'research',
        keywords: '',
        check_interval_minutes: 60,
      });
      fetchConfigs();
    } catch (err) {
      console.error('Failed to save tracking config:', err);
    }
  };

  const handleEdit = (config: TrackingConfig) => {
    setEditingConfig(config);
    setFormData({
      name: config.name,
      tracking_type: config.tracking_type,
      keywords: config.keywords.join(', '),
      check_interval_minutes: config.check_interval_minutes,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tracking configuration?')) {
      try {
        await trackingAPI.delete(id);
        fetchConfigs();
      } catch (err) {
        console.error('Failed to delete tracking config:', err);
      }
    }
  };

  const handleToggleActive = async (config: TrackingConfig) => {
    try {
      await trackingAPI.update(config.id, { is_active: !config.is_active });
      fetchConfigs();
    } catch (err) {
      console.error('Failed to toggle tracking config:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-600" />
            Automated Tracking Targets
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Continuous Intelligence Monitoring • Keyword Filters • Interval Schedules
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchConfigs}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => {
              setEditingConfig(null);
              setFormData({
                name: '',
                tracking_type: 'research',
                keywords: '',
                check_interval_minutes: 60,
              });
              setShowModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tracking Target</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && <ErrorState message={error} onRetry={fetchConfigs} />}

      {/* Loading state */}
      {isLoading ? (
        <LoadingSkeleton count={3} height="h-36" />
      ) : configs.length === 0 ? (
        <EmptyState
          title="No Tracking Targets Configured"
          description="Create your first automated tracking configuration to begin continuous monitoring."
          actionText="Add Tracking Target"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-mono text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3.5 text-left">Target Name</th>
                  <th className="px-6 py-3.5 text-left">Type</th>
                  <th className="px-6 py-3.5 text-left">Keywords</th>
                  <th className="px-6 py-3.5 text-left">Check Interval</th>
                  <th className="px-6 py-3.5 text-left">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {configs.map((config) => (
                  <tr key={config.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{config.name}</td>
                    <td className="px-6 py-4 font-mono capitalize text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                        {config.tracking_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {config.keywords.slice(0, 4).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-50 text-indigo-800 text-[11px] font-mono px-2 py-0.5 rounded border border-indigo-100"
                          >
                            {keyword}
                          </span>
                        ))}
                        {config.keywords.length > 4 && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            +{config.keywords.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      Every {config.check_interval_minutes} mins
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(config)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all ${
                          config.is_active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <Power className="w-3 h-3 mr-1" />
                        {config.is_active ? 'Active Sync' : 'Paused'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(config)}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg transition-colors"
                          title="Edit Config"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(config.id)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete Target"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden space-y-4 p-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingConfig ? 'Edit Tracking Configuration' : 'Add Tracking Target'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. AI Medical Diagnostics & Patents"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tracking Domain Type</label>
                <select
                  value={formData.tracking_type}
                  onChange={(e) => setFormData({ ...formData, tracking_type: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                >
                  <option value="research">Research Publications (arXiv / PubMed)</option>
                  <option value="patent">Intellectual Property Patents (USPTO / EPO)</option>
                  <option value="news">Industry News & Media</option>
                  <option value="social_media">Public Social Signals</option>
                  <option value="competitor">Competitor Corporate Activity</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keywords (Comma-Separated)</label>
                <input
                  type="text"
                  required
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  placeholder="AI, 3D Spatial Radiology, Neuromorphic"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Check Interval (Minutes)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.check_interval_minutes}
                  onChange={(e) => setFormData({ ...formData, check_interval_minutes: parseInt(e.target.value) || 60 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs"
                >
                  {editingConfig ? 'Update Target' : 'Save Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
