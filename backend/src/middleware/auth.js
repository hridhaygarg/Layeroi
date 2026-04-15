import { verifyToken } from '../auth/jwt.js';
import { logger } from '../utils/logger.js';
import { AppError } from './errorHandler.js';

/**
 * Express middleware to verify JWT token from Authorization header
 * Attaches verified user to req.user
 * Throws 401 if token is invalid, expired, or missing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {AppError} 401 if token is invalid or missing
 */
export function verifyAuth(req, res, next) {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid Authorization header', {
        path: req.path,
        method: req.method
      });
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      logger.warn('Token verification failed', {
        path: req.path,
        error: err.message
      });
      throw new AppError('Invalid or expired token', 401, 'UNAUTHORIZED');
    }

    // Attach decoded user to request
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      org_id: decoded.org_id,
      type: decoded.type,
      mfa_enabled: decoded.mfa_enabled,
      mfa_verified_at: decoded.mfa_verified_at
    };

    logger.debug('User authenticated', { userId: req.user.id });
    next();
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        error: {
          code: err.code,
          message: err.message
        }
      });
    }

    logger.error('Unexpected error in verifyAuth', { error: err.message });
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
}

/**
 * Express middleware to require MFA verification
 * Checks if user has MFA enabled and verifies recent MFA verification
 * Throws 403 if MFA is required but not recently verified
 * @param {Object} req - Express request object with req.user already set by verifyAuth
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {AppError} 403 if MFA is required but not verified
 */
export function requireMFA(req, res, next) {
  try {
    // Ensure verifyAuth was called first
    if (!req.user) {
      logger.warn('requireMFA called without user context', {
        path: req.path
      });
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    // Check if MFA is enabled
    if (!req.user.mfa_enabled) {
      logger.debug('MFA not required for user', { userId: req.user.id });
      return next();
    }

    // Check if MFA was recently verified
    const SESSION_TTL = 86400000; // 24 hours in milliseconds
    if (req.user.mfa_verified_at) {
      const mfaVerifiedTime = new Date(req.user.mfa_verified_at).getTime();
      const now = Date.now();
      const timeSinceMFAVerification = now - mfaVerifiedTime;

      if (timeSinceMFAVerification < SESSION_TTL) {
        logger.debug('MFA verification is current', { userId: req.user.id });
        return next();
      }
    }

    logger.warn('MFA verification required but not provided', {
      userId: req.user.id,
      path: req.path
    });
    throw new AppError('MFA verification required', 403, 'MFA_REQUIRED');
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        error: {
          code: err.code,
          message: err.message
        }
      });
    }

    logger.error('Unexpected error in requireMFA', { error: err.message });
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
}

/**
 * Optional authentication middleware
 * Tries to extract and verify token, but doesn't throw if invalid
 * Attaches user to req.user if token is valid, leaves undefined otherwise
 * Useful for endpoints that work with or without authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function attachUser(req, res, next) {
  try {
    // Try to extract Bearer token
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = verifyToken(token);

        // Attach user if verification succeeds
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          org_id: decoded.org_id,
          type: decoded.type,
          mfa_enabled: decoded.mfa_enabled,
          mfa_verified_at: decoded.mfa_verified_at
        };

        logger.debug('Optional user attached', { userId: req.user.id });
      } catch (err) {
        // Token verification failed, but we don't throw
        logger.debug('Optional token verification failed, continuing without auth', {
          error: err.message
        });
        req.user = undefined;
      }
    }

    // Continue regardless of token presence or validity
    next();
  } catch (err) {
    logger.error('Unexpected error in attachUser', { error: err.message });
    // Even on unexpected error, continue (optional auth)
    next();
  }
}

export default {
  verifyAuth,
  requireMFA,
  attachUser
};
