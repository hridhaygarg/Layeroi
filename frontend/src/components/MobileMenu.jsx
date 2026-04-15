import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

/**
 * MobileMenu Component
 * Animated mobile navigation menu with Framer Motion
 * Shows/hides menu with smooth animations
 */
export function MobileMenu({ items = [], onItemClick, isOpen, onToggle }) {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menuId) => {
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
    onToggle?.(false);
  };

  // Menu list variants for stagger animation
  const menuVariants = {
    closed: { opacity: 0, x: -20 },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 },
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <div className="mobile-menu-container">
      {/* Menu Toggle Button */}
      <motion.button
        className="mobile-menu-toggle"
        onClick={() => onToggle?.(!isOpen)}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1a1a1a',
          zIndex: 40,
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Menu Overlay/Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu-backdrop"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
            onClick={() => onToggle?.(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 30,
            }}
          />
        )}
      </AnimatePresence>

      {/* Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="mobile-menu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              maxWidth: '280px',
              height: '100vh',
              background: '#ffffff',
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
              zIndex: 35,
              overflowY: 'auto',
              paddingTop: '80px',
              paddingBottom: '40px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.ul
              className="mobile-menu-list"
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {items.length > 0 ? (
                items.map((item) => (
                  <motion.li
                    key={item.id}
                    className="mobile-menu-item"
                    variants={itemVariants}
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <motion.button
                      className="mobile-menu-link"
                      onClick={() => {
                        if (item.submenu) {
                          toggleSubmenu(item.id);
                        } else {
                          handleItemClick(item);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        padding: '16px 24px',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      whileHover={{ backgroundColor: '#f5f5f5' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{item.label}</span>
                      {item.submenu && (
                        <motion.span
                          animate={{ rotate: activeSubmenu === item.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          ▼
                        </motion.span>
                      )}
                    </motion.button>

                    {/* Submenu */}
                    <AnimatePresence>
                      {item.submenu && activeSubmenu === item.id && (
                        <motion.ul
                          className="mobile-submenu"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            backgroundColor: '#f9f9f9',
                            overflow: 'hidden',
                          }}
                        >
                          {item.submenu.map((subitem) => (
                            <motion.li
                              key={subitem.id}
                              className="mobile-submenu-item"
                              variants={itemVariants}
                            >
                              <motion.button
                                className="mobile-submenu-link"
                                onClick={() => handleItemClick(subitem)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  width: '100%',
                                  padding: '12px 24px 12px 48px',
                                  textAlign: 'left',
                                  fontSize: '14px',
                                  color: '#666666',
                                  display: 'block',
                                }}
                                whileHover={{ color: '#0066cc' }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {subitem.label}
                              </motion.button>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                ))
              ) : (
                <motion.li variants={itemVariants} style={{ padding: '24px' }}>
                  <p style={{ color: '#999999', fontSize: '14px' }}>No menu items</p>
                </motion.li>
              )}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileMenu;
