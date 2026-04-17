import React from 'react';
import { Check } from 'lucide-react';

export const Checkbox = React.forwardRef(
  (
    {
      checked = false,
      onChange,
      disabled = false,
      label,
      id,
      className = '',
      ...rest
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          aria-label={label}
          {...rest}
        />
        <label
          htmlFor={checkboxId}
          className={`
            flex items-center justify-center h-5 w-5 rounded border-2 cursor-pointer
            transition-colors duration-200
            ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `.trim()}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </label>
        {label && (
          <label
            htmlFor={checkboxId}
            className={`text-sm font-medium cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
