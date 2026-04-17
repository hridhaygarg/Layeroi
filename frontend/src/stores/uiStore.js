import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      // Sidebar state
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Modals state
      modals: {},
      openModal: (modalName, data = {}) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [modalName]: data,
          },
        })),
      closeModal: (modalName) =>
        set((state) => {
          const newModals = { ...state.modals };
          delete newModals[modalName];
          return { modals: newModals };
        }),

      // Toasts state
      toasts: [],
      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, toast],
        })),
      removeToast: (toastId) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== toastId),
        })),

      // Notifications state
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      removeNotification: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (notif) => notif.id !== notificationId
          ),
        })),
    }),
    {
      name: 'uiStore',
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
    }
  )
);
