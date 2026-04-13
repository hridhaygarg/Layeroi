import express from 'express';
import { getAgentCostsSummary, getAllCosts } from '../controllers/index.js';

const router = express.Router();

router.get('/api/costs/:agent', getAgentCostsSummary);
router.get('/api/costs', getAllCosts);

export default router;
