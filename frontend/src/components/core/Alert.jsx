import React from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const alertTypeConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    textColor: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    textColor: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    textColor: 'text-yellow-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    textColor: 'text-blue-800',
  },
};

export const Alert = React.forwardRef(
  (
    {
      type = 'info',
      title,
      description,
      onClose,
      showCloseButton = true,
      className = '',
      ...rest
    },
    ref
  ) => {
    const config = alertTypeConfig[type] || alertTypeConfig.info;
    const Icon = config.icon;

    const combinedClasses = `
      rounded-lg border p-4
      ${config.bg}
      ${config.border}
      ${className}
    `.trim();

    return (
      <div
        ref={ref}
        role="alert"
        className={combinedClasses}
        {...rest}
      >
        <div className="flex gap-3">
          <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
          <div className="flex-1">
            {title && (
              <h3 className={`font-semibold ${config.titleColor}`}>
                {title}
              </h3>
            )}
            {description && (
              <p className={`mt-1 text-sm ${config.textColor}`}>
                {description}
              </p>
            )}
          </div>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className={`flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors ${config.iconColor}`}
              aria-label="Close alert"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
