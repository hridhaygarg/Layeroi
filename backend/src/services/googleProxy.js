import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';
import { logAPICall } from '../database/queries/index.js';
import { calculateCost } from './costCalculator.js';
import { estimateTokens } from '../utils/tokenEstimator.js';

export async function forwardToGoogle(req, res, agentName = 'unknown') {
  const GOOGLE_API_KEY = (process.env.GOOGLE_API_KEY || '').replace(/\s+/g, '');

  if (!GOOGLE_API_KEY) {
    logger.error('Google API key not configured', new Error('Missing GOOGLE_API_KEY'));
    return res.status(500).json({
      error: 'Google API key not configured. Please set GOOGLE_API_KEY environment variable.'
    });
  }

  const timestamp = new Date().toISOString();
  const requestBody = req.body;
  const model = requestBody.model || 'gemini-2.0-flash';

  const logEntry = {
    id: Math.random().toString(36).substr(2, 9),
    agentName,
    timestamp,
    path: '/v1/messages',
    model,
    tokensEstimate: estimateTokens(requestBody.messages),
  };

  try {
    const client = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const genModel = client.getGenerativeModel({ model });

    // Convert OpenAI format to Google format
    const lastMessage = requestBody.messages[requestBody.messages.length - 1];
    const systemPrompts = requestBody.messages.filter(m => m.role === 'system');
    const systemPrompt = systemPrompts.length > 0 ? systemPrompts[0].content : '';

    const response = await genModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: lastMessage.content || '' }]
        }
      ],
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: requestBody.max_tokens || 8096,
        temperature: requestBody.temperature || 1,
      },
    });

    const text = response.response.text();
    const usageMetadata = response.response.usageMetadata || {};

    logEntry.promptTokens = usageMetadata.promptTokenCount || estimateTokens(requestBody.messages);
    logEntry.completionTokens = usageMetadata.candidatesTokenCount || Math.ceil(text.length / 4);
    logEntry.totalTokens = (usageMetadata.totalTokenCount || 0) || (logEntry.promptTokens + logEntry.completionTokens);
    logEntry.responseTime = Date.now() - new Date(timestamp).getTime();

    const cost = calculateCost(
      model,
      logEntry.promptTokens,
      logEntry.completionTokens
    );
    logEntry.cost = cost;

    logger.info('Google API call completed', {
      agent: agentName,
      model,
      tokens: logEntry.totalTokens,
      cost: cost.totalCost
    });

    logAPICall(logEntry).catch(err => logger.error('Database log error', err));

    // Return OpenAI-compatible format
    res.json({
      id: logEntry.id,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: text
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: logEntry.promptTokens,
        completion_tokens: logEntry.completionTokens,
        total_tokens: logEntry.totalTokens
      }
    });

  } catch (error) {
    logger.error('Google proxy error', error, { agent: agentName });
    res.status(500).json({ error: error.message });
  }
}
