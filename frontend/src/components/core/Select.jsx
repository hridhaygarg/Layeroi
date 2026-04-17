import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export const Select = forwardRef(
  (
    {
      options = [],
      value,
      onChange,
      placeholder,
      disabled = false,
      multiple = false,
      searchable = false,
      error = false,
      errorMessage,
      className = '',
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Filter options based on search term
    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    // Get display text
    const getDisplayText = () => {
      if (multiple) {
        if (!value || value.length === 0) {
          return placeholder || 'Select items';
        }
        return value.length === 1
          ? `1 item selected`
          : `${value.length} items selected`;
      } else {
        if (!value) {
          return placeholder || 'Select an option';
        }
        const selectedOption = options.find((opt) => opt.value === value);
        return selectedOption ? selectedOption.label : placeholder;
      }
    };

    // Handle option click
    const handleOptionClick = (optionValue) => {
      if (multiple) {
        const newValue = value ? [...value] : [];
        const index = newValue.indexOf(optionValue);
        if (index > -1) {
          newValue.splice(index, 1);
        } else {
          newValue.push(optionValue);
        }
        onChange(newValue);
      } else {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
          setSearchTerm('');
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Reset highlighted index when dropdown closes
    useEffect(() => {
      if (!isOpen) {
        setHighlightedIndex(-1);
      }
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      // Open dropdown with arrow keys or Enter if closed
      if (!isOpen && ['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (filteredOptions.length > 0) {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (filteredOptions.length > 0) {
            setHighlightedIndex((prev) =>
              prev === 0 ? filteredOptions.length - 1 : prev - 1
            );
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions.length > 0) {
            const selected = filteredOptions[highlightedIndex];
            handleOptionClick(selected.value);
            if (!multiple) {
              setIsOpen(false);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
        default:
          break;
      }
    };

    const baseClasses =
      'flex items-center justify-between w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const errorClasses = error ? 'border-red-500' : '';

    const buttonClasses = `
      ${baseClasses}
      ${errorClasses}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `.trim();

    return (
      <div className="flex flex-col">
        <div className="relative" ref={containerRef}>
          <button
            ref={ref}
            className={buttonClasses}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={!disabled ? handleKeyDown : undefined}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            {...rest}
          >
            <span className="text-left flex-1">{getDisplayText()}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isOpen && !disabled && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionClick(option.value)}
                      className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors duration-100 flex items-center gap-2 ${
                        (multiple
                          ? value?.includes(option.value)
                          : value === option.value)
                          ? 'bg-blue-100'
                          : ''
                      } ${index === highlightedIndex ? 'bg-blue-100 outline outline-2 outline-blue-500' : ''}`}
                      role="option"
                      aria-selected={
                        multiple
                          ? value?.includes(option.value) || false
                          : value === option.value
                      }
                    >
                      {multiple && (
                        // Checkbox is for visual feedback only, selection is handled by button click handler.
                        // onChange is empty as we rely on parent button's onClick for state management.
                        <input
                          type="checkbox"
                          checked={value?.includes(option.value) || false}
                          onChange={() => {}}
                          aria-label={option.label}
                          className="w-4 h-4 cursor-pointer"
                        />
                      )}
                      <span>{option.label}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
