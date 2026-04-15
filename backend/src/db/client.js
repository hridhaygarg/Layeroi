import { createClient } from '@supabase/supabase-js';
import { getConfig } from '../config/env.js';

const config = getConfig();

let supabaseClient = null;

/**
 * Get Supabase client singleton
 * Uses service role key for backend operations (bypasses RLS)
 * @returns {SupabaseClient} Authenticated Supabase client
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(
      config.SUPABASE_URL,
      config.SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false, // Disable auto-refresh for service role
          persistSession: false
        },
        global: {
          headers: {
            'X-Client-Info': 'layer-roi-backend'
          }
        }
      }
    );
  }

  return supabaseClient;
}

/**
 * Get client with user-level permissions (for API requests)
 * Uses anon key with RLS enforcement
 * @param {string} userToken - User's JWT token
 * @returns {SupabaseClient} Authenticated Supabase client with user permissions
 */
export function getSupabaseClientForUser(userToken) {
  return createClient(
    config.SUPABASE_URL,
    config.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          'X-Client-Info': 'layer-roi-backend',
          Authorization: `Bearer ${userToken}`
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export default getSupabaseClient;
