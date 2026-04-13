import { forwardToOpenAIAPI, forwardToAnthropic, forwardToGoogle, forwardToAzure } from '../../services/index.js';

function detectProvider(model) {
  if (!model) return 'openai'; // Default

  const lower = model.toLowerCase();

  if (lower.includes('claude')) return 'anthropic';
  if (lower.includes('gemini')) return 'google';
  if (lower.includes('gpt-4') || lower.includes('gpt-3.5')) {
    // Check if it's Azure by deployment name pattern
    if (lower.includes('azure') || lower.includes('deployment')) return 'azure';
    return 'openai';
  }
  if (lower.includes('text-davinci') || lower.includes('text-curie')) return 'openai';

  return 'openai'; // Default fallback
}

export async function handleChatCompletion(req, res) {
  const model = req.body.model || 'gpt-3.5-turbo';
  const agentName = req.agentName || 'unknown';
  const provider = detectProvider(model);

  switch (provider) {
    case 'anthropic':
      return forwardToAnthropic(req, res, agentName);
    case 'google':
      return forwardToGoogle(req, res, agentName);
    case 'azure':
      return forwardToAzure(req, res, agentName);
    case 'openai':
    default:
      return forwardToOpenAIAPI(req, res, agentName);
  }
}
