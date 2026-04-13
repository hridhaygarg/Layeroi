# Section 3: Backend Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor monolithic backend into modular architecture with clear separation of concerns, preparing for multi-provider proxy, auth system, and API v2.

**Architecture:** Convert flat `src/` structure into layered modules: `api/routes` (endpoints), `api/controllers` (business logic), `api/middleware` (cross-cutting), `services/` (integrations), `database/` (queries), `auth/` (JWT/keys), `utils/` (helpers). Each module has single responsibility, clear exports, no circular dependencies.

**Tech Stack:** Node.js/Express, Supabase PostgreSQL, structured JSON logger, configuration constants

---

## File Structure Overview

**New directory structure:**
```
src/
├── api/
│   ├── routes/
│   │   ├── health.js          (GET /health, /health/detailed)
│   │   ├── proxy.js            (POST /v1/chat/completions)
│   │   ├── logs.js             (GET /api/logs)
│   │   ├── agents.js           (GET /api/agents)
│   │   ├── costs.js            (GET /api/costs/:agent, /api/costs)
│   │   ├── stats.js            (GET /api/agent-stats/:agent)
│   │   ├── management.js       (POST /api/unblock/:agent)
│   │   └── automations.js      (POST /automations/*)
│   ├── middleware/
│   │   ├── cors.js             (CORS configuration)
│   │   ├── errorHandler.js     (Global error handler)
│   │   ├── requestLogger.js    (Request logging)
│   │   └── agentName.js        (Extract agent name from headers)
│   └── controllers/
│       ├── proxyController.js  (LLM proxy logic)
│       ├── costController.js   (Cost calculations)
│       ├── agentController.js  (Agent queries)
│       └── loopController.js   (Loop detection)
├── services/
│   ├── openaiProxy.js          (OpenAI API forwarding)
│   ├── anthropicProxy.js       (Anthropic API forwarding)
│   └── costCalculator.js       (Cost calculations - moved from root)
├── database/
│   ├── queries/
│   │   ├── apiLogs.js          (logAPICall, getAgentCosts, getAllAgents)
│   │   └── agents.js           (Agent queries)
│   └── models.js               (Table schemas as constants)
├── auth/
│   ├── jwt.js                  (JWT sign/verify)
│   └── apiKeys.js              (API key validation)
├── utils/
│   ├── logger.js               (EXISTING - centralized logging)
│   ├── tokenEstimator.js       (estimateTokens helper)
│   └── validators.js           (Input validation helpers)
├── config/
│   ├── constants.js            (EXISTING - all pricing/limits)
│   └── database.js             (EXISTING - Supabase client)
├── loopDetector.js             (EXISTING - move to services/)
├── automations/
│   └── cron.js                 (EXISTING - unchanged)
└── server.js                   (Express app setup, route mounting)
```

---

### Task 1: Create directory structure

**Files:**
- Create: `src/api/` (directory tree)
- Create: `src/api/routes/`, `src/api/middleware/`, `src/api/controllers/`
- Create: `src/services/`
- Create: `src/database/queries/`
- Create: `src/auth/`

- [ ] **Step 1: Create all directories**

```bash
mkdir -p src/api/routes src/api/middleware src/api/controllers
mkdir -p src/services src/database/queries src/auth
echo "Directory structure created"
```

- [ ] **Step 2: Verify structure**

```bash
find src -type d | sort
```

Expected output:
```
src
src/api
src/api/controllers
src/api/middleware
src/api/routes
src/auth
src/automations
src/config
src/database
src/database/queries
src/services
src/utils
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: create modular directory structure"
```

---

### Task 2: Extract middleware into separate files

**Files:**
- Create: `src/api/middleware/cors.js`
- Create: `src/api/middleware/errorHandler.js`
- Create: `src/api/middleware/requestLogger.js`
- Create: `src/api/middleware/agentName.js`
- Create: `src/api/middleware/index.js`

- [ ] **Step 1: Create cors middleware**

```javascript
// src/api/middleware/cors.js
import cors from 'cors';
import { CONFIG } from '../../config/constants.js';

export const corsMiddleware = cors({
  origin: function(origin, callback) {
    if (!origin || CONFIG.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Agent-Name', 'X-LayerROI-Key'],
});
```

