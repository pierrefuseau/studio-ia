import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

const toastStyles = {
  success: { icon: 'text-emerald-600', bar: 'bg-emerald-500' },
  error: { icon: 'text-red-600', bar: 'bg-red-500' },
  info: { icon: 'text-blue-600', bar: 'bg-blue-500' },
  warning: { icon: 'text-amber-600', bar: 'bg-amber-500' },
};

function ToastItem({ id, type, title, description, duration = 5000, onRemove }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const Icon = toastIcons[type];
  const style = toastStyles[type];

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onRemove(id);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [id, duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="pointer-events-auto w-full sm:w-auto sm:min-w-[320px] sm:max-w-sm overflow-hidden rounded-xl bg-white border border-gray-200 shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex gap-3 p-3 sm:p-4">
        <div className={`mt-0.5 ${style.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {description && (
            <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{description}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(id)}
          className="shrink-0 rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Fermer la notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="h-0.5 w-full bg-gray-100">
        <div
          className={`h-full ${style.bar} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}

const ToastContext = React.createContext<{
  addToast: (toast: Omit<Toast, 'id'>) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <div
          className="fixed bottom-0 right-0 z-[200] flex flex-col gap-2 p-3 sm:p-4 pointer-events-none w-full sm:w-auto sm:max-w-sm"
          aria-label="Notifications"
          role="region"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
            ))}
          </AnimatePresence>
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
