import React from 'react';

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export const Avatar = React.forwardRef(
  (
    {
      src,
      initials,
      size = 'md',
      alt = 'Avatar',
      className = '',
      ...rest
    },
    ref
  ) => {
    const sizeClass = sizeMap[size] || sizeMap.md;

    const combinedClasses = `
      inline-flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-semibold
      ${sizeClass}
      ${className}
    `.trim();

    if (src) {
      return (
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={`rounded-full ${sizeClass} object-cover ${className}`.trim()}
          {...rest}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={combinedClasses}
        {...rest}
      >
        {initials || '?'}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
