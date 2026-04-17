import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    // Variant styles
    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-lg transition-colors duration-200 ring-2 ring-transparent focus:ring-offset-0 focus:ring-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed';

    const combinedClasses = `
      ${baseClasses}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${loading ? 'opacity-75' : ''}
      ${className}
    `.trim();

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
