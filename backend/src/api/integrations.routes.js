import express from 'express';
import { getSupabaseClient } from '../db/client.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

const router = express.Router();

// Pre-defined integrations catalog
const INTEGRATIONS_CATALOG = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send outreach updates and sync notifications to Slack',
    category: 'communication',
    authRequired: true,
    oauth: {
      clientId: process.env.SLACK_CLIENT_ID || 'mock-slack-client-id',
      scope: 'chat:write users:read',
      authUrl: 'https://slack.com/oauth_authorize'
    }
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Integrate with Discord for team collaboration',
    category: 'communication',
    authRequired: true,
    oauth: {
      clientId: process.env.DISCORD_CLIENT_ID || 'mock-discord-client-id',
      scope: 'identify guilds',
      authUrl: 'https://discord.com/api/oauth2/authorize'
    }
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5000+ apps via Zapier automation',
    category: 'automation',
    authRequired: true,
    oauth: {
      clientId: process.env.ZAPIER_CLIENT_ID || 'mock-zapier-client-id',
      scope: 'read write',
      authUrl: 'https://zapier.com/oauth/authorize'
    }
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    description: 'Sync prospect data to Google Sheets',
    category: 'spreadsheet',
    authRequired: true,
    oauth: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
    }
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync prospects and outreach results with HubSpot CRM',
    category: 'crm',
    authRequired: true,
    oauth: {
      clientId: process.env.HUBSPOT_CLIENT_ID || 'mock-hubspot-client-id',
      scope: 'crm.objects.contacts.read crm.objects.deals.read',
      authUrl: 'https://app.hubspot.com/oauth/authorize'
    }
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sync data with Salesforce CRM',
    category: 'crm',
    authRequired: true,
    oauth: {
      clientId: process.env.SALESFORCE_CLIENT_ID || 'mock-salesforce-client-id',
      scope: 'full refresh_token offline_access',
      authUrl: 'https://login.salesforce.com/services/oauth2/authorize'
    }
  },
  {
    id: 'outreach',
    name: 'Outreach',
    description: 'Sync outreach sequences and results with Outreach platform',
    category: 'outreach',
    authRequired: true,
    oauth: {
      clientId: process.env.OUTREACH_CLIENT_ID || 'mock-outreach-client-id',
      scope: 'accounts prospects sequences',
      authUrl: 'https://api.outreach.io/oauth/authorize'
    }
  },
  {
    id: 'lemlist',
    name: 'Lemlist',
    description: 'Sync prospects and campaign results with Lemlist',
    category: 'outreach',
    authRequired: true,
    oauth: {
      clientId: process.env.LEMLIST_CLIENT_ID || 'mock-lemlist-client-id',
      scope: 'read write',
      authUrl: 'https://lemlist.com/api/oauth/authorize'
    }
  }
];

/**
 * Validate URL format
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Generate random state for OAuth
 */
function generateOAuthState() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate OAuth authorization URL
 */
function generateAuthUrl(integration, redirectUri, state) {
  const params = new URLSearchParams({
    client_id: integration.oauth.clientId,
    redirect_uri: redirectUri,
    scope: integration.oauth.scope,
    response_type: 'code',
    state: state
  });

  return `${integration.oauth.authUrl}?${params.toString()}`;
}

/**
 * GET /api/integrations - List available integrations
 * Requires: Authentication (Bearer token)
 * Returns: { integrations: [...] }
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    // Verify user is authenticated
    if (!req.user || !req.user.org_id) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    logger.info('Fetching available integrations', {
      userId: req.user.id,
      orgId: req.user.org_id
    });

    // Return catalog with metadata (status omitted until user connects)
    const integrations = INTEGRATIONS_CATALOG.map(integration => ({
      id: integration.id,
      name: integration.name,
      description: integration.description,
      status: 'available',
      authRequired: integration.authRequired,
      category: integration.category
    }));

    res.status(200).json({
      success: true,
      integrations
    });
  })
);

/**
 * POST /api/integrations/connect - Generate OAuth authorization URL
 * Requires: Authentication (Bearer token)
 * Input: { integrationId, redirectUri }
 * Returns: { authUrl }
 */
