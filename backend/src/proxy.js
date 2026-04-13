import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { calculateCost } from './costCalculator.js';
import { logAPICall } from './database.js';

export const requestLog = [];

function isAnthropicModel(model) {
  return model && (model.includes('claude') || model.startsWith('claude-'));
}

export async function forwardToOpenAI(req, res, agentName = 'unknown') {
  const model = req.body.model || 'gpt-3.5-turbo';

  if (isAnthropicModel(model)) {
    return forwardToAnthropic(req, res, agentName);
  }

  return forwardToOpenAIAPI(req, res, agentName);
}

async function forwardToOpenAIAPI(req, res, agentName = 'unknown') {
  // Remove all whitespace including newlines
  const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || '').replace(/\s+/g, '');

  if (!OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY environment variable is not set');
    return res.status(500).json({
      error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
    });
  }

  const timestamp = new Date().toISOString();
  const requestBody = req.body;

  const logEntry = {
    id: Math.random().toString(36).substr(2, 9),
    agentName,
    timestamp,
    path: '/v1/chat/completions',
    model: requestBody.model || 'unknown',
    tokensEstimate: estimateTokens(requestBody.messages),
  };

  requestLog.push(logEntry);
  console.log(`[${timestamp}] Agent: ${agentName}, Model: ${requestBody.model}`);

  try {
    console.log(`API Key length: ${OPENAI_API_KEY.length}`);
    console.log(`API Key starts with: ${OPENAI_API_KEY.substring(0, 20)}`);
    console.log(`Initializing OpenAI client...`);

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    console.log(`Forwarding request to OpenAI for model: ${requestBody.model}`);

    const response = await openai.chat.completions.create({
      model: requestBody.model,
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
      logEntry.model,
      usage.prompt_tokens,
      usage.completion_tokens
    );
    logEntry.cost = cost;

    console.log(`[Response] Tokens: ${usage.total_tokens}, Cost: $${cost.totalCost}`);

    // Log to database asynchronously
    logAPICall(logEntry).catch(err => console.error('DB log error:', err));

    // Return OpenAI response format
    res.json({
      id: response.id,
      object: response.object,
      created: response.created,
      model: response.model,
      choices: response.choices,
      usage: response.usage,
    });

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function forwardToAnthropic(req, res, agentName = 'unknown') {
  const ANTHROPIC_API_KEY = (process.env.ANTHROPIC_API_KEY || '').replace(/\s+/g, '');

  if (!ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set');
    return res.status(500).json({
      error: 'Anthropic API key not configured. Please set ANTHROPIC_API_KEY environment variable.'
    });
  }

  const timestamp = new Date().toISOString();
  const requestBody = req.body;

  const logEntry = {
    id: Math.random().toString(36).substr(2, 9),
    agentName,
    timestamp,
    path: '/v1/messages',
    model: requestBody.model || 'unknown',
    tokensEstimate: estimateTokens(requestBody.messages),
  };

  requestLog.push(logEntry);
  console.log(`[${timestamp}] Agent: ${agentName}, Model: ${requestBody.model}`);

  try {
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

    console.log(`Forwarding request to Anthropic for model: ${requestBody.model}`);

    const response = await client.messages.create({
      model: requestBody.model,
      max_tokens: requestBody.max_tokens || 1024,
      messages: requestBody.messages,
      temperature: requestBody.temperature,
    });

    const usage = response.usage || { input_tokens: 0, output_tokens: 0 };

    logEntry.promptTokens = usage.input_tokens;
    logEntry.completionTokens = usage.output_tokens;
    logEntry.totalTokens = (usage.input_tokens || 0) + (usage.output_tokens || 0);
    logEntry.responseTime = Date.now() - new Date(timestamp).getTime();

    const cost = calculateCost(
      logEntry.model,
      usage.input_tokens,
      usage.output_tokens
    );
    logEntry.cost = cost;

    console.log(`[Response] Tokens: ${logEntry.totalTokens}, Cost: $${cost.totalCost}`);

    // Log to database asynchronously
    logAPICall(logEntry).catch(err => console.error('DB log error:', err));

    // Convert Anthropic response to OpenAI format for compatibility
    res.json({
      id: response.id,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: response.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: response.content[0]?.text || ''
          },
          finish_reason: response.stop_reason
        }
      ],
      usage: {
        prompt_tokens: usage.input_tokens,
        completion_tokens: usage.output_tokens,
        total_tokens: logEntry.totalTokens
      }
    });

  } catch (error) {
    console.error('Anthropic proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}

export function estimateTokens(messages) {
  if (!Array.isArray(messages)) return 0;
  let total = 0;
  for (const msg of messages) {
    const text = msg.content || '';
    total += Math.ceil(text.length / 4);
  }
  return total;
}
