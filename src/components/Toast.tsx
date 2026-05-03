import { useState, createContext, useContext, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const ToastItem = ({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) => {
  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;
  const bgColor = toast.type === 'success' ? 'bg-green-500/20' : toast.type === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20';
  const borderColor = toast.type === 'success' ? 'border-green-500/50' : toast.type === 'error' ? 'border-red-500/50' : 'border-blue-500/50';
  const iconColor = toast.type === 'success' ? 'text-green-500' : toast.type === 'error' ? 'text-red-500' : 'text-blue-500';

  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-start gap-3 rounded-2xl border ${bgColor} ${borderColor} p-4 shadow-lg shadow-black/10 backdrop-blur-xl`}
      role="alert"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 text-sm leading-6">{toast.message}</div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-muted-foreground hover:text-foreground transition"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      const timer = window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      return () => window.clearTimeout(timer);
    }
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
