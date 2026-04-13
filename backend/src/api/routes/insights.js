import express from 'express';
import { logger } from '../../utils/logger.js';
import { generateInsights, getOrganizationInsights } from '../../services/insightEngine.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalAuth);

// Generate insights for organization
router.post('/api/insights/generate', async (req, res) => {
  try {
    const orgId = req.orgId || req.body.orgId;

    if (!orgId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const insights = await generateInsights(orgId);
    res.json({
      success: true,
      insightsGenerated: insights.length,
      insights,
    });

    logger.info('Insights generated via API', { orgId, count: insights.length });
  } catch (err) {
    logger.error('Generate insights failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Get insights for organization
router.get('/api/insights', async (req, res) => {
  try {
    const orgId = req.orgId || req.query.orgId;
    const limit = parseInt(req.query.limit) || 10;

    if (!orgId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const insights = await getOrganizationInsights(orgId, limit);
    res.json({
      orgId,
      count: insights.length,
      insights,
    });
  } catch (err) {
    logger.error('Get insights failed', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
