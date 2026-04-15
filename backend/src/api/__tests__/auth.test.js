import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { authRoutes } from '../auth.routes.js';

// Mock dependencies before importing auth routes
vi.mock('../../db/client.js');
vi.mock('../../utils/logger.js');
vi.mock('../../auth/password.js');
vi.mock('../../auth/jwt.js');
vi.mock('../../auth/oauth.js');

// Import mocked modules
import { getSupabaseClient } from '../../db/client.js';
import { logger } from '../../utils/logger.js';
import * as passwordModule from '../../auth/password.js';
import * as jwtModule from '../../auth/jwt.js';
import * as oauthModule from '../../auth/oauth.js';

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Error handler middleware (required for AppError handling)
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

describe('Auth Routes', () => {
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
      data: null,
      error: null
    };

    getSupabaseClient.mockReturnValue(mockSupabase);

    // Mock password functions
    passwordModule.hashPassword = vi.fn().mockResolvedValue('$2b$12$...hashed...');
    passwordModule.verifyPassword = vi.fn().mockResolvedValue(true);

    // Mock JWT functions
    jwtModule.generateTokens = vi.fn().mockReturnValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 900
    });

    jwtModule.verifyToken = vi.fn().mockReturnValue({
      sub: 'user-123',
      type: 'refresh'
    });

    // Mock logger
    logger.info = vi.fn();
    logger.error = vi.fn();
    logger.warn = vi.fn();

    // Mock OAuth
    oauthModule.handleOAuthCallback = vi.fn().mockResolvedValue({
      user: {
        id: 'user-123',
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
        org_id: 'org-123'
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 900
      }
    });
  });

  describe('POST /register', () => {
    it('should register a new user with valid credentials', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const mockUser = {
        id: 'user-123',
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        org_id: 'org-123'
      };

      // Chain the mocks properly
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      mockSupabase.insert.mockReturnValueOnce(mockSupabase);
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: mockUser,
        error: null
      });

      mockSupabase.insert.mockReturnValueOnce(mockSupabase);
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'org-123' },
        error: null
      });

      mockSupabase.insert.mockReturnValueOnce(mockSupabase);

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('expiresIn');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return 400 if email is invalid', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 400 if password is too short', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'Short1!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 400 if password lacks uppercase letter', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'securepass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 400 if password lacks number', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'SecurePass!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 400 if password lacks special character', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 409 if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      // Mock that user already exists
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'user-456', email: userData.email },
        error: null
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('DUPLICATE_EMAIL');
    });

    it('should return 500 if database error occurs', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      // Mock database error
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      mockSupabase.insert.mockReturnValueOnce(mockSupabase);
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: new Error('Database error')
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if required fields are missing', async () => {
      const userData = {
        email: 'user@example.com',
        firstName: 'John'
        // Missing password and lastName
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /login', () => {
    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'SecurePass123!'
      };

      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password_hash: '$2b$12$...hashed_password...',
        org_id: 'org-123',
        mfa_enabled: false
      };

      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: mockUser,
        error: null
      });

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should return 401 if email does not exist', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'SecurePass123!'
      };

      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should return 401 if password is invalid', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'WrongPassword123!'
      };

      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password_hash: '$2b$12$...hashed_password...',
        org_id: 'org-123',
        mfa_enabled: false
      };

      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: mockUser,
        error: null
      });

      // Make verifyPassword return false
      passwordModule.verifyPassword.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should return mfaRequired if MFA is enabled', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'SecurePass123!'
      };

      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password_hash: '$2b$12$...hashed_password...',
        org_id: 'org-123',
        mfa_enabled: true
      };

      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: mockUser,
        error: null
      });

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.mfaRequired).toBe(true);
      expect(response.body).toHaveProperty('mfaToken');
    });

    it('should return 400 if email is missing', async () => {
      const loginData = {
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if password is missing', async () => {
      const loginData = {
        email: 'user@example.com'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /logout', () => {
    it('should logout user successfully', async () => {
      const token = 'valid-jwt-token';

      mockSupabase.update.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });

    it('should invalidate refresh token in database', async () => {
      const token = 'valid-jwt-token';

      mockSupabase.update.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);

      await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(mockSupabase.update).toHaveBeenCalled();
    });
  });

  describe('POST /refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      const refreshTokenData = {
        refreshToken: 'valid-refresh-token'
      };

      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: {
          id: 'user-123',
          email: 'user@example.com',
          org_id: 'org-123'
        },
        error: null
      });

      const response = await request(app)
        .post('/auth/refresh')
        .send(refreshTokenData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('expiresIn');
    });

    it('should return 401 if refresh token is invalid', async () => {
      const refreshTokenData = {
        refreshToken: 'invalid-refresh-token'
      };

      // Make verifyToken throw error
      jwtModule.verifyToken.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .post('/auth/refresh')
        .send(refreshTokenData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should return 401 if refresh token is expired', async () => {
      const refreshTokenData = {
        refreshToken: 'expired-refresh-token'
      };

      jwtModule.verifyToken.mockImplementationOnce(() => {
        throw new Error('Token expired');
      });

      const response = await request(app)
        .post('/auth/refresh')
        .send(refreshTokenData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if refresh token is missing', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 401 if user not found', async () => {
      const refreshTokenData = {
        refreshToken: 'valid-refresh-token'
      };

      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const response = await request(app)
        .post('/auth/refresh')
        .send(refreshTokenData);

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should return 401 if refresh token was revoked', async () => {
      const refreshTokenData = {
        refreshToken: 'revoked-refresh-token'
      };

      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: {
          id: 'user-123',
          email: 'user@example.com',
          org_id: 'org-123',
          refresh_token_revoked_at: new Date().toISOString()
        },
        error: null
      });

      const response = await request(app)
        .post('/auth/refresh')
        .send(refreshTokenData);

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /oauth/:provider', () => {
    it('should handle OAuth callback for google provider', async () => {
      const oauthData = {
        code: 'auth-code-from-google'
      };

      const response = await request(app)
        .post('/auth/oauth/google')
        .send(oauthData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should handle OAuth callback for github provider', async () => {
      const oauthData = {
        code: 'auth-code-from-github'
      };

      const response = await request(app)
        .post('/auth/oauth/github')
        .send(oauthData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should handle OAuth callback for microsoft provider', async () => {
      const oauthData = {
        code: 'auth-code-from-microsoft'
      };

      const response = await request(app)
        .post('/auth/oauth/microsoft')
        .send(oauthData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return 400 if code is missing', async () => {
      const response = await request(app)
        .post('/auth/oauth/google')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if provider is invalid', async () => {
      const oauthData = {
        code: 'some-code'
      };

      const response = await request(app)
        .post('/auth/oauth/invalid-provider')
        .send(oauthData);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 501 for OAuth not yet implemented', async () => {
      const res = await request(app)
        .post('/auth/oauth/google')
        .send({ code: 'auth-code-123' });

      expect(res.status).toBe(501);
      expect(res.body.error.code).toBe('NOT_IMPLEMENTED');
    });

    it('should return 401 if OAuth callback fails', async () => {
      const oauthData = {
        code: 'invalid-code'
      };

      oauthModule.handleOAuthCallback.mockRejectedValueOnce(
        new Error('OAuth failed')
      );

      const response = await request(app)
        .post('/auth/oauth/google')
        .send(oauthData);

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('AUTH_FAILED');
    });
  });

  describe('Input Validation and Logging', () => {
    it('should validate email format during registration', async () => {
      const userData = {
        email: 'not-an-email',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should validate password strength during registration', async () => {
      const testCases = [
        { password: 'short', desc: 'too short' },
        { password: 'nouppercase1!', desc: 'no uppercase' },
        { password: 'NoNumbers!', desc: 'no numbers' },
        { password: 'NoSpecial123', desc: 'no special chars' }
      ];

      for (const testCase of testCases) {
        const userData = {
          email: 'user@example.com',
          password: testCase.password,
          firstName: 'John',
          lastName: 'Doe'
        };

        const response = await request(app)
          .post('/auth/register')
          .send(userData);

        expect(response.status).toBe(400, `Failed for case: ${testCase.desc}`);
        expect(response.body.error.code).toBe('INVALID_INPUT');
      }
    });

    it('should log successful registration', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      mockSupabase.insert.mockReturnValueOnce(mockSupabase);
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: {
          id: 'user-123',
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          org_id: 'org-123'
        },
        error: null
      });

      mockSupabase.insert.mockReturnValueOnce(mockSupabase);
      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'org-123' },
        error: null
      });

      mockSupabase.insert.mockReturnValueOnce(mockSupabase);

      await request(app)
        .post('/auth/register')
        .send(userData);

      expect(logger.info).toHaveBeenCalled();
    });

    it('should log successful login', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'SecurePass123!'
      };

      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password_hash: '$2b$12$...hashed...',
        org_id: 'org-123',
        mfa_enabled: false
      };

      mockSupabase.select.mockReturnValueOnce(mockSupabase);
      mockSupabase.eq.mockReturnValueOnce(mockSupabase);
      mockSupabase.single.mockResolvedValueOnce({
        data: mockUser,
        error: null
      });

      await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(logger.info).toHaveBeenCalled();
    });
  });
});
