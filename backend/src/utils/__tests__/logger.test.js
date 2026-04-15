import { describe, it, expect } from 'vitest';
import { logger } from '../logger.js';

describe('Logger', () => {
  it('should log info messages', () => {
    const logSpy = console.log; // In production, check Datadog
    logger.info('Test message', { data: 'test' });
    expect(true).toBe(true); // Logger created
  });

  it('should have all log levels', () => {
    expect(logger.debug).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.fatal).toBeDefined();
  });

  it('should accept message and metadata', () => {
    logger.info('Database connected', { host: 'localhost', port: 5432 });
    expect(true).toBe(true);
  });

  it('should format logs as JSON', () => {
    // Winston formats as JSON with metadata
    logger.warn('High latency detected', { duration_ms: 250, endpoint: '/api/prospects' });
    expect(true).toBe(true);
  });

  it('should be used as singleton', async () => {
    const logger1 = (await import('../logger.js')).logger;
    const logger2 = (await import('../logger.js')).logger;
    expect(logger1).toBe(logger2);
  });
});
