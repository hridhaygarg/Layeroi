import React from 'react';

const colorMap = {
  primary: 'bg-blue-100 text-blue-800 border border-blue-200',
  success: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  danger: 'bg-red-100 text-red-800 border border-red-200',
  gray: 'bg-gray-100 text-gray-800 border border-gray-200',
};

const sizeMap = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const Badge = React.forwardRef(
  (
    {
      label,
      color = 'primary',
      size = 'md',
      className = '',
      ...rest
    },
    ref
  ) => {
    const colorClass = colorMap[color] || colorMap.primary;
    const sizeClass = sizeMap[size] || sizeMap.md;

    const combinedClasses = `
      inline-flex items-center justify-center rounded-full font-medium
      ${colorClass}
      ${sizeClass}
      ${className}
    `.trim();

    return (
      <span
        ref={ref}
        className={combinedClasses}
        {...rest}
      >
        {label}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