- [ ] **Step 2: Create error handler middleware**

```javascript
// src/api/middleware/errorHandler.js
import { logger } from '../../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', err, { path: req.path, method: req.method });
  res.status(500).json({ error: 'Internal server error' });
};
```

- [ ] **Step 3: Create request logger middleware**

```javascript
// src/api/middleware/requestLogger.js
import { logger } from '../../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: duration,
    });
  });
  next();
};
```

- [ ] **Step 4: Create agent name extraction middleware**

```javascript
// src/api/middleware/agentName.js
export const extractAgentName = (req, res, next) => {
  req.agentName = req.headers['x-agent-name'] || req.query.agent || 'unknown';
  next();
};
```

- [ ] **Step 5: Create middleware index for easy imports**

```javascript
// src/api/middleware/index.js
export { corsMiddleware } from './cors.js';
export { errorHandler } from './errorHandler.js';
export { requestLogger } from './requestLogger.js';
export { extractAgentName } from './agentName.js';
```

- [ ] **Step 6: Commit**

```bash
git add src/api/middleware && git commit -m "feat: extract middleware into separate files"
```

---

### Task 3: Create database query modules

**Files:**
- Create: `src/database/queries/apiLogs.js`
- Create: `src/database/queries/agents.js`
- Create: `src/database/queries/index.js`

- [ ] **Step 1: Create api logs queries module**

Copy existing functions from `src/database.js`:

```javascript
// src/database/queries/apiLogs.js
import { supabase } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export async function logAPICall(callData) {
  try {
    const { data, error } = await supabase
      .from('api_logs')
      .insert([
        {
          request_id: callData.id,
          agent_name: callData.agentName,
          timestamp: callData.timestamp,
          model: callData.model,
          prompt_tokens: callData.promptTokens,
          completion_tokens: callData.completionTokens,
          total_tokens: callData.totalTokens,
          cost_usd: callData.cost?.totalCost || 0,
          latency_ms: callData.responseTime || 0,
          status: 'success',
        }
      ]);

    if (error) {
      logger.error('Database insert error', error, { agent: callData.agentName });
      return { success: false, error };
    }

    return { success: true, data };

  } catch (error) {
    logger.error('Database log error', error, { agent: callData.agentName });
    return { success: false, error };
  }
}

export async function getAgentCosts(agentName, days = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('api_logs')
      .select('cost_usd')
      .eq('agent_name', agentName)
      .gte('timestamp', startDate.toISOString());

    if (error) throw error;

    const totalCost = data.reduce((sum, row) => sum + (row.cost_usd || 0), 0);
    const calls = data.length;

    return {
      agent: agentName,
      totalCost: parseFloat(totalCost.toFixed(2)),
      calls,
      avgCostPerCall: calls > 0 ? parseFloat((totalCost / calls).toFixed(6)) : 0,
    };

  } catch (error) {
    logger.error('Query agents costs failed', error, { agent: agentName });
    return { agent: agentName, totalCost: 0, calls: 0, avgCostPerCall: 0 };
  }
}

export async function getAllAgents() {
  try {
    const { data, error } = await supabase
      .from('api_logs')
      .select('agent_name')
      .distinct()
      .order('agent_name');

    if (error) throw error;
    return data.map(row => row.agent_name);

  } catch (error) {
    logger.error('Query all agents failed', error);
    return [];
  }
}
```

- [ ] **Step 2: Create agents queries module**

```javascript
// src/database/queries/agents.js
import { supabase } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export async function getAgentById(agentId) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Get agent by ID failed', error, { agentId });
    return null;
  }
}

export async function listAgents(orgId = null) {
  try {
    let query = supabase.from('agents').select('*');

    if (orgId) {
      query = query.eq('org_id', orgId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('List agents failed', error, { orgId });
    return [];
  }
}

export async function createAgent(agentData) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .insert([agentData])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    logger.error('Create agent failed', error);
    return null;
  }
}
```

- [ ] **Step 3: Create database queries index**

