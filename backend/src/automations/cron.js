// Automations are triggered via API endpoints instead of cron
// This keeps the server lightweight and reliable

export function initAutomations() {
  console.log('✅ Automations ready (trigger-based)');
  // Automations can be triggered via:
  // POST /automations/seo - Generate SEO article
  // POST /automations/email - Send cold email batch
  // POST /automations/free-tier - Check free tier upgrades
  // POST /automations/intent - Check company visits
}
