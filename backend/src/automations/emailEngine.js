import { Resend } from 'resend';
import axios from 'axios';
import { logLead, checkLeadIntent } from './database.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const APOLLO_KEY = process.env.APOLLO_API_KEY;
const HUNTER_KEY = process.env.HUNTER_API_KEY;

export async function fetchLeadsFromApollo() {
  const response = await axios.post('https://api.apollo.io/v1/people/search', {
    api_key: APOLLO_KEY,
    q_person_titles: ['Head of AI', 'VP Engineering', 'CTO', 'Chief AI Officer'],
    company_size: ['200-500', '501-1000', '1001-5000'],
    company_industries: ['SaaS', 'Technology', 'Financial Services'],
    limit: 50,
  });

  return response.data.people || [];
}

export async function enrichWithHunterEmail(person) {
  try {
    const response = await axios.get('https://api.hunter.io/v2/email-finder', {
      params: {
        domain: person.company.domain,
        first_name: person.first_name,
        last_name: person.last_name,
        api_key: HUNTER_KEY,
      },
    });
    return response.data.data?.email;
  } catch {
    return person.email;
  }
}

export async function sendColdEmailSequence() {
  const leads = await fetchLeadsFromApollo();

  for (const person of leads) {
    const email = await enrichWithHunterEmail(person);

    // Email 1: Initial outreach
    await resend.emails.send({
      from: 'sales@agentcfo.com',
      to: email,
      subject: `Do you know which of your AI agents are profitable?`,
      html: `
        <p>Hi ${person.first_name},</p>
        <p>Quick question: do you know which of your AI agents have positive ROI and which are burning money silently?</p>
        <p>Most engineering leaders I talk to can answer their total LLM spend roughly. Almost none can tell me, with confidence, which specific agents are profitable.</p>
        <p>We built AgentCFO to solve this — 15-minute setup, then you have a live P&L for every agent your team is running. No infrastructure changes.</p>
        <p><a href="https://agent-cfo-six.vercel.app">See it here</a>. Worth 20 minutes to show you the live version?</p>
        <p>Best,<br/>AgentCFO Team</p>
      `,
    });

    await logLead({
      firstName: person.first_name,
      lastName: person.last_name,
      email,
      company: person.company.name,
      title: person.title,
      sequence: 1,
      sentAt: new Date(),
    });
  }
}

export async function checkClicksAndAlert() {
  // This would integrate with Resend webhooks to track clicks
  // When a click is detected, log as hot lead and send Slack alert
  const hotLeads = await checkLeadIntent();

  for (const lead of hotLeads) {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `🔥 Hot lead: ${lead.firstName} ${lead.lastName} at ${lead.company} clicked the AgentCFO link`,
    });
  }
}