```javascript
// src/database/queries/index.js
export { logAPICall, getAgentCosts, getAllAgents } from './apiLogs.js';
export { getAgentById, listAgents, createAgent } from './agents.js';
```

- [ ] **Step 4: Commit**

```bash
git add src/database/queries && git commit -m "feat: create database query modules"
```

---

### Task 4: Create service modules (proxy logic extraction)

**Files:**
- Create: `src/services/openaiProxy.js`
- Create: `src/services/anthropicProxy.js`
- Create: `src/services/costCalculator.js`
- Create: `src/services/index.js`

- [ ] **Step 1: Create OpenAI proxy service**

Extract from `src/proxy.js`:

```javascript
// src/services/openaiProxy.js
import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import { logAPICall } from '../database/queries/index.js';
import { calculateCost } from './costCalculator.js';

async function forwardToOpenAIAPI(req, res, agentName = 'unknown') {
  const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || '').replace(/\s+/g, '');

  if (!OPENAI_API_KEY) {
    logger.error('OpenAI API key not configured', new Error('Missing OPENAI_API_KEY'));
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

  try {
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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

    logger.info('OpenAI API call completed', {
      agent: agentName,
      model: requestBody.model,
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
    logger.error('OpenAI proxy error', error, { agent: agentName });
    res.status(500).json({ error: error.message });
  }
}

export { forwardToOpenAIAPI };
```

- [ ] **Step 2: Create Anthropic proxy service**

Extract from `src/proxy.js`:

```javascript
// src/services/anthropicProxy.js
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger.js';
import { logAPICall } from '../database/queries/index.js';
import { calculateCost } from './costCalculator.js';

async function forwardToAnthropic(req, res, agentName = 'unknown') {
  const ANTHROPIC_API_KEY = (process.env.ANTHROPIC_API_KEY || '').replace(/\s+/g, '');

  if (!ANTHROPIC_API_KEY) {
    logger.error('Anthropic API key not configured', new Error('Missing ANTHROPIC_API_KEY'));
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

  try {
    const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

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

    logger.info('Anthropic API call completed', {
      agent: agentName,
      model: requestBody.model,
      tokens: logEntry.totalTokens,
      cost: cost.totalCost
    });

    logAPICall(logEntry).catch(err => logger.error('Database log error', err));

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
    logger.error('Anthropic proxy error', error, { agent: agentName });
    res.status(500).json({ error: error.message });
  }
}

function estimateTokens(messages) {
  if (!Array.isArray(messages)) return 0;
  let total = 0;
  for (const msg of messages) {
    const text = msg.content || '';
    total += Math.ceil(text.length / 4);
  }
  return total;
}

export { forwardToAnthropic };
```

- [ ] **Step 3: Move and update cost calculator**

```javascript
// src/services/costCalculator.js
import { CONFIG, DEFAULT_MODEL_PRICE } from '../config/constants.js';

export function calculateCost(modelName, inputTokens, outputTokens) {
  const model = modelName || 'gpt-4o';
  const pricing = CONFIG.LLM_PRICING[model] || DEFAULT_MODEL_PRICE;

  // Pricing is per million tokens
  const inputCost = (inputTokens / 1_000_000) * (pricing.input || 0);
  const outputCost = (outputTokens / 1_000_000) * (pricing.output || 0);

  return {
    inputCost: parseFloat(inputCost.toFixed(6)),
    outputCost: parseFloat(outputCost.toFixed(6)),
    totalCost: parseFloat((inputCost + outputCost).toFixed(6)),
  };
}
```

- [ ] **Step 4: Create services index**

```javascript
// src/services/index.js
export { forwardToOpenAIAPI } from './openaiProxy.js';
export { forwardToAnthropic } from './anthropicProxy.js';
export { calculateCost } from './costCalculator.js';
```

- [ ] **Step 5: Commit**

```bash
git add src/services && git commit -m "feat: create service modules for API proxies and cost calculation"
```

---

### Task 5: Create controller modules

**Files:**
- Create: `src/api/controllers/proxyController.js`
- Create: `src/api/controllers/costController.js`
- Create: `src/api/controllers/agentController.js`
- Create: `src/api/controllers/loopController.js`
- Create: `src/api/controllers/index.js`

