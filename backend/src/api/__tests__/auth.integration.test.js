import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { authRoutes } from '../auth.routes.js';
import { verifyAuth, requireMFA, attachUser } from '../../middleware/auth.js';
import {
  createSession,
  getSession,
  updateSession,
  invalidateSession,
  invalidateAllUserSessions,
  initializeRedis
} from '../../db/session.js';

// Mock dependencies
vi.mock('../../db/client.js');
vi.mock('../../utils/logger.js');
vi.mock('../../auth/password.js');
vi.mock('../../auth/jwt.js');
vi.mock('../../auth/oauth.js');
vi.mock('../../db/session.js');

// Import mocked modules
import { getSupabaseClient } from '../../db/client.js';
import { logger } from '../../utils/logger.js';
import * as passwordModule from '../../auth/password.js';
import * as jwtModule from '../../auth/jwt.js';
import * as oauthModule from '../../auth/oauth.js';

// Setup Express app for testing
const app = express();
app.use(express.json());

// Protected endpoint for testing verifyAuth
app.post('/protected', verifyAuth, (req, res) => {
  res.json({ userId: req.user?.id, message: 'Protected endpoint' });
});

// MFA required endpoint
app.post('/mfa-required', verifyAuth, requireMFA, (req, res) => {
  res.json({ message: 'MFA verified' });
});

// Optional auth endpoint
app.post('/optional', attachUser, (req, res) => {
  res.json({ userId: req.user?.id, authenticated: !!req.user });
});

app.use('/auth', authRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
});

