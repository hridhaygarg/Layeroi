import { debounce, throttle, getFirstPaint, getFirstContentfulPaint } from '../utils/performance';
import '@testing-library/jest-dom';

describe('Performance Utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('debounce delays function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    // Call debounced function multiple times
    debouncedFn();
    debouncedFn();
    debouncedFn();

    // Function should not have been called yet
    expect(mockFn).not.toHaveBeenCalled();

    // Fast forward time
    jest.runAllTimers();

    // Function should have been called once
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('throttle limits function execution frequency', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 300);

    // Call throttled function multiple times
    throttledFn();
    throttledFn();
    throttledFn();

    // Function should have been called once immediately
    expect(mockFn).toHaveBeenCalledTimes(1);

    // Fast forward time
    jest.runAllTimers();

    // Call again after timer
    throttledFn();

    // Should now allow another call
    expect(mockFn).toHaveBeenCalled();
  });

  test('getFirstPaint returns paint timing', () => {
    // Mock performance API
    window.performance.getEntriesByType = jest.fn(() => [
      { name: 'first-paint', startTime: 250 },
      { name: 'first-contentful-paint', startTime: 500 },
    ]);

    const fp = getFirstPaint();
    expect(fp).toBe(250);

    const fcp = getFirstContentfulPaint();
    expect(fcp).toBe(500);
  });
});
