import express from 'express';
import { listAllAgents } from '../controllers/index.js';

const router = express.Router();

router.get('/api/agents', listAllAgents);

export default router;
