import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertTriangle, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface AlertSummaryItem {
  id: number;
  title: string;
  severity: string;
  time: string;
  read: boolean;
}

const AlertCenterWidget: React.FC<{ items?: AlertSummaryItem[]; loading?: boolean }> = ({ items, loading }) => {
  if (loading) {
    return <div className="h-44 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  const list = items || [
    { id: 1, title: "New Competitor Patent Published: US20260191A1", severity: "critical", time: "10 mins ago", read: false },
    { id: 2, title: "Breakthrough Research Preprint: 3D Radiology Transformers", severity: "high", time: "2 hours ago", read: false }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-red-600 animate-bounce" />
          <h3 className="font-bold text-base text-slate-900">Priority Alerts Center</h3>
        </div>
        <Link to="/alerts" className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1">
          <span>View All Alerts</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2">
        {list.map((al) => (
          <div key={al.id} className="p-3 bg-red-50/40 border border-red-100 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {al.severity === 'critical' ? (
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className="font-bold text-slate-900 truncate">{al.title}</span>
            </div>

            <span className="text-[10px] font-mono text-slate-400 shrink-0">{al.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertCenterWidget;
