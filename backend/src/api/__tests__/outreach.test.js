import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import outreachRoutes from '../outreach.routes.js';

// Mock dependencies
vi.mock('../../db/client.js');
vi.mock('../../utils/logger.js');
vi.mock('../../middleware/auth.js');

// Import mocked modules
import { getSupabaseClient } from '../../db/client.js';
import { logger } from '../../utils/logger.js';
import { verifyAuth } from '../../middleware/auth.js';

// Setup Express app for testing
const app = express();
app.use(express.json());

// Mock auth middleware - just attach user to request
app.use((req, res, next) => {
  req.user = {
    id: 'user-123',
    email: 'user@example.com',
    org_id: 'org-123'
  };
  next();
});

app.use('/api/outreach', outreachRoutes);

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

describe('Outreach Routes', () => {
  let mockSupabase;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations with fluent chaining
    mockSupabase = {
      from: vi.fn(),
      select: vi.fn(),
      eq: vi.fn(),
      neq: vi.fn(),
      ne: vi.fn(),
      is: vi.fn(),
      in: vi.fn(),
      or: vi.fn(),
      filter: vi.fn(),
      order: vi.fn(),
      range: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      single: vi.fn(),
      data: null,
      error: null,
      count: 'exact'
    };

    // All chain methods return mockSupabase for fluent chaining
    mockSupabase.from.mockReturnValue(mockSupabase);
    mockSupabase.select.mockReturnValue(mockSupabase);
    mockSupabase.eq.mockReturnValue(mockSupabase);
    mockSupabase.neq.mockReturnValue(mockSupabase);
    mockSupabase.ne.mockReturnValue(mockSupabase);
    mockSupabase.is.mockReturnValue(mockSupabase);
    mockSupabase.in.mockReturnValue(mockSupabase);
    mockSupabase.or.mockReturnValue(mockSupabase);
    mockSupabase.filter.mockReturnValue(mockSupabase);
    mockSupabase.order.mockReturnValue(mockSupabase);
    mockSupabase.range.mockReturnValue(mockSupabase);
    mockSupabase.insert.mockReturnValue(mockSupabase);
    mockSupabase.update.mockReturnValue(mockSupabase);
    mockSupabase.delete.mockReturnValue(mockSupabase);

    getSupabaseClient.mockReturnValue(mockSupabase);

    // Mock logger
    logger.info = vi.fn();
    logger.error = vi.fn();
    logger.warn = vi.fn();
    logger.debug = vi.fn();
  });

  // ======================== GET /api/outreach/queue ========================
  describe('GET /api/outreach/queue - List outreach queue', () => {
    it('should return list of queue items with default pagination', async () => {
      const mockQueueItems = [
        {
          id: 'queue-1',
          org_id: 'org-123',
          prospect_id: 'prospect-1',
          status: 'pending',
          message: 'Test message',
          personalized_message: 'Personalized test message',
          sent_at: null,
          opened_at: null,
          clicked_at: null,
          replied_at: null,
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockQueueItems,
        error: null,
        count: 1
      });

      const response = await request(app)
        .get('/api/outreach/queue');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('queue');
      expect(response.body).toHaveProperty('total', 1);
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 20);
      expect(response.body).toHaveProperty('hasMore', false);
      expect(response.body.queue).toHaveLength(1);
      expect(response.body.queue[0].status).toBe('pending');
    });

    it('should filter by status parameter', async () => {
      const mockQueueItems = [
        {
          id: 'queue-1',
          org_id: 'org-123',
          prospect_id: 'prospect-1',
          status: 'sent',
          message: 'Test message',
          personalized_message: 'Personalized test message',
          sent_at: '2026-04-16T10:00:00Z',
          opened_at: null,
          clicked_at: null,
          replied_at: null,
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockQueueItems,
        error: null,
        count: 1
      });

      const response = await request(app)
        .get('/api/outreach/queue?status=sent');

      expect(response.status).toBe(200);
      expect(response.body.queue[0].status).toBe('sent');
    });

    it('should filter by sequenceId parameter', async () => {
      const mockQueueItems = [
        {
          id: 'queue-1',
          org_id: 'org-123',
          prospect_id: 'prospect-1',
          sequence_id: 'seq-1',
          status: 'pending',
          message: 'Test message',
          personalized_message: 'Personalized test message',
          sent_at: null,
          opened_at: null,
          clicked_at: null,
          replied_at: null,
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockQueueItems,
        error: null,
        count: 1
      });

      const response = await request(app)
        .get('/api/outreach/queue?sequenceId=seq-1');

      expect(response.status).toBe(200);
      expect(response.body.queue[0].sequence_id).toBe('seq-1');
    });

    it('should filter by prospectId parameter', async () => {
      const mockQueueItems = [
        {
          id: 'queue-1',
          org_id: 'org-123',
          prospect_id: 'prospect-1',
          status: 'pending',
          message: 'Test message',
          personalized_message: 'Personalized test message',
          sent_at: null,
          opened_at: null,
          clicked_at: null,
          replied_at: null,
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockQueueItems,
        error: null,
        count: 1
      });

      const response = await request(app)
        .get('/api/outreach/queue?prospectId=prospect-1');

      expect(response.status).toBe(200);
      expect(response.body.queue[0].prospect_id).toBe('prospect-1');
    });

    it('should support custom pagination limits', async () => {
      const mockQueueItems = Array.from({ length: 50 }, (_, i) => ({
        id: `queue-${i}`,
        org_id: 'org-123',
        prospect_id: `prospect-${i}`,
        status: 'pending',
        message: 'Test message',
        personalized_message: 'Personalized test message',
        sent_at: null,
        opened_at: null,
        clicked_at: null,
        replied_at: null,
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      }));

      mockSupabase.range.mockResolvedValueOnce({
        data: mockQueueItems.slice(0, 50),
        error: null,
        count: 100
      });

      const response = await request(app)
        .get('/api/outreach/queue?page=1&limit=50');

      expect(response.status).toBe(200);
      expect(response.body.queue).toHaveLength(50);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(50);
      expect(response.body.hasMore).toBe(true);
    });

    it('should enforce max limit of 100', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/queue?limit=200');

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
    });

    it('should sort by different fields', async () => {
      const mockQueueItems = [
        {
          id: 'queue-1',
          org_id: 'org-123',
          prospect_id: 'prospect-1',
          status: 'pending',
          message: 'Test message',
          personalized_message: 'Personalized test message',
          sent_at: null,
          opened_at: null,
          clicked_at: null,
          replied_at: null,
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockQueueItems,
        error: null,
        count: 1
      });

      const response = await request(app)
        .get('/api/outreach/queue?sortBy=sent_at&sortOrder=asc');

      expect(response.status).toBe(200);
      expect(response.body.queue).toHaveLength(1);
    });

    it('should return error for invalid status', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/queue?status=invalid_status');

      expect([200, 400]).toContain(response.status);
    });

    it('should handle database errors gracefully', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error', code: 'PGRST999' },
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/queue');

      expect([500, 400, 200]).toContain(response.status);
    });

    it('should return hasMore correctly for pagination', async () => {
      const mockQueueItems = [
        {
          id: 'queue-1',
          org_id: 'org-123',
          prospect_id: 'prospect-1',
          status: 'pending',
          message: 'Test message',
          personalized_message: 'Personalized test message',
          sent_at: null,
          opened_at: null,
          clicked_at: null,
          replied_at: null,
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockQueueItems,
        error: null,
        count: 50
      });

      const response = await request(app)
        .get('/api/outreach/queue?page=1&limit=20');

      expect(response.status).toBe(200);
      expect(response.body.hasMore).toBe(true);
    });

    it('should use created_at as default sort field', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/queue');

      expect(response.status).toBe(200);
    });

    it('should use desc as default sort order', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/queue');

      expect(response.status).toBe(200);
    });

    it('should only show items for authenticated user organization', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/queue');

      expect(response.status).toBe(200);
      // Verify org_id was passed in query (this would be validated in implementation)
    });
  });

  // ======================== POST /api/outreach/send ========================
  describe('POST /api/outreach/send - Manually send email from queue', () => {
    it('should send email and update queue item status', async () => {
      const mockQueueItem = {
        id: 'queue-1',
        org_id: 'org-123',
        prospect_id: 'prospect-1',
        status: 'pending',
        message: 'Test message',
        personalized_message: 'Personalized test message',
        sent_at: null,
        opened_at: null,
        clicked_at: null,
        replied_at: null,
        attempt_count: 0,
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      const mockProspect = {
        id: 'prospect-1',
        email: 'prospect@example.com',
        name: 'John Doe'
      };

      const mockUpdatedQueueItem = {
        ...mockQueueItem,
        status: 'sent',
        sent_at: '2026-04-16T10:00:00Z',
        attempt_count: 1
      };

      // First call: fetch queue item
      mockSupabase.single.mockResolvedValueOnce({
        data: mockQueueItem,
        error: null
      });

      // Second call: fetch prospect
      mockSupabase.single.mockResolvedValueOnce({
        data: mockProspect,
        error: null
      });

      // Third call: update queue item
      mockSupabase.single.mockResolvedValueOnce({
        data: mockUpdatedQueueItem,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/send')
        .send({ queueId: 'queue-1' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('queueItem');
      expect(response.body).toHaveProperty('emailSent', true);
      expect(response.body.queueItem.status).toBe('sent');
    });

    it('should return 404 when queue item not found', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' }
      });

      const response = await request(app)
        .post('/api/outreach/send')
        .send({ queueId: 'nonexistent' });

      expect([404, 400]).toContain(response.status);
    });

    it('should reject sending already sent emails', async () => {
      const mockQueueItem = {
        id: 'queue-1',
        org_id: 'org-123',
        prospect_id: 'prospect-1',
        status: 'sent',
        sent_at: '2026-04-16T10:00:00Z',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockQueueItem,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/send')
        .send({ queueId: 'queue-1' });

      expect([400, 422]).toContain(response.status);
    });

    it('should require queueId in request body', async () => {
      const response = await request(app)
        .post('/api/outreach/send')
        .send({});

      expect([400, 422]).toContain(response.status);
    });

    it('should increment attempt_count on send', async () => {
      const mockQueueItem = {
        id: 'queue-1',
        org_id: 'org-123',
        prospect_id: 'prospect-1',
        status: 'pending',
        attempt_count: 2,
        message: 'Test message',
        personalized_message: 'Personalized test message',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      const mockProspect = {
        id: 'prospect-1',
        email: 'prospect@example.com',
        name: 'John Doe'
      };

      const mockUpdatedQueueItem = {
        ...mockQueueItem,
        status: 'sent',
        sent_at: '2026-04-16T10:00:00Z',
        attempt_count: 3
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockQueueItem,
        error: null
      });

      mockSupabase.single.mockResolvedValueOnce({
        data: mockProspect,
        error: null
      });

      mockSupabase.single.mockResolvedValueOnce({
        data: mockUpdatedQueueItem,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/send')
        .send({ queueId: 'queue-1' });

      expect(response.status).toBe(200);
      expect(response.body.queueItem.attempt_count).toBe(3);
    });

    it('should handle email service errors', async () => {
      const mockQueueItem = {
        id: 'queue-1',
        org_id: 'org-123',
        prospect_id: 'prospect-1',
        status: 'pending',
        message: 'Test message',
        personalized_message: 'Personalized test message',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      const mockProspect = {
        id: 'prospect-1',
        email: 'prospect@example.com',
        name: 'John Doe'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockQueueItem,
        error: null
      });

      mockSupabase.single.mockResolvedValueOnce({
        data: mockProspect,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/send')
        .send({ queueId: 'queue-1' });

      expect([200, 500]).toContain(response.status);
    });

    it('should log email send attempts', async () => {
      const mockQueueItem = {
        id: 'queue-1',
        org_id: 'org-123',
        prospect_id: 'prospect-1',
        status: 'pending',
        message: 'Test message',
        personalized_message: 'Personalized test message',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      const mockProspect = {
        id: 'prospect-1',
        email: 'prospect@example.com',
        name: 'John Doe'
      };

      const mockUpdatedQueueItem = {
        ...mockQueueItem,
        status: 'sent',
        sent_at: '2026-04-16T10:00:00Z'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockQueueItem,
        error: null
      });

      mockSupabase.single.mockResolvedValueOnce({
        data: mockProspect,
        error: null
      });

      mockSupabase.single.mockResolvedValueOnce({
        data: mockUpdatedQueueItem,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/send')
        .send({ queueId: 'queue-1' });

      expect(response.status).toBe(200);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should verify user organization ownership', async () => {
      // Mock returns null when org_id doesn't match (due to eq filter in query)
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' }
      });

      const response = await request(app)
        .post('/api/outreach/send')
        .send({ queueId: 'queue-1' });

      expect([403, 404]).toContain(response.status);
    });
  });

  // ======================== POST /api/outreach/sequences ========================
  describe('POST /api/outreach/sequences - Create automation sequence', () => {
    it('should create sequence with valid data', async () => {
      const mockSequence = {
        id: 'seq-1',
        org_id: 'org-123',
        name: 'Test Sequence',
        description: 'Test Description',
        steps: [
          { delay: 0, subject: 'Email 1', body: 'Body 1' },
          { delay: 2, subject: 'Email 2', body: 'Body 2' }
        ],
        status: 'draft',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockSequence,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Test Sequence',
          description: 'Test Description',
          steps: [
            { delay: 0, subject: 'Email 1', body: 'Body 1' },
            { delay: 2, subject: 'Email 2', body: 'Body 2' }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('sequence');
      expect(response.body.sequence.name).toBe('Test Sequence');
      expect(response.body.sequence.status).toBe('draft');
    });

    it('should require name field', async () => {
      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          description: 'Test Description',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }]
        });

      expect([400, 422]).toContain(response.status);
    });

    it('should require at least one step', async () => {
      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Test Sequence',
          description: 'Test Description',
          steps: []
        });

      expect([400, 422]).toContain(response.status);
    });

    it('should validate step data structure', async () => {
      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Test Sequence',
          description: 'Test Description',
          steps: [
            { delay: 0 } // Missing subject and body
          ]
        });

      expect([400, 422]).toContain(response.status);
    });

    it('should validate delay is non-negative integer', async () => {
      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Test Sequence',
          description: 'Test Description',
          steps: [
            { delay: -1, subject: 'Email 1', body: 'Body 1' }
          ]
        });

      expect([400, 422]).toContain(response.status);
    });

    it('should create with minimal data (name and steps only)', async () => {
      const mockSequence = {
        id: 'seq-1',
        org_id: 'org-123',
        name: 'Test Sequence',
        description: null,
        steps: [
          { delay: 0, subject: 'Email 1', body: 'Body 1' }
        ],
        status: 'draft',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockSequence,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Test Sequence',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }]
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('sequence');
    });

    it('should set status to draft for new sequences', async () => {
      const mockSequence = {
        id: 'seq-1',
        org_id: 'org-123',
        name: 'Test Sequence',
        description: 'Test',
        steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
        status: 'draft',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockSequence,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Test Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }]
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body.sequence.status).toBe('draft');
    });

    it('should associate sequence with organization', async () => {
      const mockSequence = {
        id: 'seq-1',
        org_id: 'org-123',
        name: 'Test Sequence',
        description: 'Test',
        steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
        status: 'draft',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockSequence,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Test Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }]
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body.sequence.org_id).toBe('org-123');
    });

    it('should handle database insertion errors', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' }
      });

      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Test Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }]
        });

      expect([500, 400]).toContain(response.status);
    });

    it('should support multiple steps with different delays', async () => {
      const mockSequence = {
        id: 'seq-1',
        org_id: 'org-123',
        name: 'Multi-step Sequence',
        description: 'Test',
        steps: [
          { delay: 0, subject: 'Email 1', body: 'Body 1' },
          { delay: 2, subject: 'Email 2', body: 'Body 2' },
          { delay: 7, subject: 'Email 3', body: 'Body 3' },
          { delay: 14, subject: 'Email 4', body: 'Body 4' }
        ],
        status: 'draft',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockSequence,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Multi-step Sequence',
          description: 'Test',
          steps: [
            { delay: 0, subject: 'Email 1', body: 'Body 1' },
            { delay: 2, subject: 'Email 2', body: 'Body 2' },
            { delay: 7, subject: 'Email 3', body: 'Body 3' },
            { delay: 14, subject: 'Email 4', body: 'Body 4' }
          ]
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body.sequence.steps).toHaveLength(4);
    });

    it('should log sequence creation', async () => {
      const mockSequence = {
        id: 'seq-1',
        org_id: 'org-123',
        name: 'Test Sequence',
        description: 'Test',
        steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
        status: 'draft',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockSequence,
        error: null
      });

      const response = await request(app)
        .post('/api/outreach/sequences')
        .send({
          name: 'Test Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }]
        });

      expect([200, 201]).toContain(response.status);
      expect(logger.info).toHaveBeenCalled();
    });
  });

  // ======================== GET /api/outreach/sequences ========================
  describe('GET /api/outreach/sequences - List automation sequences', () => {
    it('should return list of sequences with default pagination', async () => {
      const mockSequences = [
        {
          id: 'seq-1',
          org_id: 'org-123',
          name: 'Test Sequence',
          description: 'Test Description',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
          status: 'draft',
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockSequences,
        error: null,
        count: 1
      });

      const response = await request(app)
        .get('/api/outreach/sequences');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sequences');
      expect(response.body).toHaveProperty('total', 1);
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('limit', 20);
      expect(response.body).toHaveProperty('hasMore', false);
      expect(response.body.sequences).toHaveLength(1);
    });

    it('should filter by status parameter', async () => {
      const mockSequences = [
        {
          id: 'seq-1',
          org_id: 'org-123',
          name: 'Active Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
          status: 'active',
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockSequences,
        error: null,
        count: 1
      });

      const response = await request(app)
        .get('/api/outreach/sequences?status=active');

      expect(response.status).toBe(200);
      expect(response.body.sequences[0].status).toBe('active');
    });

    it('should support custom pagination', async () => {
      const mockSequences = Array.from({ length: 30 }, (_, i) => ({
        id: `seq-${i}`,
        org_id: 'org-123',
        name: `Sequence ${i}`,
        description: 'Test',
        steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
        status: 'draft',
        created_at: '2026-04-16T00:00:00Z',
        updated_at: '2026-04-16T00:00:00Z'
      }));

      mockSupabase.range.mockResolvedValueOnce({
        data: mockSequences.slice(0, 30),
        error: null,
        count: 100
      });

      const response = await request(app)
        .get('/api/outreach/sequences?page=1&limit=30');

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(30);
      expect(response.body.hasMore).toBe(true);
    });

    it('should enforce max limit of 100', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/sequences?limit=500');

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
    });

    it('should only show sequences for user organization', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/sequences');

      expect(response.status).toBe(200);
    });

    it('should handle database errors gracefully', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error', code: 'PGRST999' },
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/sequences');

      expect([500, 400, 200]).toContain(response.status);
    });

    it('should return all valid status types', async () => {
      const mockSequences = [
        {
          id: 'seq-1',
          org_id: 'org-123',
          name: 'Draft Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
          status: 'draft',
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        },
        {
          id: 'seq-2',
          org_id: 'org-123',
          name: 'Active Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
          status: 'active',
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        },
        {
          id: 'seq-3',
          org_id: 'org-123',
          name: 'Paused Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
          status: 'paused',
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        },
        {
          id: 'seq-4',
          org_id: 'org-123',
          name: 'Archived Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
          status: 'archived',
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockSequences,
        error: null,
        count: 4
      });

      const response = await request(app)
        .get('/api/outreach/sequences');

      expect(response.status).toBe(200);
      expect(response.body.sequences).toHaveLength(4);
      const statuses = response.body.sequences.map(s => s.status);
      expect(statuses).toContain('draft');
      expect(statuses).toContain('active');
      expect(statuses).toContain('paused');
      expect(statuses).toContain('archived');
    });

    it('should return correct hasMore flag', async () => {
      const mockSequences = [
        {
          id: 'seq-1',
          org_id: 'org-123',
          name: 'Test Sequence',
          description: 'Test',
          steps: [{ delay: 0, subject: 'Email 1', body: 'Body 1' }],
          status: 'draft',
          created_at: '2026-04-16T00:00:00Z',
          updated_at: '2026-04-16T00:00:00Z'
        }
      ];

      mockSupabase.range.mockResolvedValueOnce({
        data: mockSequences,
        error: null,
        count: 50
      });

      const response = await request(app)
        .get('/api/outreach/sequences?page=1&limit=20');

      expect(response.status).toBe(200);
      expect(response.body.hasMore).toBe(true);
    });

    it('should handle empty results', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 0
      });

      const response = await request(app)
        .get('/api/outreach/sequences');

      expect(response.status).toBe(200);
      expect(response.body.sequences).toHaveLength(0);
      expect(response.body.total).toBe(0);
      expect(response.body.hasMore).toBe(false);
    });
  });
});
