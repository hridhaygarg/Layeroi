import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBox = React.forwardRef(
  (
    {
      value = '',
      onChange,
      onClear,
      placeholder = 'Search...',
      disabled = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const handleClear = () => {
      onClear?.();
      onChange?.({ target: { value: '' } });
    };

    const baseClasses =
      'w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

    const combinedClasses = `
      ${baseClasses}
      ${className}
    `.trim();

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={combinedClasses}
          {...rest}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Clear search"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchBox.displayName = 'SearchBox';
