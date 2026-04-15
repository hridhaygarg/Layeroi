import { describe, it, expect, vi } from 'vitest';
import { errorHandler, AppError } from '../errorHandler.js';

describe('Error Handler Middleware', () => {
  it('should handle AppError with proper status code', () => {
    const error = new AppError('Invalid input', 400, 'INVALID_INPUT');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('INVALID_INPUT');
  });

  it('should format error response correctly', () => {
    const error = new AppError('Not found', 404, 'NOT_FOUND');
    const response = error.toJSON();
    expect(response.success).toBe(false);
    expect(response.error.code).toBe('NOT_FOUND');
    expect(response.error.message).toBe('Not found');
  });

  it('should handle database errors', () => {
    const error = new AppError('Database connection failed', 500, 'DB_ERROR');
    expect(error.statusCode).toBe(500);
  });

  it('should handle authorization errors', () => {
    const error = new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    expect(error.statusCode).toBe(401);
  });

  it('should handle rate limit errors', () => {
    const error = new AppError('Rate limit exceeded', 429, 'RATE_LIMITED');
    expect(error.statusCode).toBe(429);
  });

  it('should provide retry guidance for rate limits', () => {
    const error = new AppError('Rate limited', 429, 'RATE_LIMITED', { retryAfter: 60 });
    const response = error.toJSON();
    expect(response.error.retryAfter).toBe(60);
  });

  it('should exclude stack trace in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new AppError('Test error', 500, 'TEST_ERROR');
    const response = error.toJSON();

    expect(response.error.stack).toBeUndefined();
    process.env.NODE_ENV = originalEnv;
  });

  it('should include stack trace in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new AppError('Test error', 500, 'TEST_ERROR');
    const response = error.toJSON();

    expect(response.error.stack).toBeDefined();
    process.env.NODE_ENV = originalEnv;
  });

  it('should handle middleware error responses', () => {
    const error = new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    const req = { method: 'GET', path: '/api/test' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    const call = res.json.mock.calls[0][0];
    expect(call.success).toBe(false);
    expect(call.error.code).toBe('UNAUTHORIZED');
  });

  it('should set Retry-After header for rate limits', () => {
    const error = new AppError('Rate limited', 429, 'RATE_LIMITED', { retryAfter: 120 });
    const req = { method: 'GET', path: '/api/test' };
    const res = {
      status: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    errorHandler(error, req, res, next);

    expect(res.set).toHaveBeenCalledWith('Retry-After', 120);
  });

  it('should log errors with context', () => {
    const error = new AppError('Test error', 500, 'TEST_ERROR');
    const req = { method: 'POST', path: '/api/data' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    // Should not throw and should process the error
    expect(() => {
      errorHandler(error, req, res, next);
    }).not.toThrow();
  });
});
