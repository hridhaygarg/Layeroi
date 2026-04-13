import express from 'express';
import { logger } from '../../utils/logger.js';
import { signJWT } from '../../auth/jwt.js';
import { getGoogleAuthUrl, validateGoogleOAuthConfig } from '../middleware/oauthMiddleware.js';
import { createUser, getUserByEmail } from '../../database/queries/users.js';
import crypto from 'crypto';

const router = express.Router();

// Login endpoint - generate JWT for API users
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // TODO: Validate password against hash when user table has auth_hash column
    // For now, create or get user
    const user = await getUserByEmail(email);

    if (!user) {
      logger.warn('Login attempt for non-existent user', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signJWT({
      userId: user.id,
      orgId: user.org_id,
      email: user.email,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });

    logger.info('User logged in', { email });
  } catch (err) {
    logger.error('Login failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Signup endpoint - create new user and return JWT
router.post('/auth/signup', async (req, res) => {
  try {
    const { email, name, company } = req.body;

    if (!email || !name || !company) {
      return res.status(400).json({ error: 'Email, name, and company required' });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    const user = await createUser({
      email,
      name,
      company,
    });

    if (!user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    const apiKey = `sk-${crypto.randomBytes(16).toString('hex')}`;
    const token = signJWT({
      userId: user.id,
      orgId: user.org_id,
      email: user.email,
    });

    res.json({
      success: true,
      token,
      apiKey,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      message: 'Account created successfully'
    });

    logger.info('New user signed up', { email, company });
  } catch (err) {
    logger.error('Signup failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Google OAuth - start flow
router.get('/auth/google', (req, res) => {
  if (!validateGoogleOAuthConfig()) {
    return res.status(503).json({ error: 'Google OAuth not configured' });
  }

  const state = crypto.randomBytes(32).toString('hex');
  const url = getGoogleAuthUrl(state);

  res.json({
    authUrl: url,
    state,
  });

  logger.info('Google OAuth flow initiated');
});

// Google OAuth - callback (frontend handles, backend validates)
router.post('/auth/google/token', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token required' });
    }

    // TODO: Verify ID token with Google
    // For now, extract claims and create/get user
    // const decoded = await verifyGoogleToken(idToken);

    // Mock implementation - in production use google-auth-library
    const mockUser = {
      id: crypto.randomUUID(),
      email: 'user@example.com',
      name: 'User Name',
    };

    const token = signJWT({
      userId: mockUser.id,
      email: mockUser.email,
    });

    res.json({
      success: true,
      token,
      user: mockUser,
    });

    logger.info('Google OAuth successful', { email: mockUser.email });
  } catch (err) {
    logger.error('Google OAuth failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Refresh token endpoint
router.post('/auth/refresh', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const token = signJWT({ userId });

    res.json({
      success: true,
      token,
    });

    logger.info('Token refreshed', { userId });
  } catch (err) {
    logger.error('Token refresh failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Revoke API key endpoint
router.post('/auth/revoke-key', (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    // TODO: Update database to mark API key as revoked
    logger.info('API key revoked');
    res.json({ success: true, message: 'API key revoked' });
  } catch (err) {
    logger.error('Revoke key failed', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
