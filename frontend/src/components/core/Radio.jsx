import React from 'react';

export const Radio = React.forwardRef(
  (
    {
      checked = false,
      onChange,
      disabled = false,
      label,
      id,
      name,
      value,
      className = '',
      ...rest
    },
    ref
  ) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={radioId}
          type="radio"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          name={name}
          value={value}
          className="sr-only"
          aria-label={label}
          {...rest}
        />
        <label
          htmlFor={radioId}
          className={`
            flex items-center justify-center h-5 w-5 rounded-full border-2 cursor-pointer
            transition-colors duration-200
            ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `.trim()}
        >
          {checked && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </label>
        {label && (
          <label
            htmlFor={radioId}
            className={`text-sm font-medium cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
