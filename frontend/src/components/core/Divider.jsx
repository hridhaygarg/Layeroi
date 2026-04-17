import React from 'react';

export const Divider = React.forwardRef(
  (
    {
      orientation = 'horizontal',
      margin = 'my-4',
      className = '',
      ...rest
    },
    ref
  ) => {
    const baseClasses = 'border-gray-200';
    const orientationClass = orientation === 'vertical' ? 'border-l h-6' : 'border-t w-full';

    const combinedClasses = `
      ${baseClasses}
      ${orientationClass}
      ${margin}
      ${className}
    `.trim();

    return (
      <div
        ref={ref}
        role="separator"
        className={combinedClasses}
        {...rest}
      />
    );
  }
);

Divider.displayName = 'Divider';
