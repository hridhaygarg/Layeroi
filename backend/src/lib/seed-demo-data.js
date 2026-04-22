import { supabase } from '../config/database.js';
import { logger } from '../utils/logger.js';

export async function seedDemoDataForOrg(orgId) {
  const agentSeeds = [
    { name: 'support-copilot',     provider: 'anthropic', avg_cost: 0.42, avg_value: 2.80, tasks_per_day: 140 },
    { name: 'sales-researcher',    provider: 'openai',    avg_cost: 0.85, avg_value: 4.20, tasks_per_day: 60 },
    { name: 'invoice-classifier',  provider: 'openai',    avg_cost: 0.08, avg_value: 0.35, tasks_per_day: 520 },
    { name: 'contract-summarizer', provider: 'anthropic', avg_cost: 1.40, avg_value: 1.10, tasks_per_day: 22 },
    { name: 'onboarding-bot',      provider: 'google',    avg_cost: 0.18, avg_value: 0.88, tasks_per_day: 85 },
  ];

  const createdAgents = [];
  for (const a of agentSeeds) {
    const { data: agent } = await supabase.from('agents').insert({
      org_id: orgId,
      name: a.name,
      provider: a.provider,
      seed: true,
    }).select().single();
    if (agent) createdAgents.push({ ...agent, ...a });
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysElapsed = Math.max(1, Math.ceil((now - monthStart) / 86400000));

  const logs = [];
  for (const agent of createdAgents) {
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

  for (let i = 0; i < logs.length; i += 500) {
    const batch = logs.slice(i, i + 500);
    await supabase.from('api_logs').insert(batch);
  }

  logger.info('Demo data seeded', { orgId, agents: createdAgents.length, logs: logs.length });
  return { agents: createdAgents.length, logs: logs.length };
}
