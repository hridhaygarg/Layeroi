import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';

const AGENT_SEEDS = [
  { name: 'support-copilot',     provider: 'anthropic', avg_cost: 0.42, avg_value: 2.80, tasks_per_day: 140 },
  { name: 'sales-researcher',    provider: 'openai',    avg_cost: 0.85, avg_value: 4.20, tasks_per_day: 60 },
  { name: 'invoice-classifier',  provider: 'openai',    avg_cost: 0.08, avg_value: 0.35, tasks_per_day: 520 },
  { name: 'contract-summarizer', provider: 'anthropic', avg_cost: 1.40, avg_value: 1.10, tasks_per_day: 22 },
  { name: 'onboarding-bot',      provider: 'google',    avg_cost: 0.18, avg_value: 0.88, tasks_per_day: 85 },
];

/**
 * Create seed agents for an org. Idempotent — skips if seed agents already exist.
 */
export async function seedDemoAgents(orgId) {
  const { data: existing } = await supabase
    .from('agents')
    .select('id, name')
    .eq('org_id', orgId)
    .eq('seed', true);

  if (existing && existing.length > 0) {
    return { agents: existing.length, skipped: true };
  }

  const createdAgents = [];
  for (const a of AGENT_SEEDS) {
    const { data: agent } = await supabase.from('agents').insert({
      org_id: orgId,
      name: a.name,
      provider: a.provider,
      seed: true,
    }).select().single();
    if (agent) createdAgents.push({ ...agent, ...a });
  }

  logger.info('Demo agents seeded', { orgId, count: createdAgents.length });
  return { agents: createdAgents.length, skipped: false };
}

/**
 * Create seed api_logs for current month. Idempotent — skips if current-month seed logs exist.
 */
export async function seedDemoApiLogs(orgId) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Check if current-month seed logs already exist
  const { count } = await supabase
    .from('api_logs')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('seed', true)
    .gte('created_at', monthStart.toISOString());

  if (count && count > 0) {
    return { logs: count, skipped: true };
  }

  // Get seed agents for this org (with metadata for log generation)
  const { data: seedAgents } = await supabase
    .from('agents')
    .select('id, name, provider')
    .eq('org_id', orgId)
    .eq('seed', true);

  if (!seedAgents || seedAgents.length === 0) {
    return { logs: 0, skipped: true, reason: 'no_seed_agents' };
  }

  // Enrich with generation metadata
  const agents = seedAgents.map(a => {
    const meta = AGENT_SEEDS.find(s => s.name === a.name) || AGENT_SEEDS[0];
    return { ...a, avg_cost: meta.avg_cost, avg_value: meta.avg_value, tasks_per_day: meta.tasks_per_day };
  });

  const daysElapsed = Math.max(1, Math.ceil((now - monthStart) / 86400000));

  const logs = [];
  for (const agent of agents) {
    for (let d = 0; d < daysElapsed; d++) {
      const day = new Date(monthStart);
      day.setDate(monthStart.getDate() + d);
      const tasksThisDay = Math.floor(agent.tasks_per_day * (0.7 + Math.random() * 0.6));
      for (let t = 0; t < tasksThisDay; t++) {
        const jitter = 0.7 + Math.random() * 0.6;
        const model = agent.provider === 'openai' ? 'gpt-4o-mini'
          : agent.provider === 'anthropic' ? 'claude-3-5-sonnet'
          : 'gemini-1.5-flash';
        logs.push({
          org_id: orgId,
          agent_id: agent.id,
          agent_name: agent.name,
          provider: agent.provider,
          model,
          cost_usd: +(agent.avg_cost * jitter).toFixed(4),
          value: +(agent.avg_value * jitter).toFixed(4),
          prompt_tokens: Math.floor(500 + Math.random() * 1500),
          completion_tokens: Math.floor(200 + Math.random() * 600),
          total_tokens: Math.floor(700 + Math.random() * 2100),
          created_at: new Date(day.getTime() + Math.random() * 86400000).toISOString(),
          seed: true,
        });
      }
    }
  }

  // Delete stale seed logs from previous months before inserting fresh ones
  await supabase
    .from('api_logs')
    .delete()
    .eq('org_id', orgId)
    .eq('seed', true)
    .lt('created_at', monthStart.toISOString());

  for (let i = 0; i < logs.length; i += 500) {
    const batch = logs.slice(i, i + 500);
    await supabase.from('api_logs').insert(batch);
  }

  logger.info('Demo api_logs seeded', { orgId, logs: logs.length });
  return { logs: logs.length, skipped: false };
}

/**
 * Full seed (agents + logs). Used at signup time.
 */
export async function seedDemoDataForOrg(orgId) {
  const agentResult = await seedDemoAgents(orgId);
  const logResult = await seedDemoApiLogs(orgId);
  return { agents: agentResult.agents, logs: logResult.logs };
}
