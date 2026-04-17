import React from 'react';

export const Toggle = React.forwardRef(
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
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          id={toggleId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          {...rest}
        />
        <label
          htmlFor={toggleId}
          className={`
            relative inline-block h-6 w-11 rounded-full cursor-pointer
            transition-colors duration-200
            ${checked ? 'bg-blue-600' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `.trim()}
        >
          <span
            className={`
              absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white
              transition-transform duration-200
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `.trim()}
          />
        </label>
        {label && (
          <label
            htmlFor={toggleId}
            className={`text-sm font-medium cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
