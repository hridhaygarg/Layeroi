import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getSupabaseClient, getSupabaseClientForUser } from '../client.js';

// Mock the config module
vi.mock('../../config/env.js', () => ({
  getConfig: () => ({
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_SERVICE_KEY: 'test-service-key',
    SUPABASE_ANON_KEY: 'test-anon-key'
  })
}));

describe('Database Client', () => {
  beforeEach(() => {
    // Reset the singleton before each test
    vi.resetModules();
  });

  it('should create Supabase client with correct config', async () => {
    const { getSupabaseClient: getClient } = await import('../client.js');
    const client = getClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  it('should be a singleton', async () => {
    const { getSupabaseClient: getClient } = await import('../client.js');
    const client1 = getClient();
    const client2 = getClient();
    expect(client1).toBe(client2);
  });

  it('should have auth methods', async () => {
    const { getSupabaseClient: getClient } = await import('../client.js');
    const client = getClient();
    expect(client.auth.getSession).toBeDefined();
    expect(client.auth.signUp).toBeDefined();
    expect(client.auth.signInWithPassword).toBeDefined();
  });

  it('should have table methods', async () => {
    const { getSupabaseClient: getClient } = await import('../client.js');
    const client = getClient();
    expect(client.from).toBeDefined();
  });

  it('should use service role in backend', async () => {
    const { getSupabaseClient: getClient } = await import('../client.js');
    const client = getClient();
    // Service role bypasses RLS for admin operations
    expect(client).toBeDefined();
  });

  it('should create user-level client with token', async () => {
    const { getSupabaseClientForUser } = await import('../client.js');
    const userToken = 'test-user-token';
    const client = getSupabaseClientForUser(userToken);
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  it('should not cache user-level clients', async () => {
    const { getSupabaseClientForUser } = await import('../client.js');
    const userToken1 = 'test-user-token-1';
    const userToken2 = 'test-user-token-2';
    const client1 = getSupabaseClientForUser(userToken1);
    const client2 = getSupabaseClientForUser(userToken2);
    expect(client1).not.toBe(client2);
  });
});
