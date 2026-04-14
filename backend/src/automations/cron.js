import cron from 'node-cron';
import { generateSEOArticle } from './seoEngine.js';
import { sendColdEmailSequence, checkClicksAndAlert } from './emailEngine.js';
import { checkFreeTierUpgradeTriggers } from './freeTierEngine.js';
import {
  buildOutreachQueue,
  generateMessagesForQueue,
  sendOutreachEmails,
  sendFollowUpReminders,
} from './outreachEngine.js';

let cronJobs = [];

export function initAutomations() {
  console.log('⏰ Initializing cron-based automations...');

  // SEO Article Generation: Every Tuesday and Friday at 10 AM UTC
  cronJobs.push(
    cron.schedule('0 10 * * 2,5', async () => {
      try {
        console.log('[CRON] Triggering SEO article generation...');
        await generateSEOArticle();
      } catch (err) {
        console.error('[CRON ERROR] SEO generation failed:', err.message);
      }
    })
  );

  // Cold Email Sequence: Every Monday at 8 AM UTC
  cronJobs.push(
    cron.schedule('0 8 * * 1', async () => {
      try {
        console.log('[CRON] Triggering cold email sequence...');
        await sendColdEmailSequence();
      } catch (err) {
        console.error('[CRON ERROR] Cold email failed:', err.message);
      }
    })
  );

  // Check Email Clicks and Hot Leads: Every 6 hours
  cronJobs.push(
    cron.schedule('0 */6 * * *', async () => {
      try {
        console.log('[CRON] Checking email clicks and intent...');
        await checkClicksAndAlert();
      } catch (err) {
        console.error('[CRON ERROR] Click check failed:', err.message);
      }
    })
  );

  // Free Tier Upgrade Triggers: Every 6 hours
  cronJobs.push(
    cron.schedule('0 */6 * * *', async () => {
      try {
        console.log('[CRON] Checking free tier upgrade triggers...');
        await checkFreeTierUpgradeTriggers();
      } catch (err) {
        console.error('[CRON ERROR] Free tier check failed:', err.message);
      }
    })
  );

  // Weekly Admin Report: Every Sunday at 9 AM UTC (uses dynamic import)
  cronJobs.push(
    cron.schedule('0 9 * * 0', async () => {
      try {
        console.log('[CRON] Sending weekly admin report...');
        // Dynamic import allows graceful handling if weeklyReport.js not yet created
        const { sendWeeklyAdminReport } = await import('./weeklyReport.js');
        await sendWeeklyAdminReport();
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          console.warn('[CRON WARN] Weekly report module not yet available');
        } else {
          console.error('[CRON ERROR] Weekly report failed:', err.message);
        }
      }
    })
  );

  // Outreach Engine: Build queue every Monday at 12:30 AM UTC (6:00 AM IST)
  cronJobs.push(
    cron.schedule('30 0 * * 1', async () => {
      try {
        console.log('[CRON] Building outreach queue for the week...');
        const result = await buildOutreachQueue();
        console.log(`[CRON] Queue built: ${result.prospectCount} prospects added`);
      } catch (err) {
        console.error('[CRON ERROR] Outreach queue build failed:', err.message);
      }
    })
  );

  // Outreach Engine: Generate messages for pending prospects every Monday at 1:00 AM UTC (6:30 AM IST)
  cronJobs.push(
    cron.schedule('0 1 * * 1', async () => {
      try {
        console.log('[CRON] Generating personalized messages...');
        const result = await generateMessagesForQueue();
        console.log(`[CRON] Messages generated: ${result.messageCount}`);
      } catch (err) {
        console.error('[CRON ERROR] Message generation failed:', err.message);
      }
    })
  );

  // Outreach Engine: Send emails for queued prospects every Monday at 2:00 AM UTC (7:30 AM IST)
  cronJobs.push(
    cron.schedule('0 2 * * 1', async () => {
      try {
        console.log('[CRON] Sending outreach emails...');
        const result = await sendOutreachEmails();
        console.log(`[CRON] Emails sent: ${result.sentCount}`);
      } catch (err) {
        console.error('[CRON ERROR] Email sending failed:', err.message);
      }
    })
  );

  // Outreach Engine: Send follow-up reminders every Thursday at 12:30 AM UTC (6:00 AM IST)
  cronJobs.push(
    cron.schedule('30 0 * * 4', async () => {
      try {
        console.log('[CRON] Queueing follow-up reminders...');
        const result = await sendFollowUpReminders();
        console.log(`[CRON] Follow-ups queued: ${result.followUpCount}`);
      } catch (err) {
        console.error('[CRON ERROR] Follow-up queueing failed:', err.message);
      }
    })
  );

  console.log(`✅ ${cronJobs.length} automation cron jobs scheduled`);
  console.log('   → SEO generation: Tue/Fri 10:00 UTC');
  console.log('   → Cold emails: Mon 08:00 UTC');
  console.log('   → Click checks: Every 6 hours');
  console.log('   → Free tier checks: Every 6 hours');
  console.log('   → Weekly reports: Sun 09:00 UTC');
  console.log('   → Outreach queue build: Mon 00:30 UTC (6:00 AM IST)');
  console.log('   → Outreach message gen: Mon 01:00 UTC (6:30 AM IST)');
  console.log('   → Outreach email send: Mon 02:00 UTC (7:30 AM IST)');
  console.log('   → Follow-up reminders: Thu 00:30 UTC (6:00 AM IST)');
}

export function stopAutomations() {
  cronJobs.forEach(job => job.stop());
  console.log('⏹ All automation cron jobs stopped');
}
