import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps extends Toast {
  onRemove: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  warning: 'text-yellow-600',
};

function ToastComponent({ id, type, title, description, duration = 5000, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = toastIcons[type];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 p-3 sm:p-0 sm:bottom-4 sm:right-4 sm:left-auto bg-white border border-gray-200 rounded-t-lg sm:rounded-lg shadow-sm sm:max-w-sm transition-all duration-300 ${
        isVisible
          ? 'translate-y-0 sm:translate-y-0 sm:translate-x-0 opacity-100'
          : 'translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0'
      }`}
    >
      <div className="flex gap-3 p-3 sm:p-4">
        <Icon className={`w-5 h-5 ${toastColors[type]} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onRemove(id), 300);
          }}
          className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 p-2 sm:p-0 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Context pour gérer les toasts
const ToastContext = React.createContext<{
  addToast: (toast: Omit<Toast, 'id'>) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div className="fixed inset-0 pointer-events-none z-50">
          {toasts.map(toast => (
            <ToastComponent
              key={toast.id}
              {...toast}
              onRemove={removeToast}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}