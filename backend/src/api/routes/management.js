import express from 'express';
import { blockedAgents } from './proxy.js';
import { logger } from '../../utils/logger.js';
import { requestLog } from '../../loopDetector.js';

const router = express.Router();

router.get('/api/logs', (req, res) => {
  res.json({ logs: requestLog });
});

router.get('/api/system-status', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    blockedAgents: Array.from(blockedAgents),
    automations: {
      seo: 'Scheduled: Sun 2:30am UTC',
      coldEmails: 'Scheduled: Mon 5am UTC',
      clickDetection: 'Scheduled: Every 6 hours',
      freeTierChecks: 'Scheduled: Every 6 hours',
      weeklyReports: 'Scheduled: Mon 2:30am UTC',
      insightGeneration: 'Scheduled: Mon 4am UTC'
    }
  });
});

router.post('/api/unblock/:agent', (req, res) => {
  try {
    const { agent } = req.params;
    blockedAgents.delete(agent);
    logger.info('Agent unblocked', { agent });
    res.json({ message: `Agent "${agent}" unblocked` });
  } catch (err) {
    logger.error('Unblock agent failed', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
