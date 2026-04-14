import { motion } from 'framer-motion';
import { useState } from 'react';

export function PremiumInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  success,
  disabled,
  icon,
  className = '',
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div className={`w-full ${className}`}>
      {label && (
        <motion.label
          initial={{ opacity: 0.7, y: 2 }}
          animate={{
            opacity: isFocused || value ? 1 : 0.7,
            y: isFocused || value ? -4 : 2,
          }}
          className="text-sm font-medium text-gray-700 mb-2 inline-block"
        >
          {label}
        </motion.label>
      )}

      <motion.div
        className="relative"
        animate={{
          borderColor: error ? '#dc2626' : success ? '#16a34a' : isFocused ? '#0066ff' : '#e2e8f0',
        }}
      >
        {icon && (
          <motion.div
            className="absolute left-4 top-1/2 text-gray-400"
            animate={{ color: isFocused ? '#0066ff' : '#9ca3af' }}
          >
            {icon}
          </motion.div>
        )}

        <motion.input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`input ${icon ? 'pl-10' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {success && (
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            ✓
          </motion.div>
        )}

        {error && (
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            ✕
          </motion.div>
        )}
      </motion.div>

      {error && (
        <motion.p
          className="text-red-500 text-sm mt-2"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      {success && (
        <motion.p
          className="text-green-500 text-sm mt-2"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {success}
        </motion.p>
      )}
    </motion.div>
  );
}
