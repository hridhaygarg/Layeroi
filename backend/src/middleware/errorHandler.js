import { logger } from '../utils/logger.js';

/**
 * Custom application error class
 * Standardizes error responses across backend
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', meta = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.meta = meta;
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.meta.retryAfter && { retryAfter: this.meta.retryAfter }),
        ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
      }
    };
  }
}

/**
 * Express error handling middleware
 * Must be last middleware registered
 * Catches all errors and sends standardized response
 */
export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error('Request error', {
    error: err.message,
    code: err.code || 'UNKNOWN',
    status: err.statusCode || 500,
    method: req.method,
    path: req.path,
    stack: err.stack
  });

  // Default to 500 if not specified
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  // Handle different error types
  let message = err.message || 'Internal server error';

  if (err.code === 'INVALID_INPUT') {
    message = 'Invalid input provided';
  } else if (err.code === 'UNAUTHORIZED') {
    message = 'Authentication required';
  } else if (err.code === 'FORBIDDEN') {
    message = 'Access denied';
  } else if (err.code === 'NOT_FOUND') {
    message = 'Resource not found';
  } else if (err.code === 'RATE_LIMITED') {
    message = 'Too many requests. Please try again later.';
    res.set('Retry-After', err.meta?.retryAfter || 60);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(err.meta?.retryAfter && { retryAfter: err.meta.retryAfter }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * Middleware to catch async route errors
 * Wraps async handlers to catch promise rejections
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;
