import { WebSocketManager } from './websocketManager';

// Mock WebSocket
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 0; // CONNECTING
    this.listeners = {};
    this.openImmediately = true; // Flag to control behavior

    if (this.openImmediately) {
      // Use Promise to defer execution
      Promise.resolve().then(() => {
        this.readyState = 1; // OPEN
        this.onopen?.();
      });
    }
  }

  addEventListener(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
    }
  }

  send(data) {
    if (this.readyState !== 1) {
      throw new Error('WebSocket is not open');
    }
  }

  close() {
    this.readyState = 3; // CLOSED
    this.onclose?.();
  }

  simulateMessage(data) {
    const event = new MessageEvent('message', { data: JSON.stringify(data) });
    this.onmessage?.(event);
  }

  simulateError() {
    const event = new Event('error');
    this.onerror?.(event);
  }

  simulateClose() {
    this.close();
  }
}

// Replace global WebSocket with mock
global.WebSocket = MockWebSocket;

describe('WebSocketManager', () => {
  let manager;
  let mockWs;

  beforeEach(() => {
    manager = new WebSocketManager('ws://localhost:3000');
  });

  afterEach(() => {
    if (manager) {
      manager.disconnect();
    }
    jest.clearAllTimers();
  });

  describe('connect()', () => {
    test('should return a promise that resolves when connected', async () => {
      const connectPromise = manager.connect();
      expect(connectPromise).toBeInstanceOf(Promise);
      await expect(connectPromise).resolves.toBeUndefined();
      expect(manager.ws).toBeDefined();
      expect(manager.ws.readyState).toBe(1); // OPEN
    });

    test('should create WebSocket instance', async () => {
      await manager.connect();
      expect(manager.ws).toBeDefined();
      expect(manager.ws.url).toBe('ws://localhost:3000');
    });
  });

  describe('on()', () => {
    test('should register event listener', async () => {
      await manager.connect();
      const callback = jest.fn();
      manager.on('test.event', callback);
      manager.handleMessage({ type: 'test.event', data: 'test' });
      expect(callback).toHaveBeenCalledWith({ type: 'test.event', data: 'test' });
    });

    test('should return unsubscribe function', async () => {
      await manager.connect();
      const callback = jest.fn();
      const unsubscribe = manager.on('test.event', callback);

      manager.handleMessage({ type: 'test.event', data: 'test' });
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      manager.handleMessage({ type: 'test.event', data: 'test' });
      expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
    });

    test('should support multiple listeners for same event', async () => {
      await manager.connect();
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      manager.on('test.event', callback1);
      manager.on('test.event', callback2);

      manager.handleMessage({ type: 'test.event', data: 'test' });
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('emit()', () => {
    test('should send message to server', async () => {
      await manager.connect();
      const sendSpy = jest.spyOn(manager.ws, 'send');

      manager.emit('test.event', { key: 'value' });

      expect(sendSpy).toHaveBeenCalledWith(
        JSON.stringify({ type: 'test.event', data: { key: 'value' } })
      );
    });

    test('should throw error if not connected', () => {
      manager.ws = null;
      expect(() => manager.emit('test.event', {})).toThrow();
    });
  });

  describe('handleMessage()', () => {
    test('should route message to registered listeners', async () => {
      await manager.connect();
      const callback = jest.fn();
      manager.on('test.event', callback);

      manager.handleMessage({ type: 'test.event', data: 'test' });
      expect(callback).toHaveBeenCalledWith({ type: 'test.event', data: 'test' });
    });

    test('should ignore messages with no listeners', async () => {
      await manager.connect();
      expect(() => {
        manager.handleMessage({ type: 'unknown.event', data: 'test' });
      }).not.toThrow();
    });
  });

  describe('heartbeat', () => {
    test('startHeartbeat should send ping every 30 seconds', async () => {
      jest.useFakeTimers();
      try {
        await manager.connect();
        const emitSpy = jest.spyOn(manager, 'emit');

        manager.startHeartbeat();
        expect(manager.heartbeatInterval).toBeDefined();

        jest.advanceTimersByTime(30000);
        expect(emitSpy).toHaveBeenCalledWith('ping', {});

        jest.advanceTimersByTime(30000);
        expect(emitSpy).toHaveBeenCalledWith('ping', {});
      } finally {
        jest.useRealTimers();
      }
    });

    test('stopHeartbeat should clear interval', async () => {
      await manager.connect();
      manager.startHeartbeat();
      expect(manager.heartbeatInterval).toBeDefined();

      manager.stopHeartbeat();
      expect(manager.heartbeatInterval).toBeNull();
    });
  });

  describe('reconnection', () => {
    test('attemptReconnect should increment attempts counter', async () => {
      await manager.connect();

      expect(manager.reconnectAttempts).toBe(0);
      manager.attemptReconnect();
      expect(manager.reconnectAttempts).toBe(1);
    });

    test('attemptReconnect should not exceed max attempts', async () => {
      await manager.connect();
      manager.reconnectAttempts = 5;

      const initialAttempts = manager.reconnectAttempts;
      manager.attemptReconnect();

      // Should not increment beyond max
      expect(manager.reconnectAttempts).toBe(initialAttempts);
    });

    test('attemptReconnect should schedule reconnection after delay', async () => {
      await manager.connect();
      const timeoutSpy = jest.spyOn(global, 'setTimeout');

      manager.attemptReconnect();

      // Should call setTimeout with exponential backoff
      expect(timeoutSpy).toHaveBeenCalled();
      const callArgs = timeoutSpy.mock.calls[0];
      expect(typeof callArgs[1]).toBe('number');
      expect(callArgs[1]).toBeGreaterThan(0);

      timeoutSpy.mockRestore();
    });
  });

  describe('disconnect()', () => {
    test('should close connection and stop heartbeat', async () => {
      await manager.connect();
      manager.startHeartbeat();

      manager.disconnect();

      expect(manager.ws).toBeNull();
      expect(manager.heartbeatInterval).toBeNull();
    });

    test('should clear all listeners', async () => {
      await manager.connect();
      manager.on('test.event', jest.fn());

      manager.disconnect();

      expect(manager.listeners).toEqual({});
    });

    test('should handle disconnect when not connected', () => {
      manager.ws = null;
      expect(() => manager.disconnect()).not.toThrow();
    });
  });
});
