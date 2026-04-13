import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Validate environment variables on startup
if (!SUPABASE_URL) {
  logger.error('FATAL: SUPABASE_URL environment variable is not set', new Error('Missing env var'), { var: 'SUPABASE_URL' });
  process.exit(1);
}

if (!SUPABASE_KEY) {
  logger.error('FATAL: SUPABASE_KEY environment variable is not set', new Error('Missing env var'), { var: 'SUPABASE_KEY' });
  process.exit(1);
}

// Create single Supabase client instance - reused everywhere
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

logger.info('Supabase client initialized', { url: SUPABASE_URL.substring(0, 20) + '...' });

// Health check function
export async function checkDatabaseHealth() {
  try {
    const { error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    return !error;
  } catch (error) {
    logger.error('Database health check failed', error);
    return false;
  }
}
