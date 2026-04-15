/**
 * Performance Optimization Utilities
 * Lazy loading, font optimization, debounce, throttle, and performance metrics
 */

/**
 * Debounce function - delays execution until after n milliseconds
 * Useful for search, input validation, resize handlers
 *
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, delay = 300) {
  let timeoutId = null;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Throttle function - executes function at most once every n milliseconds
 * Useful for scroll, resize, mousemove events
 *
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between executions in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle = false;

  return function throttled(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Lazy load images with intersection observer
 * Improves initial page load by deferring image loading
 *
 * @param {HTMLImageElement} img - Image element to lazy load
 * @param {Object} options - IntersectionObserver options
 */
export function lazyLoadImage(img, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
  };

  const observerOptions = { ...defaultOptions, ...options };

  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without IntersectionObserver
    img.src = img.dataset.src;
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, observerOptions);

  observer.observe(img);
}

/**
 * Lazy load all images in a container
 *
 * @param {HTMLElement} container - Container with images to lazy load
 */
export function lazyLoadImages(container = document) {
  const images = container.querySelectorAll('img[data-src]');
  images.forEach((img) => lazyLoadImage(img));
}

/**
 * Preload resources (fonts, images, scripts)
 * Improves subsequent page navigation
 *
 * @param {string} url - Resource URL
 * @param {string} type - Resource type: 'style', 'script', 'image', 'font'
 */
export function preloadResource(url, type = 'style') {
  const link = document.createElement('link');

  switch (type) {
    case 'style':
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      break;
    case 'script':
      link.rel = 'preload';
      link.as = 'script';
      link.href = url;
      break;
    case 'image':
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      break;
    case 'font':
      link.rel = 'preload';
      link.as = 'font';
      link.href = url;
      link.crossOrigin = 'anonymous';
      break;
    default:
      return;
  }

  document.head.appendChild(link);
}

/**
 * Request animation frame wrapper for smooth animations
 *
 * @param {Function} callback - Function to execute on next frame
 * @returns {number} - Request ID for cancellation
 */
export function requestAnimFrame(callback) {
  return window.requestAnimationFrame(callback);
}

/**
 * Cancel animation frame
 *
 * @param {number} id - Request ID from requestAnimFrame
 */
export function cancelAnimFrame(id) {
  window.cancelAnimationFrame(id);
}

/**
 * Performance monitoring - measure time between operations
 *
 * @param {string} label - Label for measurement
 * @param {Function} callback - Operation to measure
 * @returns {Promise} - Promise that resolves with execution time
 */
export async function measurePerformance(label, callback) {
  const startTime = performance.now();

  try {
    await callback();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (window.performance && window.performance.measure) {
      try {
        performance.mark(label + '-end');
        performance.measure(label, label + '-start', label + '-end');
      } catch (e) {
        // Measurement not supported
      }
    }

    return {
      label,
      duration,
      success: true,
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    return {
      label,
      duration,
      success: false,
      error,
    };
  }
}

/**
 * Get performance metrics
 * Navigation timing, resource timing, paint timing
 *
 * @returns {Object} - Performance metrics
 */
export function getPerformanceMetrics() {
  if (!window.performance || !window.performance.timing) {
    return null;
  }

  const timing = window.performance.timing;

  return {
    // Navigation timing
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    ttfb: timing.responseStart - timing.requestStart,
    download: timing.responseEnd - timing.responseStart,
    domInteractive: timing.domInteractive - timing.responseEnd,
    domComplete: timing.domComplete - timing.domLoading,
    loadComplete: timing.loadEventEnd - timing.loadEventStart,
    total: timing.loadEventEnd - timing.navigationStart,

    // Paint timing
    firstPaint: getFirstPaint(),
    firstContentfulPaint: getFirstContentfulPaint(),

    // Resource metrics
    resourceCount: getResourceCount(),
    totalResourceSize: getTotalResourceSize(),
  };
}

/**
 * Get First Paint time (FP)
 *
 * @returns {number} - Time in milliseconds
 */
export function getFirstPaint() {
  if (!window.performance || !window.performance.getEntriesByType) {
    return 0;
  }

  const paintEntries = window.performance.getEntriesByType('paint');
  const fp = paintEntries.find((entry) => entry.name === 'first-paint');

  return fp ? Math.round(fp.startTime) : 0;
}

/**
 * Get First Contentful Paint time (FCP)
 *
 * @returns {number} - Time in milliseconds
 */
export function getFirstContentfulPaint() {
  if (!window.performance || !window.performance.getEntriesByType) {
    return 0;
  }

  const paintEntries = window.performance.getEntriesByType('paint');
  const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');

  return fcp ? Math.round(fcp.startTime) : 0;
}

/**
 * Get total number of resources loaded
 *
 * @returns {number} - Resource count
 */
export function getResourceCount() {
  if (!window.performance || !window.performance.getEntriesByType) {
    return 0;
  }

  return window.performance.getEntriesByType('resource').length;
}

/**
 * Get total size of all resources
 *
 * @returns {number} - Total size in bytes
 */
export function getTotalResourceSize() {
  if (!window.performance || !window.performance.getEntriesByType) {
    return 0;
  }

  const resources = window.performance.getEntriesByType('resource');
  return resources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
}

/**
 * Monitor Core Web Vitals
 * LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift)
 *
 * @param {Object} callbacks - Object with lcp, fid, cls callbacks
 * @returns {Function} - Cleanup function
 */
export function monitorWebVitals(callbacks = {}) {
  const cleanup = [];

  // LCP - Largest Contentful Paint
  if (callbacks.lcp && 'PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        callbacks.lcp(lastEntry.renderTime || lastEntry.loadTime);
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      cleanup.push(() => lcpObserver.disconnect());
    } catch (e) {
      // LCP not supported
    }
  }

  // FID - First Input Delay
  if (callbacks.fid && 'PerformanceObserver' in window) {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          callbacks.fid(entry.processingDuration);
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
      cleanup.push(() => fidObserver.disconnect());
    } catch (e) {
      // FID not supported
    }
  }

  // CLS - Cumulative Layout Shift
  if (callbacks.cls && 'PerformanceObserver' in window) {
    try {
      let cls = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            cls += entry.value;
            callbacks.cls(cls);
          }
        });
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
      cleanup.push(() => clsObserver.disconnect());
    } catch (e) {
      // CLS not supported
    }
  }

  // Return cleanup function
  return () => {
    cleanup.forEach((fn) => fn());
  };
}

/**
 * Optimize font loading with font-display and preload
 * Should be called early in app lifecycle
 */
export function optimizeFontLoading() {
  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
  ];

  criticalFonts.forEach((fontUrl) => {
    preloadResource(fontUrl, 'style');
  });
}

/**
 * Enable connection optimization
 * Preconnect, DNS prefetch to faster domains
 */
export function optimizeConnections() {
  const preconnectUrls = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  preconnectUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Batch DOM updates for better performance
 * Useful for multiple DOM manipulations
 *
 * @param {Function} callback - Function containing DOM updates
 */
export function batchDOMUpdates(callback) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
}

export default {
  debounce,
  throttle,
  lazyLoadImage,
  lazyLoadImages,
  preloadResource,
  requestAnimFrame,
  cancelAnimFrame,
  measurePerformance,
  getPerformanceMetrics,
  getFirstPaint,
  getFirstContentfulPaint,
  getResourceCount,
  getTotalResourceSize,
  monitorWebVitals,
  optimizeFontLoading,
  optimizeConnections,
  batchDOMUpdates,
};
