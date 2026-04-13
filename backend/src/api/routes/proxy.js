import express from 'express';
import { handleChatCompletion, checkForRunawayLoop } from '../controllers/index.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();
export const blockedAgents = new Set();

router.post('/v1/chat/completions', (req, res) => {
  const agentName = req.agentName;

  if (blockedAgents.has(agentName)) {
    logger.warn('Blocked agent attempted request', { agent: agentName });
    return res.status(429).json({
      error: `Agent "${agentName}" is blocked due to runaway loop detection. Contact support to unblock.`,
    });
  }

  const loopCheck = checkForRunawayLoop(agentName, req.body.messages);
  if (loopCheck.isLoop) {
    blockedAgents.add(agentName);
    logger.error('Runaway loop detected', new Error(`Runaway loop: ${loopCheck.reason}`), {
      agent: agentName,
      callCount: loopCheck.callCount,
    });
    return res.status(429).json({
      error: `Runaway loop detected (${loopCheck.callCount} calls in 90s). Agent blocked.`,
    });
  }

  handleChatCompletion(req, res);
});

export default router;
