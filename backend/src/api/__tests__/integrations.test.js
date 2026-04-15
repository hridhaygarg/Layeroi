import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { integrationsRoutes } from '../integrations.routes.js';

// Mock dependencies before importing routes
vi.mock('../../db/client.js');
vi.mock('../../utils/logger.js');

// Import mocked modules
import { getSupabaseClient } from '../../db/client.js';
import { logger } from '../../utils/logger.js';

// Setup Express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware for testing
app.use((req, res, next) => {
  // Extract auth from header for testing
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === 'valid-token') {
      req.user = {
        id: 'user-123',
        org_id: 'org-123',
        email: 'user@example.com'
      };
      return next();
    }
  }
  res.status(401).json({ error: 'Unauthorized' });
});

app.use('/api/integrations', integrationsRoutes);

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

describe('Integrations Routes', () => {
  let mockSupabase;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      single: vi.fn(),
      data: null,
      error: null
    };

    getSupabaseClient.mockReturnValue(mockSupabase);

    // Mock logger
    logger.info = vi.fn();
    logger.error = vi.fn();
    logger.warn = vi.fn();
  });

  // ==================== GET /api/integrations ====================

  describe('GET /api/integrations', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/integrations')
        .expect(401);

      expect(res.body.error).toBeDefined();
    });

    it('should return list of available integrations', async () => {
      const res = await request(app)
        .get('/api/integrations')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(res.body).toHaveProperty('integrations');
      expect(Array.isArray(res.body.integrations)).toBe(true);
      expect(res.body.integrations.length).toBeGreaterThan(0);
    });

    it('should include required integration fields', async () => {
      const res = await request(app)
        .get('/api/integrations')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      const integration = res.body.integrations[0];
      expect(integration).toHaveProperty('id');
      expect(integration).toHaveProperty('name');
      expect(integration).toHaveProperty('description');
      expect(integration).toHaveProperty('status');
      expect(integration).toHaveProperty('authRequired');
      expect(integration).toHaveProperty('category');
    });

    it('should include all pre-defined integrations', async () => {
      const res = await request(app)
        .get('/api/integrations')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      const integrationNames = res.body.integrations.map(i => i.id);
      const expectedIntegrations = ['slack', 'discord', 'zapier', 'google_sheets', 'hubspot', 'salesforce', 'outreach', 'lemlist'];

      expectedIntegrations.forEach(expected => {
        expect(integrationNames).toContain(expected);
      });
    });

    it('should include integration categories', async () => {
      const res = await request(app)
        .get('/api/integrations')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      const categories = new Set();
      res.body.integrations.forEach(i => {
        expect(i.category).toBeDefined();
        categories.add(i.category);
      });

      expect(categories.size).toBeGreaterThan(0);
    });

    it('should have authRequired flag for all integrations', async () => {
      const res = await request(app)
        .get('/api/integrations')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      res.body.integrations.forEach(i => {
        expect(typeof i.authRequired).toBe('boolean');
      });
    });

    it('should log integration list access', async () => {
      await request(app)
        .get('/api/integrations')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('integration'),
        expect.any(Object)
      );
    });
  });

  // ==================== POST /api/integrations/connect ====================

  describe('POST /api/integrations/connect', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .send({ integrationId: 'slack', redirectUri: 'http://localhost:3000/callback' })
        .expect(401);

      expect(res.body.error).toBeDefined();
    });

    it('should return 400 when integrationId is missing', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ redirectUri: 'http://localhost:3000/callback' })
        .expect(400);

      expect(res.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 400 when redirectUri is missing', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack' })
        .expect(400);

      expect(res.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 404 for invalid integration', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'invalid-integration', redirectUri: 'http://localhost:3000/callback' })
        .expect(404);

      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should return authUrl for valid integration', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', redirectUri: 'http://localhost:3000/callback' })
        .expect(200);

      expect(res.body).toHaveProperty('authUrl');
      expect(typeof res.body.authUrl).toBe('string');
      expect(res.body.authUrl.length).toBeGreaterThan(0);
    });

    it('should generate OAuth URL with client_id', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', redirectUri: 'http://localhost:3000/callback' })
        .expect(200);

      expect(res.body.authUrl).toContain('client_id');
    });

    it('should generate OAuth URL with redirect_uri', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', redirectUri: 'http://localhost:3000/callback' })
        .expect(200);

      expect(res.body.authUrl).toContain('redirect_uri');
    });

    it('should generate OAuth URL with scope', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', redirectUri: 'http://localhost:3000/callback' })
        .expect(200);

      expect(res.body.authUrl).toContain('scope');
    });

    it('should generate unique state for each request', async () => {
      const res1 = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', redirectUri: 'http://localhost:3000/callback' })
        .expect(200);

      const res2 = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', redirectUri: 'http://localhost:3000/callback' })
        .expect(200);

      // Extract state from URLs
      const state1 = new URL(res1.body.authUrl).searchParams.get('state');
      const state2 = new URL(res2.body.authUrl).searchParams.get('state');

      expect(state1).not.toEqual(state2);
    });

    it('should log connect request', async () => {
      await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', redirectUri: 'http://localhost:3000/callback' })
        .expect(200);

      expect(logger.info).toHaveBeenCalledWith(
        'OAuth authorization URL generated',
        expect.objectContaining({
          integrationId: 'slack',
          orgId: 'org-123'
        })
      );
    });

    it('should work with different integration types', async () => {
      const integrations = ['slack', 'discord', 'hubspot', 'salesforce'];

      for (const integrationId of integrations) {
        const res = await request(app)
          .post('/api/integrations/connect')
          .set('Authorization', 'Bearer valid-token')
          .send({ integrationId, redirectUri: 'http://localhost:3000/callback' })
          .expect(200);

        expect(res.body).toHaveProperty('authUrl');
      }
    });
  });

  // ==================== POST /api/integrations/sync ====================

  describe('POST /api/integrations/sync', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/integrations/sync')
        .send({ integrationId: 'slack', syncType: 'prospects' })
        .expect(401);

      expect(res.body.error).toBeDefined();
    });

    it('should return 400 when integrationId is missing', async () => {
      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ syncType: 'prospects' })
        .expect(400);

      expect(res.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 400 when syncType is missing', async () => {
      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack' })
        .expect(400);

      expect(res.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 400 for invalid syncType', async () => {
      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', syncType: 'invalid' })
        .expect(400);

      expect(res.body.error.code).toBe('INVALID_INPUT');
    });

    it('should accept valid syncTypes', async () => {
      const validSyncTypes = ['prospects', 'outreach', 'results'];

      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'integration-123', status: 'connected', org_id: 'org-123' },
        error: null
      });

      for (const syncType of validSyncTypes) {
        mockSupabase.single.mockResolvedValueOnce({
          data: { id: 'integration-123', status: 'connected', org_id: 'org-123' },
          error: null
        });

        const res = await request(app)
          .post('/api/integrations/sync')
          .set('Authorization', 'Bearer valid-token')
          .send({ integrationId: 'slack', syncType })
          .expect(200);

        expect(res.body).toHaveProperty('syncId');
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('queued');
      }
    });

    it('should return 404 when integration not found', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' }
      });

      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'nonexistent', syncType: 'prospects' })
        .expect(404);

      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 400 when integration is not connected', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'integration-123', status: 'disconnected', org_id: 'org-123' },
        error: null
      });

      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', syncType: 'prospects' })
        .expect(400);

      expect(res.body.error.code).toBe('NOT_CONNECTED');
    });

    it('should return sync job with syncId', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'integration-123', status: 'connected', org_id: 'org-123' },
        error: null
      });

      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', syncType: 'prospects' })
        .expect(200);

      expect(res.body).toHaveProperty('syncId');
      expect(typeof res.body.syncId).toBe('string');
      expect(res.body.syncId.length).toBeGreaterThan(0);
    });

    it('should return queued status', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'integration-123', status: 'connected', org_id: 'org-123' },
        error: null
      });

      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', syncType: 'prospects' })
        .expect(200);

      expect(res.body.status).toBe('queued');
    });

    it('should queue background job', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'integration-123', status: 'connected', org_id: 'org-123' },
        error: null
      });

      await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', syncType: 'prospects' })
        .expect(200);

      // Verify logging indicates job was queued
      expect(logger.info).toHaveBeenCalledWith(
        'Sync job queued',
        expect.objectContaining({
          integrationId: 'slack',
          syncType: 'prospects',
          orgId: 'org-123'
        })
      );
    });

    it('should validate org_id matches for RLS', async () => {
      // Mock query that doesn't find the integration (due to org_id mismatch)
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' }
      });

      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', syncType: 'prospects' })
        .expect(404);

      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should accept prospects syncType', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'integration-123', status: 'connected', org_id: 'org-123' },
        error: null
      });

      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'lemlist', syncType: 'prospects' })
        .expect(200);

      expect(res.body.status).toBe('queued');
    });

    it('should accept outreach syncType', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'integration-123', status: 'connected', org_id: 'org-123' },
        error: null
      });

      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', syncType: 'outreach' })
        .expect(200);

      expect(res.body.status).toBe('queued');
    });

    it('should accept results syncType', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'integration-123', status: 'connected', org_id: 'org-123' },
        error: null
      });

      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', syncType: 'results' })
        .expect(200);

      expect(res.body.status).toBe('queued');
    });

    it('should log sync request with details', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id: 'integration-123', status: 'connected', org_id: 'org-123' },
        error: null
      });

      await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'hubspot', syncType: 'results' })
        .expect(200);

      expect(logger.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          integrationId: 'hubspot',
          syncType: 'results',
          orgId: 'org-123'
        })
      );
    });

    it('should handle database errors gracefully', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });

      const res = await request(app)
        .post('/api/integrations/sync')
        .set('Authorization', 'Bearer valid-token')
        .send({ integrationId: 'slack', syncType: 'prospects' })
        .expect(500);

      expect(res.body.error).toBeDefined();
    });
  });

  // ==================== Additional Edge Cases ====================

  describe('Edge cases and error handling', () => {
    it('should handle empty org_id gracefully', async () => {
      // Create mock without org context
      const appNoOrg = express();
      appNoOrg.use(express.json());

      appNoOrg.use((req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          req.user = { id: 'user-123', org_id: undefined };
          return next();
        }
        res.status(401).json({ error: 'Unauthorized' });
      });

      appNoOrg.use('/api/integrations', integrationsRoutes);
      appNoOrg.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        const code = err.code || 'INTERNAL_ERROR';
        res.status(statusCode).json({
          success: false,
          error: { code, message: err.message }
        });
      });

      const res = await request(appNoOrg)
        .get('/api/integrations')
        .set('Authorization', 'Bearer valid-token')
        .expect(401);

      expect(res.body.error).toBeDefined();
    });

    it('should sanitize integrationId input', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({
          integrationId: 'slack; DROP TABLE integrations;',
          redirectUri: 'http://localhost:3000/callback'
        })
        .expect(404);

      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('should validate redirectUri is a valid URL', async () => {
      const res = await request(app)
        .post('/api/integrations/connect')
        .set('Authorization', 'Bearer valid-token')
        .send({
          integrationId: 'slack',
          redirectUri: 'not-a-valid-url'
        })
        .expect(400);

      expect(res.body.error.code).toBe('INVALID_INPUT');
    });
  });
});