- [ ] **Step 1: Create proxy controller**

```javascript
// src/api/controllers/proxyController.js
import { forwardToOpenAIAPI, forwardToAnthropic } from '../../services/index.js';

function isAnthropicModel(model) {
  return model && (model.includes('claude') || model.startsWith('claude-'));
}

export async function handleChatCompletion(req, res) {
  const model = req.body.model || 'gpt-3.5-turbo';
  const agentName = req.agentName || 'unknown';

  if (isAnthropicModel(model)) {
    return forwardToAnthropic(req, res, agentName);
  }

  return forwardToOpenAIAPI(req, res, agentName);
}
```

- [ ] **Step 2: Create cost controller**

```javascript
// src/api/controllers/costController.js
import { getAgentCosts, getAllAgents } from '../../database/queries/index.js';
import { logger } from '../../utils/logger.js';

export async function getAgentCostsSummary(req, res) {
  try {
    const { agent } = req.params;
    const costs = await getAgentCosts(agent);
    res.json(costs);
  } catch (err) {
    logger.error('Get costs failed', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getAllCosts(req, res) {
  try {
    const agents = await getAllAgents();
    const costs = {};
    for (const agent of agents) {
      costs[agent] = await getAgentCosts(agent);
    }
    res.json({ costs });
  } catch (err) {
    logger.error('Get all costs failed', err);
    res.status(500).json({ error: err.message });
  }
}
```

- [ ] **Step 3: Create agent controller**

```javascript
// src/api/controllers/agentController.js
import { getAllAgents } from '../../database/queries/index.js';
import { logger } from '../../utils/logger.js';

export async function listAllAgents(req, res) {
  try {
    const agents = await getAllAgents();
    res.json({ agents });
  } catch (err) {
    logger.error('Get agents failed', err);
    res.status(500).json({ error: err.message });
  }
}
```

- [ ] **Step 4: Create loop controller**

```javascript
// src/api/controllers/loopController.js
import { initLoopDetector, checkRunawayLoop, getAgentCallStats } from '../../loopDetector.js';
import { logger } from '../../utils/logger.js';

export function checkForRunawayLoop(agentName, messages) {
  return checkRunawayLoop(agentName, messages);
}

export function getAgentStats(req, res) {
  try {
    const { agent } = req.params;
    const stats = getAgentCallStats(agent);
    res.json(stats);
  } catch (err) {
    logger.error('Get agent stats failed', err);
    res.status(500).json({ error: err.message });
  }
}
```

- [ ] **Step 5: Create controllers index**

```javascript
// src/api/controllers/index.js
export { handleChatCompletion } from './proxyController.js';
export { getAgentCostsSummary, getAllCosts } from './costController.js';
export { listAllAgents } from './agentController.js';
export { checkForRunawayLoop, getAgentStats } from './loopController.js';
```

- [ ] **Step 6: Commit**

```bash
git add src/api/controllers && git commit -m "feat: create controller modules with business logic"
```

---

### Task 6: Create route modules

**Files:**
- Create: `src/api/routes/health.js`
- Create: `src/api/routes/proxy.js`
- Create: `src/api/routes/costs.js`
- Create: `src/api/routes/agents.js`
- Create: `src/api/routes/stats.js`
- Create: `src/api/routes/management.js`
- Create: `src/api/routes/automations.js`
- Create: `src/api/routes/index.js`

- [ ] **Step 1: Create health routes**

```javascript
// src/api/routes/health.js
import express from 'express';
import { CONFIG } from '../../config/constants.js';
import { checkDatabaseHealth } from '../../config/database.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

router.get('/health/detailed', async (req, res) => {
  try {
    const dbHealthy = await checkDatabaseHealth();

    let proxyHealthy = true;
    try {
      const testResponse = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        signal: AbortSignal.timeout(5000)
      });
      proxyHealthy = testResponse.status === 200;
    } catch {
      proxyHealthy = false;
    }

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        openaiProxy: proxyHealthy ? 'healthy' : 'unhealthy',
        automations: 'scheduled',
      },
      environment: {
        nodeEnv: CONFIG.NODE_ENV,
        port: CONFIG.PORT,
      }
    });
  } catch (err) {
    res.status(503).json({
      status: 'degraded',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
```

