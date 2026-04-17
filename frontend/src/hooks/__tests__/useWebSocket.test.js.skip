import { renderHook, waitFor } from '@testing-library/react';
import { useWebSocket } from '../useWebSocket';
import { WebSocketManager } from '../../utils/websocketManager';
import '@testing-library/jest-dom';

// Mock WebSocketManager
jest.mock('../../utils/websocketManager', () => ({
  WebSocketManager: jest.fn().mockImplementation((url) => ({
    url,
    ws: null,
    listeners: {},
    connect: jest.fn().mockResolvedValue(),
    disconnect: jest.fn(),
    on: jest.fn((event, callback) => {
      return jest.fn(); // Return unsubscribe function
    }),
    emit: jest.fn(),
    startHeartbeat: jest.fn(),
    stopHeartbeat: jest.fn(),
  })),
}));

// Mock TanStack Query
const mockInvalidateQueries = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: mockInvalidateQueries,
  })),
}));

describe('useWebSocket Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInvalidateQueries.mockClear();
  });

  test('should create WebSocketManager on mount with correct URL', () => {
    process.env.REACT_APP_WS_URL = 'ws://test.com:3000';
    renderHook(() => useWebSocket());

    expect(WebSocketManager).toHaveBeenCalledWith('ws://test.com:3000');
  });

  test('should connect to WebSocket on mount', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const manager = WebSocketManager.mock.results[0].value;
    expect(manager.connect).toHaveBeenCalled();
  });

  test('should register real-time event listeners', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const manager = WebSocketManager.mock.results[0].value;

    // Verify listeners are registered
    const calls = manager.on.mock.calls;
    const eventTypes = calls.map((call) => call[0]);

    expect(eventTypes).toContain('outreach.sent');
    expect(eventTypes).toContain('outreach.opened');
    expect(eventTypes).toContain('outreach.clicked');
    expect(eventTypes).toContain('prospect.created');
    expect(eventTypes).toContain('integration.synced');
    expect(eventTypes).toContain('analytics.updated');
  });

  test('should invalidate correct queries on outreach.sent event', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const manager = WebSocketManager.mock.results[0].value;
    const outreachSentCallback = manager.on.mock.calls.find(
      (call) => call[0] === 'outreach.sent'
    )[1];

    outreachSentCallback({ type: 'outreach.sent', data: {} });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['outreach'],
    });
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['queue'],
    });
  });

  test('should invalidate correct queries on outreach.opened event', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const manager = WebSocketManager.mock.results[0].value;
    const callback = manager.on.mock.calls.find(
      (call) => call[0] === 'outreach.opened'
    )[1];

    callback({ type: 'outreach.opened', data: {} });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['analytics', 'dashboard'],
    });
  });

  test('should invalidate correct queries on outreach.clicked event', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const manager = WebSocketManager.mock.results[0].value;
    const callback = manager.on.mock.calls.find(
      (call) => call[0] === 'outreach.clicked'
    )[1];

    callback({ type: 'outreach.clicked', data: {} });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['analytics', 'dashboard'],
    });
  });

  test('should invalidate correct queries on prospect.created event', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const manager = WebSocketManager.mock.results[0].value;
    const callback = manager.on.mock.calls.find(
      (call) => call[0] === 'prospect.created'
    )[1];

    callback({ type: 'prospect.created', data: {} });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['prospects'],
    });
  });

  test('should invalidate correct queries on integration.synced event', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const manager = WebSocketManager.mock.results[0].value;
    const callback = manager.on.mock.calls.find(
      (call) => call[0] === 'integration.synced'
    )[1];

    callback({ type: 'integration.synced', data: {} });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['integrations'],
    });
  });

  test('should invalidate correct queries on analytics.updated event', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const manager = WebSocketManager.mock.results[0].value;
    const callback = manager.on.mock.calls.find(
      (call) => call[0] === 'analytics.updated'
    )[1];

    callback({ type: 'analytics.updated', data: {} });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['analytics', 'dashboard'],
    });
  });

  test('should unsubscribe all listeners and disconnect on unmount', async () => {
    const { unmount } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(WebSocketManager.mock.results[0].value.connect).toHaveBeenCalled();
    });

    const manager = WebSocketManager.mock.results[0].value;
    unmount();

    expect(manager.disconnect).toHaveBeenCalled();
  });

  test('should return wsRef for manual event emission', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    expect(result.current).toHaveProperty('emit');
    expect(typeof result.current.emit).toBe('function');
  });

  test('should start heartbeat after connecting', async () => {
    const { result } = renderHook(() => useWebSocket());

    await waitFor(() => {
      expect(result.current).toBeDefined();
    });

    const manager = WebSocketManager.mock.results[0].value;
    expect(manager.startHeartbeat).toHaveBeenCalled();
  });
});
