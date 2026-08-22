import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowUpRight } from 'lucide-react';

interface ReportsData {
  recent_reports_count?: number;
  supported_formats?: string[];
  last_generated?: string;
}

const ReportsSummaryWidget: React.FC<{ data?: ReportsData; loading?: boolean }> = ({ data, loading }) => {
  if (loading) {
    return <div className="h-36 bg-slate-100 rounded-2xl animate-pulse"></div>;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-base text-slate-900">Executive Reports Summary</h3>
        </div>
        <Link to="/reports" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
          <span>View Reports</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex items-center justify-between text-xs font-mono">
        <span>Available Formats: <strong className="text-slate-900 font-bold">PDF / CSV / JSON</strong></span>
        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">
          {data?.recent_reports_count || 3} Reports Ready
        </span>
      </div>

      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate">
        Last Generated: <strong>{data?.last_generated || '360° AI Medical Diagnosis Executive Intelligence Briefing'}</strong>
      </p>
    </div>
  );
};

export default ReportsSummaryWidget;