- [ ] **Step 2: Create proxy routes**

```javascript
// src/api/routes/proxy.js
import express from 'express';
import { handleChatCompletion, checkForRunawayLoop } from '../controllers/index.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();
const blockedAgents = new Set();

router.post('/v1/chat/completions', (req, res) => {
  const agentName = req.agentName;

  if (blockedAgents.has(agentName)) {
    logger.warn('Blocked agent attempted request', { agent: agentName });
    return res.status(429).json({
      error: `Agent "${agentName}" is blocked due to runaway loop detection. Contact support to unblock.`,
    });
  }

  const loopCheck = checkForRunawayLoop(agentName, req.body.messages);
  if (loopCheck.isLoop) {
    blockedAgents.add(agentName);
    logger.error('Runaway loop detected', new Error(`Runaway loop: ${loopCheck.reason}`), {
      agent: agentName,
      callCount: loopCheck.callCount,
    });
    return res.status(429).json({
      error: `Runaway loop detected (${loopCheck.callCount} calls in 90s). Agent blocked.`,
    });
  }

  handleChatCompletion(req, res);
});

export { blockedAgents };
export default router;
```

- [ ] **Step 3: Create costs routes**

```javascript
// src/api/routes/costs.js
import express from 'express';
import { getAgentCostsSummary, getAllCosts } from '../controllers/index.js';

const router = express.Router();

router.get('/api/costs/:agent', getAgentCostsSummary);
router.get('/api/costs', getAllCosts);

export default router;
```

- [ ] **Step 4: Create agents routes**

```javascript
// src/api/routes/agents.js
import express from 'express';
import { listAllAgents } from '../controllers/index.js';

const router = express.Router();

router.get('/api/agents', listAllAgents);

export default router;
```

- [ ] **Step 5: Create stats routes**

```javascript
// src/api/routes/stats.js
import express from 'express';
import { getAgentStats } from '../controllers/index.js';

const router = express.Router();

router.get('/api/agent-stats/:agent', getAgentStats);

export default router;
```

- [ ] **Step 6: Create management routes**

```javascript
// src/api/routes/management.js
import express from 'express';
import { blockedAgents } from './proxy.js';
import { logger } from '../../utils/logger.js';
import { requestLog } from '../../proxy.js';

const router = express.Router();

router.get('/api/logs', (req, res) => {
  res.json({ logs: requestLog });
});

router.get('/api/system-status', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    blockedAgents: Array.from(blockedAgents),
    automations: {
      seo: 'Scheduled: Sun 2:30am UTC',
      coldEmails: 'Scheduled: Mon 5am UTC',
      clickDetection: 'Scheduled: Every 6 hours',
      freeTierChecks: 'Scheduled: Every 6 hours',
      weeklyReports: 'Scheduled: Mon 2:30am UTC',
      insightGeneration: 'Scheduled: Mon 4am UTC'
    }
  });
});

router.post('/api/unblock/:agent', (req, res) => {
  try {
    const { agent } = req.params;
    blockedAgents.delete(agent);
    logger.info('Agent unblocked', { agent });
    res.json({ message: `Agent "${agent}" unblocked` });
  } catch (err) {
    logger.error('Unblock agent failed', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

- [ ] **Step 7: Create automations routes**

```javascript
// src/api/routes/automations.js
import express from 'express';
import { logger } from '../../utils/logger.js';

const router = express.Router();

router.post('/automations/seo', (req, res) => {
  logger.info('SEO automation triggered');
  res.json({ status: 'SEO article generation queued', message: 'Will generate and publish to GitHub' });
});

router.post('/automations/email', (req, res) => {
  logger.info('Email automation triggered');
  res.json({ status: 'Cold email sequence started', leads: 50, emailsSent: 'Day 0 sequence' });
});

router.post('/automations/free-tier', (req, res) => {
  logger.info('Free tier automation triggered');
  res.json({ status: 'Free tier checks running', usersChecked: 'all', emailsSent: 0 });
});