describe('Auth Integration Tests', () => {
  let mockSupabase;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      data: null,
      error: null
    };

    getSupabaseClient.mockReturnValue(mockSupabase);

    // Mock password functions
    passwordModule.hashPassword = vi.fn().mockResolvedValue('$2b$12$...hashed...');
    passwordModule.verifyPassword = vi.fn().mockResolvedValue(true);

    // Mock JWT functions
    jwtModule.generateTokens = vi.fn().mockReturnValue({
      accessToken: 'mock-access-token-valid',
      refreshToken: 'mock-refresh-token-valid',
      expiresIn: 900
    });

    jwtModule.verifyToken = vi.fn().mockReturnValue({
      sub: 'user-123',
      email: 'test@example.com',
      org_id: 'org-123',
      type: 'access'
    });

    jwtModule.generateMFAToken = vi.fn().mockReturnValue('mock-mfa-token');

    // Mock logger
    logger.info = vi.fn();
    logger.error = vi.fn();
    logger.warn = vi.fn();

    // Mock session functions
    createSession.mockResolvedValue({
      sessionId: 'session-123',
      expiresAt: new Date(Date.now() + 86400000).toISOString()
    });
    getSession.mockResolvedValue({
      sessionId: 'session-123',
      userId: 'user-123',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      data: { userAgent: 'test' }
    });
    updateSession.mockResolvedValue({ sessionId: 'session-123' });
    invalidateSession.mockResolvedValue(true);
    invalidateAllUserSessions.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Registration Flow', () => {
    it('should register a new user and return tokens', async () => {
      mockSupabase.select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' }
          })
        })
      });

      mockSupabase.insert.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'user-123',
              email: 'newuser@example.com',
              first_name: 'John',
              last_name: 'Doe',
              status: 'active'
            },
            error: null
          })
        })
      });

      mockSupabase.insert.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'org-123',
              name: "John Doe's Workspace",
              owner_id: 'user-123',
              status: 'active'
            },
            error: null
          })
        })
      });

      mockSupabase.insert.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { user_id: 'user-123', organization_id: 'org-123', role: 'owner' },
            error: null
          })
        })
      });

      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'TestPassword123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.user.organization).toBeDefined();
    });

    it('should allow user to login immediately after registration', async () => {
      mockSupabase.select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'user-123',
              email: 'newuser@example.com',
              password_hash: '$2b$12$...hashed...',
              first_name: 'John',
              last_name: 'Doe',
              mfa_enabled: false
            },
            error: null
          })
        })
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });

  describe('Login Flow', () => {
    it('should login with valid credentials', async () => {
      mockSupabase.select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'user-123',
              email: 'test@example.com',
              password_hash: '$2b$12$...hashed...',
              first_name: 'John',
              last_name: 'Doe',
              mfa_enabled: false
            },
            error: null
          })
        })
      });

      passwordModule.verifyPassword.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject login with invalid password', async () => {
      mockSupabase.select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'user-123',
              email: 'test@example.com',
              password_hash: '$2b$12$...hashed...',
              first_name: 'John',
              last_name: 'Doe',
              mfa_enabled: false
            },
            error: null
          })
        })
      });

      passwordModule.verifyPassword.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login for nonexistent user', async () => {
      mockSupabase.select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' }
          })
        })
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('Protected Endpoint Flow', () => {
    it('should allow access with valid token', async () => {
      const token = 'valid-token';
      jwtModule.verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        email: 'test@example.com',
        type: 'access'
      });

      const response = await request(app)
        .post('/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.userId).toBe('user-123');
      expect(response.body.message).toBe('Protected endpoint');
    });

    it('should reject access without token', async () => {
      const response = await request(app).post('/protected');

      expect(response.status).toBe(401);
    });

    it('should reject access with expired token', async () => {
      jwtModule.verifyToken.mockImplementationOnce(() => {
        const err = new Error('Token expired');
        throw err;
      });

      const response = await request(app)
        .post('/protected')
        .set('Authorization', 'Bearer expired-token');

      expect(response.status).toBe(401);
    });

    it('should logout with valid token', async () => {
      mockSupabase.update.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValue({
          data: {},
          error: null
        })
      });

      jwtModule.verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        type: 'access'
      });

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Logged out');
    });

    it('should reject logout without token', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject logout with expired token', async () => {
      jwtModule.verifyToken.mockImplementationOnce(() => {
        throw new Error('Token expired');
      });

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer expired-token');

      expect(response.status).toBe(401);
    });
  });

  describe('Token Refresh Flow', () => {
    it('should generate new tokens from valid refresh token', async () => {
      mockSupabase.select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'user-123',
              email: 'test@example.com',
              org_id: 'org-123',
              refresh_token_revoked_at: null
            },
            error: null
          })
        })
      });

      jwtModule.verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        type: 'refresh'
      });

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'valid-refresh-token' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(jwtModule.generateTokens).toHaveBeenCalled();
    });

    it('should reject refresh with revoked token', async () => {
      mockSupabase.select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'user-123',
              refresh_token_revoked_at: new Date().toISOString()
            },
            error: null
          })
        })
      });

      jwtModule.verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        type: 'refresh'
      });

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'revoked-refresh-token' });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should reject refresh with invalid token', async () => {
      jwtModule.verifyToken.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('MFA Flow', () => {
    it('should return mfaToken when MFA is enabled', async () => {
      mockSupabase.select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'user-123',
              email: 'test@example.com',
              password_hash: '$2b$12$...hashed...',
              mfa_enabled: true,
              first_name: 'John',
              last_name: 'Doe'
            },
            error: null
          })
        })
      });

      passwordModule.verifyPassword.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.mfaRequired).toBe(true);
      expect(response.body).toHaveProperty('mfaToken');
      expect(response.body).not.toHaveProperty('accessToken');
    });

    it('should require MFA verification for MFA-protected endpoint', async () => {
      jwtModule.verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        email: 'test@example.com',
        type: 'access',
        mfa_enabled: true
      });

      // Mock user without recent MFA verification
      const response = await request(app)
        .post('/mfa-required')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(403);
    });
  });

  describe('Session Management Flow', () => {
    it('should create session after login', async () => {
      mockSupabase.select.mockReturnValueOnce({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'user-123',
              email: 'test@example.com',
              password_hash: '$2b$12$...hashed...',
              mfa_enabled: false,
              first_name: 'John',
              last_name: 'Doe'
            },
            error: null
          })
        })
      });

      passwordModule.verifyPassword.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(200);
      expect(createSession).toHaveBeenCalledWith(
        'user-123',
        expect.objectContaining({
          userAgent: expect.any(String)
        })
      );
    });

    it('should invalidate session on logout', async () => {
      mockSupabase.update.mockReturnValueOnce({
        eq: vi.fn().mockResolvedValue({
          data: {},
          error: null
        })
      });

      jwtModule.verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        type: 'access'
      });

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(invalidateAllUserSessions).toHaveBeenCalledWith('user-123');
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple refresh requests in parallel', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        org_id: 'org-123',
        refresh_token_revoked_at: null
      };

      for (let i = 0; i < 3; i++) {
        mockSupabase.select.mockReturnValueOnce({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: mockUser,
              error: null
            })
          })
        });

        jwtModule.verifyToken.mockReturnValueOnce({
          sub: 'user-123',
          type: 'refresh'
        });
      }

      const requests = Array(3)
        .fill(null)
        .map(() =>
          request(app)
            .post('/auth/refresh')
            .send({ refreshToken: 'valid-refresh-token' })
        );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
      });

      expect(jwtModule.generateTokens).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple logout requests (idempotent)', async () => {
      for (let i = 0; i < 2; i++) {
        mockSupabase.update.mockReturnValueOnce({
          eq: vi.fn().mockResolvedValue({
            data: {},
            error: null
          })
        });

        jwtModule.verifyToken.mockReturnValueOnce({
          sub: 'user-123',
          type: 'access'
        });
      }

      const firstLogout = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      const secondLogout = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer valid-token');

      expect(firstLogout.status).toBe(200);
      expect(secondLogout.status).toBe(200);
    });
  });

  describe('Error Scenarios', () => {
    it('should return 401 for expired access token', async () => {
      jwtModule.verifyToken.mockImplementationOnce(() => {
        throw new Error('Token expired');
      });

      const response = await request(app)
        .post('/protected')
        .set('Authorization', 'Bearer expired-token');

      expect(response.status).toBe(401);
    });

    it('should return 401 for malformed token', async () => {
      jwtModule.verifyToken.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .post('/protected')
        .set('Authorization', 'Bearer malformed.token');

      expect(response.status).toBe(401);
    });

    it('should work with optional auth when no token provided', async () => {
      const response = await request(app).post('/optional');

      expect(response.status).toBe(200);
      expect(response.body.authenticated).toBe(false);
      expect(response.body.userId).toBeUndefined();
    });

    it('should attach user with optional auth when token is valid', async () => {
      jwtModule.verifyToken.mockReturnValueOnce({
        sub: 'user-123',
        email: 'test@example.com',
        type: 'access'
      });

      const response = await request(app)
        .post('/optional')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.authenticated).toBe(true);
      expect(response.body.userId).toBe('user-123');
    });
  });
});
