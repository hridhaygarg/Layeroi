import express from 'express';
import { getSupabaseClient } from '../db/client.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// Valid status values for outreach queue
const QUEUE_STATUSES = ['pending', 'sent', 'bounced', 'opened', 'clicked', 'replied', 'failed'];
const SEQUENCE_STATUSES = ['draft', 'active', 'paused', 'archived'];

/**
 * GET /api/outreach/queue - List outreach queue items
 * Query params:
 * - page (default: 1)
 * - limit (default: 20, max: 100)
 * - status (filter by queue status)
 * - sequenceId (filter by automation sequence)
 * - prospectId (filter by prospect)
 * - sortBy (created_at, scheduled_at, sent_at; default: created_at)
 * - sortOrder (asc/desc; default: desc)
 */
router.get(
  '/queue',
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      status,
      sequenceId,
      prospectId,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;
    const orgId = req.user.org_id;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    let limitNum = Math.max(1, Math.min(100, parseInt(limit) || 20));

    // Validate sortBy
    const validSortFields = ['created_at', 'scheduled_at', 'sent_at'];
    if (!validSortFields.includes(sortBy)) {
      throw new AppError('Invalid sortBy field', 400, 'INVALID_INPUT');
    }

    // Validate sortOrder
    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(sortOrder)) {
      throw new AppError('Invalid sortOrder. Must be asc or desc', 400, 'INVALID_INPUT');
    }

    // Validate status if provided
    if (status && !QUEUE_STATUSES.includes(status)) {
      throw new AppError('Invalid status value', 400, 'INVALID_INPUT');
    }

    const supabase = getSupabaseClient();

    try {
      let query = supabase
        .from('outreach_queue')
        .select('*', { count: 'exact' })
        .eq('org_id', orgId);

      // Apply status filter
      if (status) {
        query = query.eq('status', status);
      }

      // Apply sequenceId filter
      if (sequenceId) {
        query = query.eq('sequence_id', sequenceId);
      }

      // Apply prospectId filter
      if (prospectId) {
        query = query.eq('prospect_id', prospectId);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const offset = (pageNum - 1) * limitNum;
      const { data: queueItems, error, count } = await query.range(offset, offset + limitNum - 1);

      if (error && error.code !== 'PGRST116') {
        logger.error('Failed to fetch outreach queue', {
          orgId,
          error: error.message
        });
        throw new AppError('Failed to fetch outreach queue', 500);
      }

      const total = count || 0;
      const hasMore = offset + limitNum < total;

      logger.debug('Outreach queue fetched', {
        orgId,
        total,
        returned: queueItems?.length || 0
      });

      res.status(200).json({
        queue: queueItems || [],
        total,
        page: pageNum,
        limit: limitNum,
        hasMore
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error('Unexpected error fetching outreach queue', { error: err.message });
      throw new AppError('Failed to fetch outreach queue', 500);
    }
  })
);

/**
 * POST /api/outreach/send - Manually send email from queue
 * Input: { queueId }
 * Finds queue item, retrieves prospect email, subject, body
 * Updates queue item status to 'sent' and sets sent_at timestamp
 */
