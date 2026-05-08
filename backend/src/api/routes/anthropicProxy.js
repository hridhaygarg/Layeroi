import express from 'express';
import { supabase } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { calculateCost } from '../../services/costCalculator.js';

const router = express.Router();

// Auth: resolve org from X-Layeroi-Key header (same as ingest route)
async function resolveOrg(req, res, next) {
  const key = req.headers['x-layeroi-key'];
  if (!key) return res.status(401).json({ error: 'X-Layeroi-Key header required' });

  const { data: org, error } = await supabase
    .from('organisations')
    .select('id')
    .eq('api_key', key)
    .single();

  if (error || !org) return res.status(401).json({ error: 'Invalid API key' });

  req.orgId = org.id;
  next();
}

// POST /anthropic/v1/messages — pass-through proxy to Anthropic
router.post('/anthropic/v1/messages', resolveOrg, async (req, res) => {
  const customerApiKey = req.headers['x-api-key'];
  if (!customerApiKey) {
    return res.status(400).json({ error: 'x-api-key header required (your Anthropic API key)' });
  }

  const agentName = req.headers['x-agent-name'] || 'unknown';
  const orgId = req.orgId;
  const requestBody = req.body;
  const model = requestBody.model || 'unknown';
  const startTime = Date.now();

  try {
    // Forward to Anthropic API
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': customerApiKey,
        'anthropic-version': req.headers['anthropic-version'] || '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json(data);
    }

    // Extract usage
    const usage = data.usage || {};
    const inputTokens = usage.input_tokens || 0;
    const outputTokens = usage.output_tokens || 0;
    const totalTokens = inputTokens + outputTokens;
    const cost = calculateCost(model, inputTokens, outputTokens);
    const latencyMs = Date.now() - startTime;

    // Log to api_logs (fire-and-forget)
    supabase.from('api_logs').insert({
      org_id: orgId,
      agent_name: agentName,
      provider: 'anthropic',
      model: data.model || model,
      prompt_tokens: inputTokens,
      completion_tokens: outputTokens,
      total_tokens: totalTokens,
      cost_usd: cost.totalCost || 0,
      latency_ms: latencyMs,
      status: 'success',
      created_at: new Date().toISOString(),
    }).then(({ error: logErr }) => {
      if (logErr) logger.error('Anthropic proxy log error', logErr);
    });

    logger.info('Anthropic proxy call completed', {
      agent: agentName, model: data.model || model,
      tokens: totalTokens, cost: cost.totalCost, latency_ms: latencyMs,
    });

    // Return native Anthropic response
    res.status(200).json(data);
  } catch (err) {
    logger.error('Anthropic proxy error', err, { agent: agentName });
    res.status(502).json({ error: 'Failed to reach Anthropic API', detail: err.message });
  }
});

export default router;
