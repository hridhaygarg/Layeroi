import express from 'express';
import { supabase } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { getAgentCostsSummary, getAllCosts } from '../controllers/index.js';
import { reseedIfStale } from '../../lib/reseed-if-stale.js';

const router = express.Router();

// /api/costs/summary MUST be registered BEFORE /api/costs/:agent
// otherwise Express treats "summary" as the :agent param
router.get('/api/costs/summary', async (req, res) => {
  try {
    const orgId = req.query.orgId;
    if (!orgId) return res.json({ totalSpend: 0, totalValue: 0, netROI: 0, wastefulSpend: 0 });

    await reseedIfStale(orgId);

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const all = [];
    const pageSize = 1000;
    let from = 0;
    while (true) {
      const { data, error } = await supabase
        .from('api_logs')
        .select('cost_usd, value')
        .eq('org_id', orgId)
        .gte('created_at', monthStart.toISOString())
        .range(from, from + pageSize - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      all.push(...data);
      if (data.length < pageSize) break;
      from += pageSize;
    }

    const totalSpend = all.reduce((s, r) => s + Number(r.cost_usd || 0), 0);
    const totalValue = all.reduce((s, r) => s + Number(r.value || 0), 0);

    res.json({
      totalSpend: +totalSpend.toFixed(2),
      totalValue: +totalValue.toFixed(2),
      netROI: totalSpend > 0 ? +(totalValue / totalSpend).toFixed(1) : 0,
      wastefulSpend: 0,
    });
  } catch (err) {
    logger.error('Costs summary error', err);
    res.json({ totalSpend: 0, totalValue: 0, netROI: 0, wastefulSpend: 0 });
  }
});

router.get('/api/costs/:agent', getAgentCostsSummary);
router.get('/api/costs', getAllCosts);
router.get('/api/stats', getAllCosts);
router.get('/api/stats/:agent', getAgentCostsSummary);

export default router;
