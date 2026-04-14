import { motion } from 'framer-motion';

export function PremiumButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  className = '',
  fullWidth = false,
}) {
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    accent: 'btn btn-accent',
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
    loading: {
      scale: 1,
    },
  };

  return (
    <motion.button
      className={`${variantClasses[variant]} ${sizeStyles[size]} ${className} ${
        fullWidth ? 'w-full' : ''
      }`}
      whileHover={!disabled && !loading ? 'hover' : {}}
      whileTap={!disabled && !loading ? 'tap' : {}}
      variants={buttonVariants}
      disabled={disabled || loading}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'inline-block' }}
        >
          ⟳
        </motion.div>
      ) : icon ? (
        <>
          <span>{icon}</span>
          {children}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

export function PremiumIconButton({ icon, onClick, variant = 'secondary', size = 'md' }) {
  return (
    <motion.button
      className={`btn btn-${variant} rounded-full w-10 h-10 flex items-center justify-center`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {icon}
    </motion.button>
  );
}