router.post(
  '/send',
  asyncHandler(async (req, res) => {
    const { queueId } = req.body;
    const orgId = req.user.org_id;

    // Validate input
    if (!queueId) {
      throw new AppError('queueId is required', 400, 'INVALID_INPUT');
    }

    const supabase = getSupabaseClient();

    try {
      // Fetch queue item
      const { data: queueItem, error: fetchError } = await supabase
        .from('outreach_queue')
        .select('*')
        .eq('org_id', orgId)
        .eq('id', queueId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        logger.error('Failed to fetch queue item', {
          queueId,
          orgId,
          error: fetchError.message
        });
        throw new AppError('Failed to fetch queue item', 500);
      }

      if (!queueItem) {
        throw new AppError('Queue item not found', 404, 'NOT_FOUND');
      }

      // Check if already sent
      if (queueItem.status === 'sent') {
        throw new AppError('Email has already been sent', 400, 'INVALID_STATE');
      }

      // Fetch prospect email
      const { data: prospect, error: prospectError } = await supabase
        .from('prospects')
        .select('email, name')
        .eq('id', queueItem.prospect_id)
        .single();

      if (prospectError && prospectError.code !== 'PGRST116') {
        logger.error('Failed to fetch prospect', {
          prospectId: queueItem.prospect_id,
          orgId,
          error: prospectError.message
        });
        throw new AppError('Failed to fetch prospect', 500);
      }

      if (!prospect) {
        throw new AppError('Prospect not found', 404, 'NOT_FOUND');
      }

      // Mock email sending (real implementation would call email service)
      // In production, would call Resend or similar service
      logger.info('Sending email from queue', {
        queueId,
        prospectEmail: prospect.email,
        orgId
      });

      // Update queue item with sent status
      const { data: updatedQueueItem, error: updateError } = await supabase
        .from('outreach_queue')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          attempt_count: (queueItem.attempt_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('org_id', orgId)
        .eq('id', queueId)
        .select()
        .single();

      if (updateError) {
        logger.error('Failed to update queue item', {
          queueId,
          orgId,
          error: updateError.message
        });
        throw new AppError('Failed to update queue item', 500);
      }

      logger.info('Email sent successfully', {
        queueId,
        prospectId: queueItem.prospect_id,
        prospectEmail: prospect.email,
        orgId
      });

      res.status(200).json({
        queueItem: updatedQueueItem,
        emailSent: true
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error('Unexpected error sending email', { error: err.message });
      throw new AppError('Failed to send email', 500);
    }
  })
);

/**
 * POST /api/outreach/sequences - Create automation sequence
 * Input: { name, description, steps: [{ delay, subject, body }, ...] }
 * Validation:
 * - name is required
 * - at least 1 step required
 * - each step must have: delay (hours), subject, body
 * - delay must be non-negative integer
 */
router.post(
  '/sequences',
  asyncHandler(async (req, res) => {
    const { name, description, steps } = req.body;
    const orgId = req.user.org_id;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      throw new AppError('Sequence name is required', 400, 'INVALID_INPUT');
    }

    // Validate steps
    if (!Array.isArray(steps) || steps.length === 0) {
      throw new AppError('At least one step is required', 400, 'INVALID_INPUT');
    }

    // Validate each step
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (typeof step.delay !== 'number' || step.delay < 0 || !Number.isInteger(step.delay)) {
        throw new AppError(`Step ${i} delay must be a non-negative integer`, 400, 'INVALID_INPUT');
      }

      if (!step.subject || step.subject.trim().length === 0) {
        throw new AppError(`Step ${i} subject is required`, 400, 'INVALID_INPUT');
      }

      if (!step.body || step.body.trim().length === 0) {
        throw new AppError(`Step ${i} body is required`, 400, 'INVALID_INPUT');
      }
    }

    const supabase = getSupabaseClient();

    try {
      // Create automation sequence
      const { data: newSequence, error: createError } = await supabase
        .from('automation_sequences')
        .insert([
          {
            org_id: orgId,
            name: name.trim(),
            description: description || null,
            steps,
            status: 'draft'
          }
        ])
        .select()
        .single();

      if (createError) {
        logger.error('Failed to create sequence', {
          orgId,
          name,
          error: createError.message
        });
        throw new AppError('Failed to create sequence', 500);
      }

      logger.info('Sequence created', {
        sequenceId: newSequence.id,
        orgId,
        name,
        stepCount: steps.length
      });

      res.status(201).json({
        sequence: newSequence
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error('Unexpected error creating sequence', { error: err.message });
      throw new AppError('Failed to create sequence', 500);
    }
  })
);

/**
 * GET /api/outreach/sequences - List automation sequences
 * Query params:
 * - page (default: 1)
 * - limit (default: 20, max: 100)
 * - status (filter: draft, active, paused, archived)
 */
router.get(
  '/sequences',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    const orgId = req.user.org_id;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    let limitNum = Math.max(1, Math.min(100, parseInt(limit) || 20));

    // Validate status if provided
    if (status && !SEQUENCE_STATUSES.includes(status)) {
      throw new AppError('Invalid sequence status', 400, 'INVALID_INPUT');
    }

    const supabase = getSupabaseClient();

    try {
      let query = supabase
        .from('automation_sequences')
        .select('*', { count: 'exact' })
        .eq('org_id', orgId);

      // Apply status filter
      if (status) {
        query = query.eq('status', status);
      }

      // Apply sorting (default: created_at desc)
      query = query.order('created_at', { ascending: false });

      // Apply pagination
      const offset = (pageNum - 1) * limitNum;
      const { data: sequences, error, count } = await query.range(offset, offset + limitNum - 1);

      if (error && error.code !== 'PGRST116') {
        logger.error('Failed to fetch sequences', {
          orgId,
          error: error.message
        });
        throw new AppError('Failed to fetch sequences', 500);
      }

      const total = count || 0;
      const hasMore = offset + limitNum < total;

      logger.debug('Sequences fetched', {
        orgId,
        total,
        returned: sequences?.length || 0
      });

      res.status(200).json({
        sequences: sequences || [],
        total,
        page: pageNum,
        limit: limitNum,
        hasMore
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      logger.error('Unexpected error fetching sequences', { error: err.message });
      throw new AppError('Failed to fetch sequences', 500);
    }
  })
);

export const outreachRoutes = router;
export default router;
