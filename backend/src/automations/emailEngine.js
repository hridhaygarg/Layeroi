import { Resend } from 'resend';
import { logLead, checkLeadIntent } from './database.js';

const RESEND_KEY = process.env.RESEND_API_KEY;
const APOLLO_KEY = process.env.APOLLO_API_KEY;

// Initialize Resend only if API key is available
const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

export async function fetchLeadsFromApollo() {
  const { default: axios } = await import('axios');
  const response = await axios.post('https://api.apollo.io/v1/people/search', {
    api_key: APOLLO_KEY,
    q_person_titles: ['Head of AI', 'VP Engineering', 'CTO', 'Chief AI Officer'],
    company_size: ['200-500', '501-1000', '1001-5000'],
    company_industries: ['SaaS', 'Technology', 'Financial Services'],
    limit: 50,
  });

  return response.data.people || [];
}

export async function sendColdEmailSequence() {
  const leads = await fetchLeadsFromApollo();

  for (const person of leads) {
    // Apollo includes email field directly
    const email = person.email;

    if (!email) {
      console.log(`⚠️ No email found for ${person.first_name} ${person.last_name} at ${person.company?.name}`);
      continue;
    }

    // Email 1: Initial outreach
    await resend.emails.send({
      from: 'Layer ROI <hello@layeroi.com>',
      to: email,
      subject: `Do you know which of your AI agents are profitable?`,
      html: `
        <p>Hi ${person.first_name},</p>
        <p>Quick question: do you know which of your AI agents have positive ROI and which are burning money silently?</p>
        <p>Most engineering leaders I talk to can answer their total LLM spend roughly. Almost none can tell me, with confidence, which specific agents are profitable.</p>
        <p>We built Layer ROI to solve this — 15-minute setup, then you have a live P&L for every agent your team is running. No infrastructure changes.</p>
        <p><a href="https://layeroi.com">See it here</a>. Worth 20 minutes to show you the live version?</p>
        <p>Best,<br/>Layer ROI Team</p>
      `,
    });

    await logLead({
      firstName: person.first_name,
      lastName: person.last_name,
      email,
      company: person.company?.name,
      title: person.title,
      sequence: 1,
      sentAt: new Date(),
    });

    console.log(`📧 Cold email sent to ${email}`);
  }
}

export async function checkClicksAndAlert() {
  // This would integrate with Resend webhooks to track clicks
  // When a click is detected, log as hot lead
  const hotLeads = await checkLeadIntent();

  for (const lead of hotLeads) {
    console.log(`🔥 HOT LEAD: ${lead.firstName} ${lead.lastName} at ${lead.company} clicked the Layer ROI link`);
  }
}
