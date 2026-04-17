import React from 'react';

const colorMap = {
  primary: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  danger: 'bg-red-600',
  gray: 'bg-gray-600',
};

export const Progress = React.forwardRef(
  (
    {
      value = 0,
      color = 'primary',
      showLabel = false,
      max = 100,
      className = '',
      ...rest
    },
    ref
  ) => {
    const percentage = Math.min(Math.max(value, 0), max);
    const displayPercentage = Math.round((percentage / max) * 100);
    const colorClass = colorMap[color] || colorMap.primary;

    const combinedClasses = `
      w-full bg-gray-200 rounded-full overflow-hidden h-2
      ${className}
    `.trim();

    return (
      <div
        ref={ref}
        className={combinedClasses}
        role="progressbar"
        aria-valuenow={displayPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Progress"
        {...rest}
      >
        <div
          className={`h-full ${colorClass} transition-all duration-300 ease-out`}
          style={{ width: `${displayPercentage}%` }}
        />
        {showLabel && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-700">
            {displayPercentage}%
          </span>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
