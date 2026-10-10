import React from 'react';
import { useApp } from '../contexts/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map(toast => {
        let Icon = Info;
        let borderClass = 'border-[#2A3040]';
        let iconClass = 'text-[#7C5CFC]';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-[#35C98A]/30';
          iconClass = 'text-[#35C98A]';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-[#F06464]/30';
          iconClass = 'text-[#F06464]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-[#181C26]/95 backdrop-blur-md border ${borderClass} shadow-xl shadow-black/40 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#F5F7FA] leading-tight truncate">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[#A3AABD] mt-1 line-clamp-2 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#A3AABD] hover:text-[#F5F7FA] transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
