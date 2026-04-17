import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const toastTypeConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    text: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    text: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    text: 'text-yellow-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    text: 'text-blue-800',
  },
};

export const Toast = React.forwardRef(
  (
    {
      message,
      type = 'info',
      duration = 3000,
      onDismiss,
      className = '',
      ...rest
    },
    ref
  ) => {
    const config = toastTypeConfig[type] || toastTypeConfig.info;
    const Icon = config.icon;

    useEffect(() => {
      if (duration) {
        const timer = setTimeout(() => {
          onDismiss?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onDismiss]);

    const combinedClasses = `
      flex items-center gap-3 rounded-lg shadow-lg border p-4
      ${config.bg}
      ${config.border}
      ${config.text}
      ${className}
    `.trim();

    return (
      <div ref={ref} className={combinedClasses} role="alert" {...rest}>
        <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
        <p className="flex-1">{message}</p>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
);

Toast.displayName = 'Toast';
