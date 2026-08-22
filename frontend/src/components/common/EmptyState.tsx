import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Items Available',
  description = 'No intelligence data matches your request or current filter.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 shadow-xs ${className}`}>
      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <SearchX className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-base text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
