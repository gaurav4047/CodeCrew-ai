import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case 'critical':
      case 'action_required':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
      case 'info':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'healthy':
      case 'active':
      case 'running':
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'degraded':
      case 'recovered':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border tracking-wide uppercase whitespace-nowrap ${getStyle(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
};
