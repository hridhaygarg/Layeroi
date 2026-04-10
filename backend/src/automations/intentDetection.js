import axios from 'axios';
import { logCompanyVisit, checkHighIntentCompany } from './database.js';

export async function detectCompanyFromIP(ip) {
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`);
    const org = response.data.org || response.data.company;

    return {
      company: org,
      country: response.data.country,
      city: response.data.city,
    };
  } catch {
    return null;
  }
}

export async function trackPageVisit(ip, page) {
  const company = await detectCompanyFromIP(ip);

  if (company) {
    await logCompanyVisit({
      company: company.company,
      page,
      timestamp: new Date(),
      ip,
    });

    // Check if high intent (3+ visits in 7 days)
    const intent = await checkHighIntentCompany(company.company);

    if (intent.visits >= 3) {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `🎯 High intent: ${company.company} visited ${intent.visits} times this week. Pages: ${intent.pages.join(', ')}`,
      });
    }
  }
}

export async function checkSignupFromTargetCompany(email, company) {
  // If company size > 500, flag as priority
  try {
    const response = await axios.get(`https://api.clearbit.com/v1/companies/find`, {
      params: { name: company },
      auth: { username: process.env.CLEARBIT_KEY },
    });

    const companyData = response.data;

    if (companyData.metrics?.employees > 500) {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `🌟 Priority signup: ${email} from ${company} (${companyData.metrics.employees} employees)`,
      });
    }
  } catch {
    // Continue without error
  }
}
