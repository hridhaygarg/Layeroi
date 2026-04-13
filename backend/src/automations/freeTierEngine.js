import { Resend } from 'resend';
import { logUser, getUserAgentCount, getUserSpend, getTopAgent } from './database.js';

const RESEND_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

export async function createFreeUser(name, email, company) {
  const apiKey = `sk-${Math.random().toString(36).substr(2, 32)}`;

  const user = await logUser({
    name,
    email,
    company,
    apiKey,
    plan: 'free',
    agentLimit: 2,
    historyDays: 14,
    createdAt: new Date(),
  });

  // Send welcome email
  await resend.emails.send({
    from: 'Layer ROI <hello@layeroi.com>',
    to: email,
    subject: 'Welcome to Layer ROI – Your API Key Inside',
    html: `
      <h1>Welcome to Layer ROI, ${name}!</h1>
      <p>Your API key is ready. Update one line of code in your agent:</p>
      <pre>baseURL: 'https://api.layeroi.com'</pre>
      <p>Your API key: <code>${apiKey}</code></p>
      <p>You have 2 agents and 14 days of history on the free plan. <a href="https://layeroi.com">See your dashboard</a></p>
    `,
  });

  return user;
}

export async function checkFreeTierUpgradeTriggers() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  // Get all free tier users
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('plan', 'free');

  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  for (const user of users) {
    const daysSinceSignup = Math.floor(
      (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24)
    );

    // Day 2: Show first costs
    if (daysSinceSignup === 2) {
      await sendDay2Email(user);
    }

    // Day 5: Alert if 2+ agents connected
    const { data: agents } = await supabase
      .from('api_calls')
      .select('agent_name', { count: 'exact' })
      .eq('user_id', user.id)
      .distinct();

    if (daysSinceSignup === 5 && agents && agents.length >= 2) {
      await sendDay5Email(user, agents.length);
    }

    // Day 10: Show spending with upgrade pitch
    if (daysSinceSignup === 10) {
      await sendDay10Email(user);
    }

    // Day 14: Trial ending
    if (daysSinceSignup === 14) {
      await sendDay14Email(user);
    }
  }
}

export async function sendDay2Email(user) {
  const topAgent = await getTopAgent(user.id);

  if (topAgent) {
    await resend.emails.send({
      from: 'Layer ROI <hello@layeroi.com>',
      to: user.email,
      subject: `Your first 48 hours — Layer ROI found something interesting`,
      html: `
        <p>Hi ${user.name},</p>
        <p>Your ${topAgent.name} agent has cost $${topAgent.cost.toFixed(2)} so far.</p>
        <p>Track all your agents on the <a href="https://layeroi.com">dashboard</a>.</p>
      `,
    });
  }
}

export async function sendDay5Email(user, agentCount) {
  await resend.emails.send({
    from: 'Layer ROI <hello@layeroi.com>',
    to: user.email,
    subject: `Your free tier gets 2 agents – you've hit the limit`,
    html: `
      <p>Hi ${user.name},</p>
      <p>You've connected ${agentCount} agents already – that's the free limit.</p>
      <p>Upgrade to track unlimited agents: <a href="https://layeroi.com/upgrade">Get started</a></p>
    `,
  });
}

export async function sendDay10Email(user) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  const { data: costs } = await supabase
    .from('api_calls')
    .select('cost_usd')
    .eq('user_id', user.id);

  const totalSpend = costs?.reduce((sum, call) => sum + call.cost_usd, 0) || 0;

  if (totalSpend > 0) {
    await resend.emails.send({
      from: 'Layer ROI <hello@layeroi.com>',
      to: user.email,
      subject: `You've spent $${totalSpend.toFixed(2)} on AI in 10 days`,
      html: `
        <p>Hi ${user.name},</p>
        <p>Your AI agents have already spent <strong>$${totalSpend.toFixed(2)}</strong> in 10 days.</p>
        <p>Can you afford not to track ROI per agent? Upgrade for full visibility: <a href="https://layeroi.com/upgrade">Upgrade now</a></p>
      `,
    });
  }
}

export async function sendDay14Email(user) {
  const totalSpend = await getUserSpend(user.id, 14);

  await resend.emails.send({
    from: 'Layer ROI <hello@layeroi.com>',
    to: user.email,
    subject: `Your trial is ending – 20% off your first month`,
    html: `
      <p>Hi ${user.name},</p>
      <p>You've spent $${totalSpend} in 2 weeks. Upgrade to unlimited agents and keep full history.</p>
      <p>Use code <strong>SAVE20</strong> for 20% off your first month.</p>
      <p><a href="https://layeroi.com/upgrade">Upgrade now</a></p>
    `,
  });
}
