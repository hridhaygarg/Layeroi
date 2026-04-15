import { describe, it, expect, beforeEach } from 'vitest';
import { loadConfig } from '../env.js';

describe('Environment Configuration', () => {
  beforeEach(() => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_KEY;
    delete process.env.JWT_SECRET;
    delete process.env.REDIS_URL;
  });

  it('should load required environment variables', () => {
    process.env.NODE_ENV = 'test';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'test-key';
    process.env.JWT_SECRET = 'test-secret-minimum-32-characters!!';
    process.env.REDIS_URL = 'redis://localhost:6379';

    const config = loadConfig();

    expect(config.NODE_ENV).toBe('test');
    expect(config.SUPABASE_URL).toBe('https://test.supabase.co');
    expect(config.JWT_SECRET.length).toBeGreaterThanOrEqual(32);
  });

  it('should throw error if required var missing', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.SUPABASE_URL;

    expect(() => loadConfig()).toThrow('SUPABASE_URL');
  });

  it('should validate JWT_SECRET minimum length', () => {
    process.env.NODE_ENV = 'production';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'key';
    process.env.REDIS_URL = 'redis://localhost';
    process.env.JWT_SECRET = 'tooshort';

    expect(() => loadConfig()).toThrow('32 characters');
  });

  it('should set defaults for optional vars', () => {
    process.env.NODE_ENV = 'test';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'key';
    process.env.JWT_SECRET = 'test-secret-minimum-32-characters!!';
    process.env.REDIS_URL = 'redis://localhost';
    delete process.env.LOG_LEVEL;

    const config = loadConfig();

    expect(config.LOG_LEVEL).toBe('info');
    expect(config.PORT).toBe(3001);
  });

  it('should coerce PORT to integer', () => {
    process.env.NODE_ENV = 'test';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'key';
    process.env.JWT_SECRET = 'test-secret-minimum-32-characters!!';
    process.env.REDIS_URL = 'redis://localhost';
    process.env.PORT = '4000';

    const config = loadConfig();

    expect(typeof config.PORT).toBe('number');
    expect(config.PORT).toBe(4000);
  });
});
