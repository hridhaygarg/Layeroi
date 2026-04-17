import { renderHook, act } from '@testing-library/react';
import { useUIStore } from '../uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      sidebarOpen: true,
      modals: {},
      toasts: [],
      notifications: [],
    });
    // Clear localStorage
    localStorage.clear();
  });

  describe('Sidebar', () => {
    it('should initialize with sidebar open', () => {
      const { result } = renderHook(() => useUIStore());
      expect(result.current.sidebarOpen).toBe(true);
    });

    it('should toggle sidebar state', () => {
      const { result } = renderHook(() => useUIStore());
      expect(result.current.sidebarOpen).toBe(true);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarOpen).toBe(false);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarOpen).toBe(true);
    });

    it('should set sidebar state directly', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSidebarOpen(false);
      });

      expect(result.current.sidebarOpen).toBe(false);
    });
  });

  describe('Modals', () => {
    it('should open a modal', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openModal('confirmDelete', { id: 123 });
      });

      expect(result.current.modals.confirmDelete).toEqual({ id: 123 });
    });

    it('should close a modal', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openModal('confirmDelete', { id: 123 });
      });

      expect(result.current.modals.confirmDelete).toEqual({ id: 123 });

      act(() => {
        result.current.closeModal('confirmDelete');
      });

      expect(result.current.modals.confirmDelete).toBeUndefined();
    });

    it('should handle multiple modals', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openModal('modal1', { data: 'test1' });
        result.current.openModal('modal2', { data: 'test2' });
      });

      expect(result.current.modals.modal1).toEqual({ data: 'test1' });
      expect(result.current.modals.modal2).toEqual({ data: 'test2' });

      act(() => {
        result.current.closeModal('modal1');
      });

      expect(result.current.modals.modal1).toBeUndefined();
      expect(result.current.modals.modal2).toEqual({ data: 'test2' });
    });
  });

  describe('Toasts', () => {
    it('should add a toast', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addToast({
          id: '1',
          message: 'Success!',
          type: 'success',
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toEqual({
        id: '1',
        message: 'Success!',
        type: 'success',
      });
    });

    it('should remove a toast by id', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addToast({ id: '1', message: 'Toast 1', type: 'success' });
        result.current.addToast({ id: '2', message: 'Toast 2', type: 'error' });
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        result.current.removeToast('1');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].id).toBe('2');
    });

    it('should handle multiple toasts', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addToast({ id: '1', message: 'Toast 1', type: 'success' });
        result.current.addToast({ id: '2', message: 'Toast 2', type: 'error' });
        result.current.addToast({ id: '3', message: 'Toast 3', type: 'info' });
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.removeToast('2');
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts.map(t => t.id)).toEqual(['1', '3']);
    });
  });

  describe('Notifications', () => {
    it('should add a notification', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({
          id: '1',
          title: 'New Message',
          message: 'You have a new message',
        });
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].title).toBe('New Message');
    });

    it('should remove a notification by id', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addNotification({
          id: '1',
          title: 'Notification 1',
          message: 'Message 1',
        });
        result.current.addNotification({
          id: '2',
          title: 'Notification 2',
          message: 'Message 2',
        });
      });

      expect(result.current.notifications).toHaveLength(2);

      act(() => {
        result.current.removeNotification('1');
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].id).toBe('2');
    });
  });

  describe('localStorage persistence', () => {
    it('should support persisting state to localStorage', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSidebarOpen(false);
      });

      // Verify state changed
      expect(result.current.sidebarOpen).toBe(false);

      // Verify localStorage was accessed (Zustand persist middleware is configured)
      const stored = localStorage.getItem('uiStore');
      expect(stored).not.toBeNull();
    });

    it('should initialize with default state', () => {
      const { result } = renderHook(() => useUIStore());
      expect(result.current.sidebarOpen).toBe(true);
    });
  });
});
