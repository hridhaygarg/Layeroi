import { supabase } from '../config/database.js';
import { seedDemoApiLogs } from './seed-demo-data.js';

/**
 * Check if this org needs demo data re-seeded (month boundary crossed).
 * Uses seed_last_refreshed_at as a race guard so only one request triggers the reseed.
 * Call this before reading api_logs for the current month.
 */
export async function reseedIfStale(orgId) {
  if (!orgId) return false;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Does this org have seed agents?
  const { count: seedAgentCount } = await supabase
    .from('agents')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('seed', true);

  if (!seedAgentCount || seedAgentCount === 0) return false;

  // Does this org have any real (non-seed) billing sources connected?
  const { count: sourceCount } = await supabase
    .from('billing_sources')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'active');

  if (sourceCount && sourceCount > 0) return false;

  // Are there current-month seed logs?
  const { count: currentMonthLogs } = await supabase
    .from('api_logs')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('seed', true)
    .gte('created_at', monthStart.toISOString());

  if (currentMonthLogs && currentMonthLogs > 0) return false;

  // Race guard: only one request wins the UPDATE
  const { data: updated } = await supabase
    .from('organisations')
    .update({ seed_last_refreshed_at: now.toISOString() })
    .eq('id', orgId)
    .or('seed_last_refreshed_at.is.null,seed_last_refreshed_at.lt.' + new Date(now.getTime() - 60000).toISOString())
    .select('id');

  if (!updated || updated.length === 0) {
    // Another request is already re-seeding
    return false;
  }

  console.log('[demo-reseed]', { orgId, reason: 'stale_month_boundary' });
  await seedDemoApiLogs(orgId);
  return true;
}
