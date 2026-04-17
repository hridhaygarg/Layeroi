import React from 'react';
import { AlertCircle } from 'lucide-react';

export const TextArea = React.forwardRef(
  (
    {
      placeholder,
      value,
      onChange,
      error = false,
      errorMessage,
      disabled = false,
      required = false,
      rows = 3,
      className = '',
      ...rest
    },
    ref
  ) => {
    const baseClasses =
      'w-full px-3 py-2 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed resize-none font-normal';

    const errorClasses = error ? 'border-red-500' : '';

    const combinedClasses = `
      ${baseClasses}
      ${errorClasses}
      ${className}
    `.trim();

    return (
      <div className="flex flex-col">
        <div className="relative">
          <textarea
            ref={ref}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            rows={rows}
            className={combinedClasses}
            {...rest}
          />
          {error && (
            <div className="absolute right-3 top-3 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>
        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
