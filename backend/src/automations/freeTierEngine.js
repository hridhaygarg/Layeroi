import { Resend } from 'resend';
import { logUser, getUserAgentCount, getUserSpend } from './database.js';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    from: 'onboarding@agentcfo.com',
    to: email,
    subject: 'Welcome to AgentCFO – Your API Key Inside',
    html: `
      <h1>Welcome to AgentCFO, ${name}!</h1>
      <p>Your API key is ready. Update one line of code in your agent:</p>
      <pre>baseURL: 'https://agentcfo-production.up.railway.app'</pre>
      <p>Your API key: <code>${apiKey}</code></p>
      <p>You have 2 agents and 14 days of history on the free plan. <a href="https://agent-cfo-six.vercel.app">See your dashboard</a></p>
    `,
  });

  return user;
}

export async function checkFreeTierUpgradeTriggers() {
  // Day 2: Show first costs
  // Day 5: Alert if 2 agents connected
  // Day 10: Show spending with upgrade pitch
  // Day 14: Trial ending

  // This runs every 6 hours via cron
  // For each user, check their days since signup and trigger appropriate email
}

export async function sendDay2Email(user) {
  const topAgent = await logUser.getTopAgent(user.id);

  if (topAgent) {
    await resend.emails.send({
      from: 'product@agentcfo.com',
      to: user.email,
      subject: `Your first 48 hours — AgentCFO found something interesting`,
      html: `
        <p>Hi ${user.name},</p>
        <p>Your ${topAgent.name} agent spent $${topAgent.cost} in the first 48 hours with ROI of ${topAgent.roi}×.</p>
        <p>Track all your agents on the <a href="https://agent-cfo-six.vercel.app">dashboard</a>.</p>
      `,
    });
  }
}

export async function sendDay14Email(user) {
  const totalSpend = await getUserSpend(user.id, 14);

  await resend.emails.send({
    from: 'product@agentcfo.com',
    to: user.email,
    subject: `Your trial is ending – 20% off your first month`,
    html: `
      <p>Hi ${user.name},</p>
      <p>You've spent $${totalSpend} in 2 weeks. Upgrade to unlimited agents and keep full history.</p>
      <p>Use code <strong>SAVE20</strong> for 20% off your first month.</p>
      <p><a href="https://agent-cfo-six.vercel.app/upgrade">Upgrade now</a></p>
    `,
  });
}
