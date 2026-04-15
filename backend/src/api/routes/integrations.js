import express from 'express';
import { verifyAuth } from '../../middleware/auth.js';
import integrationsRoutes from '../integrations.routes.js';

const router = express.Router();

// Attach integrations routes with auth middleware at /api/integrations
router.use('/api/integrations', verifyAuth, integrationsRoutes);

export default router;
