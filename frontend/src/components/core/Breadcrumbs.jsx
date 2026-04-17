import React from 'react';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = React.forwardRef(
  (
    {
      items = [],
      separator = '/',
      className = '',
      ...rest
    },
    ref
  ) => {
    const baseClasses = 'flex items-center gap-1';
    const combinedClasses = `
      ${baseClasses}
      ${className}
    `.trim();

    return (
      <nav
        ref={ref}
        className={combinedClasses}
        aria-label="Breadcrumbs"
        {...rest}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-gray-500 text-sm mx-1">{separator}</span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-gray-700 text-sm font-medium">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
