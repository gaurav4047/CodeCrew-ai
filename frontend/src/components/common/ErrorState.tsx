import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Data Temporarily Unavailable',
  message = 'Failed to retrieve metrics from backend API source.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900 space-y-3 ${className}`}>
      <div className="flex items-center space-x-2.5">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <h4 className="font-bold text-sm">{title}</h4>
      </div>
      <p className="text-xs text-rose-800 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Source Sync</span>
        </button>
      )}
    </div>
  );
};
