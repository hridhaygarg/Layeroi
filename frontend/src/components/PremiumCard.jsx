import { motion } from 'framer-motion';

export function PremiumCard({
  children,
  className = '',
  elevated = false,
  interactive = true,
  delay = 0,
  onClick,
  hover = true,
}) {
  return (
    <motion.div
      className={`card ${elevated ? 'card-elevated' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={
        hover && interactive
          ? {
              y: -8,
              boxShadow:
                '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
            }
          : {}
      }
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      style={{ cursor: interactive && onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
}

export function PremiumCardGrid({ children, cols = 3, gap = 24 }) {
  return (
    <motion.div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
        gap: `${gap}px`,
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