router.post(
  '/connect',
  asyncHandler(async (req, res) => {
    // Verify user is authenticated
    if (!req.user || !req.user.org_id) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { integrationId, redirectUri } = req.body;
    const orgId = req.user.org_id;

    // Validate required fields
    if (!integrationId || typeof integrationId !== 'string') {
      throw new AppError('integrationId is required', 400, 'INVALID_INPUT');
    }

    if (!redirectUri || typeof redirectUri !== 'string') {
      throw new AppError('redirectUri is required', 400, 'INVALID_INPUT');
    }

    // Validate redirectUri is a valid URL
    if (!isValidUrl(redirectUri)) {
      throw new AppError('redirectUri must be a valid URL', 400, 'INVALID_INPUT');
    }

    // Find integration in catalog
    const integration = INTEGRATIONS_CATALOG.find(i => i.id === integrationId);
    if (!integration) {
      logger.warn('Attempted to connect to unknown integration', {
        integrationId,
        orgId
      });
      throw new AppError(`Integration ${integrationId} not found`, 404, 'NOT_FOUND');
    }

    try {
      // Generate OAuth state token
      const state = generateOAuthState();

      // Generate authorization URL
      const authUrl = generateAuthUrl(integration, redirectUri, state);

      logger.info('OAuth authorization URL generated', {
        integrationId,
        orgId,
        userId: req.user.id
      });

      res.status(200).json({
        success: true,
        authUrl
      });
    } catch (err) {
      logger.error('Failed to generate authorization URL', {
        integrationId,
        orgId,
        error: err.message
      });
      throw new AppError('Failed to generate authorization URL', 500, 'OAUTH_ERROR');
    }
  })
);

/**
 * POST /api/integrations/sync - Trigger sync with external service
 * Requires: Authentication (Bearer token)
 * Input: { integrationId, syncType }
 * Returns: { syncId, status: 'queued' }
 * Errors: 404 integration not found, 400 not connected
 */
router.post(
  '/sync',
  asyncHandler(async (req, res) => {
    // Verify user is authenticated
    if (!req.user || !req.user.org_id) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { integrationId, syncType } = req.body;
    const orgId = req.user.org_id;
    const userId = req.user.id;

    // Validate required fields
    if (!integrationId || typeof integrationId !== 'string') {
      throw new AppError('integrationId is required', 400, 'INVALID_INPUT');
    }

    if (!syncType || typeof syncType !== 'string') {
      throw new AppError('syncType is required', 400, 'INVALID_INPUT');
    }

    // Validate syncType
    const validSyncTypes = ['prospects', 'outreach', 'results'];
    if (!validSyncTypes.includes(syncType)) {
      throw new AppError(
        `syncType must be one of: ${validSyncTypes.join(', ')}`,
        400,
        'INVALID_INPUT'
      );
    }

    try {
      const supabase = getSupabaseClient();

      // Check if integration exists and is connected for this org
      const { data: integration, error: fetchError } = await supabase
        .from('integrations')
        .select('*')
        .eq('id', integrationId)
        .eq('org_id', orgId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          logger.warn('Integration not found', {
            integrationId,
            orgId
          });
          throw new AppError('Integration not found', 404, 'NOT_FOUND');
        }
        logger.error('Database error fetching integration', {
          integrationId,
          orgId,
          error: fetchError
        });
        throw new AppError('Failed to fetch integration', 500, 'DB_ERROR');
      }

      if (!integration) {
        logger.warn('Integration not found', {
          integrationId,
          orgId
        });
        throw new AppError('Integration not found', 404, 'NOT_FOUND');
      }

      // Verify integration is connected
      if (integration.status !== 'connected') {
        logger.warn('Sync requested for disconnected integration', {
          integrationId,
          status: integration.status,
          orgId
        });
        throw new AppError(
          'Integration is not connected. Please authorize first.',
          400,
          'NOT_CONNECTED'
        );
      }

      // Generate sync job ID
      const syncId = crypto.randomUUID();

      // Queue background sync job
      // In production, this would queue to a job system (Bull, RQ, etc.)
      // For now, we log and simulate async processing
      const syncJob = {
        syncId,
        integrationId,
        orgId,
        userId,
        syncType,
        status: 'queued',
        createdAt: new Date().toISOString(),
        queuedAt: new Date().toISOString()
      };

      logger.info('Sync job queued', {
        syncId,
        integrationId,
        syncType,
        orgId,
        userId
      });

      // TODO: In production, queue to background job system:
      // - Bull Queue in Node.js
      // - AWS SQS
      // - GCP Cloud Tasks
      // - Azure Service Bus
      // Example with Bull:
      // await syncQueue.add(syncJob, {
      //   jobId: syncId,
      //   attempts: 3,
      //   backoff: { type: 'exponential', delay: 2000 },
      //   removeOnComplete: true,
      //   removeOnFail: false
      // });

      res.status(200).json({
        success: true,
        syncId,
        status: 'queued'
      });
    } catch (err) {
      if (err instanceof AppError) throw err;

      logger.error('Failed to queue sync job', {
        integrationId,
        syncType,
        orgId,
        error: err.message
      });
      throw new AppError('Failed to queue sync job', 500, 'INTERNAL_ERROR');
    }
  })
);

export const integrationsRoutes = router;
export default router;
