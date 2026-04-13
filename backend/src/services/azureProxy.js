import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import { logAPICall } from '../database/queries/index.js';
import { calculateCost } from './costCalculator.js';
import { estimateTokens } from '../utils/tokenEstimator.js';

export async function forwardToAzure(req, res, agentName = 'unknown') {
  const AZURE_API_KEY = (process.env.AZURE_API_KEY || '').replace(/\s+/g, '');
  const AZURE_ENDPOINT = (process.env.AZURE_ENDPOINT || '').replace(/\s+/g, '');
  const AZURE_API_VERSION = process.env.AZURE_API_VERSION || '2024-02-15-preview';

  if (!AZURE_API_KEY || !AZURE_ENDPOINT) {
    logger.error('Azure API credentials not configured', new Error('Missing AZURE_API_KEY or AZURE_ENDPOINT'));
    return res.status(500).json({
      error: 'Azure API credentials not configured. Please set AZURE_API_KEY and AZURE_ENDPOINT environment variables.'
    });
  }

  const timestamp = new Date().toISOString();
  const requestBody = req.body;
  const deploymentName = requestBody.model || 'gpt-4-turbo';

  const logEntry = {
    id: Math.random().toString(36).substr(2, 9),
    agentName,
    timestamp,
    path: '/v1/chat/completions',
    model: deploymentName,
    tokensEstimate: estimateTokens(requestBody.messages),
  };

  try {
    const client = new OpenAI({
      apiKey: AZURE_API_KEY,
      baseURL: `${AZURE_ENDPOINT}/openai/deployments/${deploymentName}`,
      defaultQuery: { 'api-version': AZURE_API_VERSION },
      defaultHeaders: {
        'api-key': AZURE_API_KEY,
      },
    });

    const response = await client.chat.completions.create({
      model: deploymentName,
      messages: requestBody.messages,
      max_tokens: requestBody.max_tokens,
      temperature: requestBody.temperature,
    });

    const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    logEntry.promptTokens = usage.prompt_tokens;
    logEntry.completionTokens = usage.completion_tokens;
    logEntry.totalTokens = usage.total_tokens;
    logEntry.responseTime = Date.now() - new Date(timestamp).getTime();

    const cost = calculateCost(
      deploymentName,
      usage.prompt_tokens,
      usage.completion_tokens
    );
    logEntry.cost = cost;

    logger.info('Azure API call completed', {
      agent: agentName,
      model: deploymentName,
      tokens: usage.total_tokens,
      cost: cost.totalCost
    });

    logAPICall(logEntry).catch(err => logger.error('Database log error', err));

    res.json({
      id: response.id,
      object: response.object,
      created: response.created,
      model: response.model,
      choices: response.choices,
      usage: response.usage,
    });

  } catch (error) {
    logger.error('Azure proxy error', error, { agent: agentName });
    res.status(500).json({ error: error.message });
  }
}
