import cron from 'node-cron';
import { generateSEOArticle } from './seoEngine.js';
import { sendColdEmailSequence, checkClicksAndAlert } from './emailEngine.js';
import { checkFreeTierUpgradeTriggers } from './freeTierEngine.js';
import { trackPageVisit } from './intentDetection.js';

export function initAutomations() {
  // Every Sunday 8am IST = every Sunday 2:30 UTC
  cron.schedule('30 2 * * 0', async () => {
    try {
      console.log('🔄 Running SEO content generation...');
      await generateSEOArticle();
    } catch (error) {
      console.error('SEO generation error:', error);
    }
  });

  // Every Monday 9am IST = every Monday 3:30 UTC
  cron.schedule('30 3 * * 1', async () => {
    try {
      console.log('📧 Running cold email sequence...');
      await sendColdEmailSequence();
    } catch (error) {
      console.error('Email sequence error:', error);
    }
  });

  // Every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    try {
      console.log('⏰ Checking free tier upgrades...');
      await checkFreeTierUpgradeTriggers();
    } catch (error) {
      console.error('Upgrade trigger error:', error);
    }
  });

  // Check lead clicks every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🔍 Checking hot leads...');
      await checkClicksAndAlert();
    } catch (error) {
      console.error('Lead check error:', error);
    }
  });

  console.log('✅ Automations initialized');
}
