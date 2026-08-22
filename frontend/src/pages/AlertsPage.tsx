import React, { useState } from 'react';
import { Bell, AlertTriangle, ShieldAlert, Trash2, Check } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'New Competitor Patent Published: US20260191A1',
      severity: 'critical',
      timestamp: '10 mins ago',
      category: 'Patent Filing',
      summary: 'Interconnect Tech filed low-latency neuromorphic interposer claims directly targeting edge compute memory bandwidth.',
      read: false
    },
    {
      id: 2,
      title: 'Breakthrough Research Preprint: 3D Radiology Transformers',
      severity: 'high',
      timestamp: '2 hours ago',
      category: 'Academic Paper',
      summary: 'Stanford AI Health released arXiv paper evaluating 12,000 CT scans with 98.4% diagnostic sensitivity.',
      read: false
    },
    {
      id: 3,
      title: 'FDA Breakthrough Device Status Granted for AI Diagnostics',
      severity: 'medium',
      timestamp: '1 day ago',
      category: 'Regulatory',
      summary: 'Regulatory approval granted for 3D automated nodule detection platform.',
      read: true
    }
  ]);

  const toggleRead = (id: number) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-600 animate-bounce" />
            Competitive Intelligence Alerts
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-Time Notifications • Critical IP Filings • Product Shifts • Threat Radar
          </p>
        </div>
        <span className="text-xs bg-rose-100 text-rose-800 px-3 py-1 rounded-full font-mono font-medium">
          {alerts.filter((a) => !a.read).length} Unread Priority Alerts
        </span>
      </div>

      {alerts.length === 0 ? (
        <EmptyState title="No Active Alerts" description="You have reviewed and cleared all priority alerts." />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
                alert.read ? 'bg-slate-50/80 border-slate-200 opacity-80' : 'bg-white border-rose-200 shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 shrink-0">
                  {alert.severity === 'critical' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <StatusBadge status={alert.severity} />
                    <span className="text-xs text-slate-400 font-mono">{alert.timestamp}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                      {alert.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{alert.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.summary}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                {!alert.read && (
                  <button
                    onClick={() => toggleRead(alert.id)}
                    className="text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Read</span>
                  </button>
                )}
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="text-xs bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 p-1.5 rounded-xl border border-slate-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
