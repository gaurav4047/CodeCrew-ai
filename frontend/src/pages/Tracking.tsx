import { useEffect, useState } from 'react';
import { trackingAPI } from '../services/api';
import type { TrackingConfig } from '../types';
import { Plus, Edit, Trash2, Power } from 'lucide-react';

const Tracking = () => {
  const [configs, setConfigs] = useState<TrackingConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<TrackingConfig | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    tracking_type: 'research' as TrackingConfig['tracking_type'],
    keywords: '',
    check_interval_minutes: 60,
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const data = await trackingAPI.getAll();
      setConfigs(data);
    } catch (error) {
      console.error('Failed to fetch tracking configs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const configData = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
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
    } catch (error) {
      console.error('Failed to save tracking config:', error);
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
      } catch (error) {
        console.error('Failed to delete tracking config:', error);
      }
    }
  };

  const handleToggleActive = async (config: TrackingConfig) => {
    try {
      await trackingAPI.update(config.id, { is_active: !config.is_active });
      fetchConfigs();
    } catch (error) {
      console.error('Failed to toggle tracking config:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tracking configurations...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tracking Configurations</h1>
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tracking
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keywords
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {configs.map((config) => (
                <tr key={config.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {config.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {config.tracking_type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {config.keywords.slice(0, 3).map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {keyword}
                        </span>
                      ))}
                      {config.keywords.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{config.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {config.check_interval_minutes} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(config)}
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        config.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <Power className="w-3 h-3 mr-1" />
                      {config.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(config)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(config.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {configs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No tracking configurations found. Create one to start monitoring.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingConfig ? 'Edit Tracking Configuration' : 'Add Tracking Configuration'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={formData.tracking_type}
                        onChange={(e) => setFormData({ ...formData, tracking_type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="research">Research</option>
                        <option value="patent">Patent</option>
                        <option value="news">News</option>
                        <option value="social_media">Social Media</option>
                        <option value="competitor">Competitor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.keywords}
                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="AI, machine learning, neural networks"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check Interval (minutes)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.check_interval_minutes}
                        onChange={(e) => setFormData({ ...formData, check_interval_minutes: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingConfig ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
