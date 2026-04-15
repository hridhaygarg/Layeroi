import { describe, it, expect, beforeEach, vi } from 'vitest';
import { verifyAuth, requireMFA, attachUser } from '../auth.js';

// Mock dependencies
vi.mock('../../auth/jwt.js');
vi.mock('../../utils/logger.js');

import { verifyToken } from '../../auth/jwt.js';
import { logger } from '../../utils/logger.js';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      headers: {},
      ip: '127.0.0.1',
      connection: { remoteAddress: '127.0.0.1' }
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    next = vi.fn();

    // Setup logger mocks
    logger.warn = vi.fn();
    logger.debug = vi.fn();
    logger.error = vi.fn();
    logger.info = vi.fn();
  });

  describe('verifyAuth Middleware', () => {
    it('should attach user to request when token is valid', () => {
      const token = 'valid-token';
      req.headers.authorization = `Bearer ${token}`;

      verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        email: 'test@example.com',
        org_id: 'org-123',
        type: 'access'
      });

      verifyAuth(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('user-123');
      expect(req.user.email).toBe('test@example.com');
      expect(req.user.org_id).toBe('org-123');
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject request without Authorization header', () => {
      verifyAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'UNAUTHORIZED'
          })
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with malformed Authorization header', () => {
      req.headers.authorization = 'InvalidToken';

      verifyAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', () => {
      const token = 'invalid-token';
      req.headers.authorization = `Bearer ${token}`;

      verifyToken.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      verifyAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token'
          })
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should extract token after "Bearer " prefix', () => {
      const token = 'my-valid-token';
      req.headers.authorization = `Bearer ${token}`;

      verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        type: 'access'
      });

      verifyAuth(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith(token);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireMFA Middleware', () => {
    it('should allow access when MFA is not enabled', () => {
      req.user = {
        id: 'user-123',
        mfa_enabled: false
      };

      requireMFA(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access when MFA is enabled and recently verified', () => {
      const now = Date.now();
      const oneHourAgo = now - 3600000;

      req.user = {
        id: 'user-123',
        mfa_enabled: true,
        mfa_verified_at: new Date(oneHourAgo).toISOString()
      };

      requireMFA(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject when MFA is enabled but not verified', () => {
      req.user = {
        id: 'user-123',
        mfa_enabled: true,
        mfa_verified_at: undefined
      };

      requireMFA(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 'MFA_REQUIRED',
            message: 'MFA verification required'
          })
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject when MFA verification is older than 24 hours', () => {
      const now = Date.now();
      const moreThan24HoursAgo = now - (86400000 + 1000); // 24h + 1s

      req.user = {
        id: 'user-123',
        mfa_enabled: true,
        mfa_verified_at: new Date(moreThan24HoursAgo).toISOString()
      };

      requireMFA(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject when user is not attached', () => {
      requireMFA(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('attachUser Middleware (Optional Auth)', () => {
    it('should attach user when valid token is provided', () => {
      const token = 'valid-token';
      req.headers.authorization = `Bearer ${token}`;

      verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        email: 'test@example.com',
        org_id: 'org-123',
        type: 'access'
      });

      attachUser(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe('user-123');
      expect(next).toHaveBeenCalled();
    });

    it('should continue without user when no token is provided', () => {
      attachUser(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should continue without user when token is invalid', () => {
      const token = 'invalid-token';
      req.headers.authorization = `Bearer ${token}`;

      verifyToken.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      attachUser(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should continue without user when Authorization header is malformed', () => {
      req.headers.authorization = 'InvalidFormat';

      attachUser(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', () => {
      req.headers.authorization = 'Bearer valid-token';

      verifyToken.mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      attachUser(req, res, next);

      // Should still call next and not throw
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });
  });
});