router.post('/automations/intent', (req, res) => {
  logger.info('Intent detection automation triggered');
  res.json({ status: 'Intent detection running', companiesFound: 0, alertsSent: 0 });
});

export default router;
```

- [ ] **Step 8: Create routes index**

```javascript
// src/api/routes/index.js
export { default as healthRoutes } from './health.js';
export { default as proxyRoutes } from './proxy.js';
export { default as costsRoutes } from './costs.js';
export { default as agentsRoutes } from './agents.js';
export { default as statsRoutes } from './stats.js';
export { default as managementRoutes } from './management.js';
export { default as automationsRoutes } from './automations.js';
```

- [ ] **Step 9: Commit**

```bash
git add src/api/routes && git commit -m "feat: create route modules"
```

---

### Task 7: Create auth modules (stub for Section 5)

**Files:**
- Create: `src/auth/jwt.js`
- Create: `src/auth/apiKeys.js`
- Create: `src/auth/index.js`

- [ ] **Step 1: Create JWT module**

```javascript
// src/auth/jwt.js
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export function signJWT(payload) {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (err) {
    logger.error('JWT sign error', err);
    return null;
  }
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    logger.error('JWT verify error', err);
    return null;
  }
}
```

- [ ] **Step 2: Create API keys module**

```javascript
// src/auth/apiKeys.js
import { logger } from '../utils/logger.js';

const validApiKeys = new Set(
  (process.env.VALID_API_KEYS || '').split(',').filter(Boolean)
);

export function validateApiKey(key) {
  if (!key) return false;
  return validApiKeys.has(key);
}

export function addApiKey(key) {
  validApiKeys.add(key);
  logger.info('API key added');
}

export function removeApiKey(key) {
  validApiKeys.delete(key);
  logger.info('API key removed');
}
```

- [ ] **Step 3: Create auth index**

```javascript
// src/auth/index.js
export { signJWT, verifyJWT } from './jwt.js';
export { validateApiKey, addApiKey, removeApiKey } from './apiKeys.js';
```

- [ ] **Step 4: Commit**

```bash
git add src/auth && git commit -m "feat: create auth modules (stubs for Section 5)"
```

---

### Task 8: Refactor server.js to use modular structure

**Files:**
- Modify: `src/server.js`

- [ ] **Step 1: Rewrite server.js**

```javascript
// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { CONFIG } from './config/constants.js';
import { initLoopDetector, initAutomations } from './loopDetector.js';

// Import middleware
import { corsMiddleware, errorHandler, requestLogger, extractAgentName } from './api/middleware/index.js';

// Import routes
import {
  healthRoutes,
  proxyRoutes,
  costsRoutes,
  agentsRoutes,
  statsRoutes,
  managementRoutes,
  automationsRoutes
} from './api/routes/index.js';

dotenv.config();

// Initialize core systems
initLoopDetector();
initAutomations();

const app = express();
const PORT = CONFIG.PORT;

logger.info('Server initializing', { port: PORT, environment: CONFIG.NODE_ENV });

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(requestLogger);
app.use(extractAgentName);

// Routes
app.use(healthRoutes);
app.use(proxyRoutes);
app.use(costsRoutes);
app.use(agentsRoutes);
app.use(statsRoutes);
app.use(managementRoutes);
app.use(automationsRoutes);

// Signup endpoint (temporary - to be replaced in Section 5)
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, company } = req.body;
    if (!name || !email || !company) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const apiKey = `sk-${Math.random().toString(36).substr(2, 32)}`;
    res.json({ success: true, apiKey, message: 'Account created. Check your email for welcome.' });
    logger.info('New signup', { email });
  } catch (err) {
    logger.error('Signup failed', err);
    res.status(500).json({ error: err.message });
  }
});

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received: shutting down gracefully');
  const { stopAutomations } = await import('./automations/cron.js');
  stopAutomations();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info('Layer ROI backend is LIVE', { port: PORT, environment: CONFIG.NODE_ENV });
});

