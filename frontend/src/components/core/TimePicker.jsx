import React, { useState } from 'react';
import { Clock } from 'lucide-react';

export const TimePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      disabled = false,
      placeholder = 'Select time...',
      className = '',
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState(
      value ? parseInt(value.split(':')[0]) : 0
    );
    const [minutes, setMinutes] = useState(
      value ? parseInt(value.split(':')[1]) : 0
    );

    const handleHourChange = (e) => {
      const newHours = parseInt(e.target.value);
      setHours(newHours);
      const timeString = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      onChange?.(timeString);
    };

    const handleMinuteChange = (e) => {
      const newMinutes = parseInt(e.target.value);
      setMinutes(newMinutes);
      const timeString = `${String(hours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
      onChange?.(timeString);
    };

    const displayValue = value || '';

    const baseClasses =
      'w-full px-3 py-2 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

    const combinedClasses = `
      ${baseClasses}
      ${className}
    `.trim();

    return (
      <div className="relative">
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            ref={ref}
            type="text"
            value={displayValue}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly
            className={`pl-10 cursor-pointer ${combinedClasses}`}
            {...rest}
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours
                </label>
                <select
                  value={hours}
                  onChange={handleHourChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minutes
                </label>
                <select
                  value={minutes}
                  onChange={handleMinuteChange}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        )}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';
