import { motion } from 'framer-motion';
import { useState } from 'react';

export function PremiumNav({ items = [], logo, onNavigate }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="font-bold text-xl font-serif"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {logo}
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {items.map((item, index) => (
              <motion.div
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.button
                  className="text-gray-700 font-medium text-sm transition-colors"
                  onClick={() => onNavigate?.(item.href)}
                  animate={{
                    color: hoveredIndex === index ? '#16a34a' : '#374151',
                  }}
                >
                  {item.label}
                </motion.button>

                {/* Underline Animation */}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-400"
                    layoutId="underline"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1"
            onClick={() => setIsOpen(!isOpen)}
            animate={{ rotate: isOpen ? 90 : 0 }}
          >
            <motion.div
              className="w-6 h-0.5 bg-gray-700"
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 8 : 0,
              }}
            />
            <motion.div
              className="w-6 h-0.5 bg-gray-700"
              animate={{
                opacity: isOpen ? 0 : 1,
              }}
            />
            <motion.div
              className="w-6 h-0.5 bg-gray-700"
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -8 : 0,
              }}
            />
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden pb-4 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {items.map((item) => (
              <motion.button
                key={item.label}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  onNavigate?.(item.href);
                  setIsOpen(false);
                }}
                whileHover={{ x: 4 }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
