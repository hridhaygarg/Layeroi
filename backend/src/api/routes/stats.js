import express from 'express';
import { getAgentStats } from '../controllers/index.js';

const router = express.Router();

router.get('/api/agent-stats/:agent', getAgentStats);

export default router;
