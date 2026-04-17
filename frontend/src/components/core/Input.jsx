import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = forwardRef(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      error = false,
      errorMessage,
      disabled = false,
      required = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const baseClasses =
      'w-full px-3 py-2 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

    const errorClasses = error ? 'border-red-500' : '';

    const combinedClasses = `
      ${baseClasses}
      ${errorClasses}
      ${className}
    `.trim();

    return (
      <div className="flex flex-col">
        <div className="relative">
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={combinedClasses}
            {...rest}
          />
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
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

Input.displayName = 'Input';