export default app;
```

- [ ] **Step 2: Commit**

```bash
git add src/server.js && git commit -m "refactor: restructure server.js to use modular architecture"
```

---

### Task 9: Move loopDetector and update imports

**Files:**
- Modify: `src/loopDetector.js` (verify it still works)
- Delete: `src/proxy.js` (now split into services and controllers)
- Delete: `src/database.js` (now split into database/queries)
- Delete: `src/costCalculator.js` (now in services)

- [ ] **Step 1: Test that server still starts**

```bash
npm start
```

Expected: Server starts without errors, logs "Layer ROI backend is LIVE"

- [ ] **Step 2: Verify loop detector still exports properly**

```bash
node -e "import('./src/loopDetector.js').then(m => console.log('✓ loopDetector imports:', Object.keys(m)))"
```

Expected: Should list `initLoopDetector`, `checkRunawayLoop`, `getAgentCallStats`

- [ ] **Step 3: Delete old files (they're now split into modular pieces)**

```bash
rm src/proxy.js src/database.js src/costCalculator.js
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: remove old monolithic files, now modularized"
```

---

### Task 10: Create utils helpers module

**Files:**
- Create: `src/utils/tokenEstimator.js`
- Create: `src/utils/validators.js`
- Modify: `src/utils/index.js`

- [ ] **Step 1: Create token estimator utility**

```javascript
// src/utils/tokenEstimator.js
export function estimateTokens(messages) {
  if (!Array.isArray(messages)) return 0;
  let total = 0;
  for (const msg of messages) {
    const text = msg.content || '';
    total += Math.ceil(text.length / 4);
  }
  return total;
}
```

- [ ] **Step 2: Create validators utility**

```javascript
// src/utils/validators.js
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
}

export function isValidModel(model) {
  if (!model || typeof model !== 'string') return false;
  return /^[a-z0-9-]+$/.test(model.toLowerCase());
}
```

- [ ] **Step 3: Create utils index**

```javascript
// src/utils/index.js
export { logger } from './logger.js';
export { estimateTokens } from './tokenEstimator.js';
export { isValidEmail, isValidUUID, isValidModel } from './validators.js';
```

- [ ] **Step 4: Commit**

```bash
git add src/utils && git commit -m "feat: create utils helpers for tokens and validation"
```

---

### Task 11: Update all imports across codebase

**Files:**
- Modify: `src/loopDetector.js`
- Modify: `src/automations/cron.js`
- Verify all imports work

- [ ] **Step 1: Update loopDetector imports**

Check file and update imports to use new modular structure:

```bash
grep -n "import.*from.*proxy\|import.*from.*database\|import.*from.*costCalculator" src/loopDetector.js || echo "No old imports found"
```

If any old imports exist, update them to use new paths (src/services, src/database/queries, etc.)

- [ ] **Step 2: Update automations/cron.js imports**

```bash
grep -n "import.*from.*proxy\|import.*from.*database\|import.*from.*costCalculator" src/automations/cron.js || echo "No old imports found"
```

- [ ] **Step 3: Verify no broken imports**

```bash
npm test 2>&1 | head -20 || npm start 2>&1 | head -30
```

Should start server without "Cannot find module" errors

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: update imports to use modular structure"
```

---

### Task 12: Final verification and cleanup

**Files:**
- Verify directory structure
- Verify server starts
- Verify endpoints respond

- [ ] **Step 1: Check final directory structure**

```bash
find src -type f -name "*.js" | sort | head -40
```

Expected: See all new modules in api/routes, api/middleware, api/controllers, services, database/queries, auth

- [ ] **Step 2: Start server and verify it responds**

```bash
timeout 5 npm start 2>&1 | grep -E "LIVE|Error|Cannot find" || true
```

Expected: Should see "Layer ROI backend is LIVE"

- [ ] **Step 3: Test health endpoint**

```bash
curl -s http://localhost:5000/health | jq .
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2026-04-13T...",
  "version": "2.0.0"
}
```

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "refactor: complete backend modularization (Section 3)"
```

- [ ] **Step 5: Verify git history**

```bash
git log --oneline | head -15
```

Should see commits from this section reflecting modular architecture

---

**Section 3 Complete**

All endpoints preserved, zero functionality lost, codebase now modular and scalable for Sections 4-15.
